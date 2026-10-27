'use client';

import { useEffect, useState, useTransition } from 'react';
import { formatDate, formatPhone, formatTime } from '@/lib/format';
import { updateSettings } from '../actions';

// Phone numbers are stored as digits; show them formatted for editing
function toForm(s) {
    return {
        ...s,
        events: s.events.map(e => ({ ...e })),
        contacts: s.contacts.map(c => ({ ...c, call: formatPhone(c.call), whatsapp: formatPhone(c.whatsapp) })),
        venue: { ...s.venue },
    };
}

function safeDateLine(date, time) {
    try {
        const { weekday, day } = formatDate(date);
        return `${weekday} · ${day} · ${formatTime(time)} Onwards`;
    } catch {
        return '—';
    }
}

export default function SettingsForm({ initial, icons, limits }) {
    const [form, setForm] = useState(() => toForm(initial));
    const [saved, setSaved] = useState(() => JSON.stringify(toForm(initial)));
    const [status, setStatus] = useState(null); // { ok } | { error }
    const [pending, startTransition] = useTransition();
    const dirty = JSON.stringify(form) !== saved;

    // Warn before leaving the page with unsaved changes
    useEffect(() => {
        if (!dirty) return;
        const warn = e => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    function update(fn) {
        setForm(f => {
            const next = structuredClone(f);
            fn(next);
            return next;
        });
        setStatus(null);
    }
    const field = (getter, key) => e => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        update(f => { getter(f)[key] = value; });
    };

    function save(e) {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateSettings(form);
            if (result.error) {
                setStatus({ error: result.error });
                return;
            }
            const fresh = toForm(result.settings);
            setForm(fresh);
            setSaved(JSON.stringify(fresh));
            setStatus({ ok: true });
        });
    }

    return (
        <form className="settings" onSubmit={save} noValidate>
            {/* ---------- Date & time ---------- */}
            <section className="card">
                <h2>Date &amp; time</h2>
                <div className="grid three">
                    <label className="fld">
                        <span>Date</span>
                        <input type="date" value={form.date} onChange={field(f => f, 'date')} required />
                    </label>
                    <label className="fld">
                        <span>Starts at</span>
                        <input type="time" value={form.startTime} onChange={field(f => f, 'startTime')} required />
                    </label>
                    <label className="fld">
                        <span>Ends at</span>
                        <input type="time" value={form.endTime} onChange={field(f => f, 'endTime')} required />
                    </label>
                </div>
                <p className="hint">
                    Shows as <b>{safeDateLine(form.date, form.startTime)}</b>. The countdown and Add to Calendar
                    use these times. An end time earlier than the start means after midnight.
                </p>
            </section>

            {/* ---------- Programme ---------- */}
            <section className="card">
                <h2>Programme</h2>
                <ol className="items">
                    {form.events.map((ev, i) => (
                        <li key={i} className="item">
                            <div className="item-head">
                                <b>Event {i + 1}</b>
                                <div className="item-actions">
                                    <button type="button" className="danger" disabled={form.events.length === 1}
                                        onClick={() => update(f => { f.events.splice(i, 1); })}>Remove</button>
                                </div>
                            </div>
                            <div className="grid two">
                                <label className="fld wide">
                                    <span>Name</span>
                                    <input value={ev.name} maxLength={60} onChange={field(f => f.events[i], 'name')} />
                                </label>
                                <label className="fld">
                                    <span>Time</span>
                                    <input type="time" value={ev.time} onChange={field(f => f.events[i], 'time')} />
                                </label>
                                <label className="fld check">
                                    <input type="checkbox" checked={ev.onwards} onChange={field(f => f.events[i], 'onwards')} />
                                    <span>Add “Onwards”</span>
                                </label>
                                <label className="fld wide">
                                    <span>Description <i>(optional)</i></span>
                                    <input value={ev.description} maxLength={120} onChange={field(f => f.events[i], 'description')} />
                                </label>
                                <label className="fld">
                                    <span>Icon</span>
                                    <select value={ev.icon} onChange={field(f => f.events[i], 'icon')}>
                                        {Object.entries(icons).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                </label>
                            </div>
                        </li>
                    ))}
                </ol>
                <p className="hint">Events are shown on the invitation in time order; they&apos;re sorted when you save.</p>
                <button type="button" className="add" disabled={form.events.length >= limits.events}
                    onClick={() => update(f => { f.events.push({ name: '', time: f.startTime, onwards: false, description: '', icon: 'welcome' }); })}>
                    + Add event
                </button>
            </section>

            {/* ---------- Contact ---------- */}
            <section className="card">
                <h2>Contact</h2>
                <ol className="items">
                    {form.contacts.map((c, i) => (
                        <li key={i} className="item">
                            <div className="item-head">
                                <b>Contact {i + 1}</b>
                                <div className="item-actions">
                                    <button type="button" className="danger" disabled={form.contacts.length === 1}
                                        onClick={() => update(f => { f.contacts.splice(i, 1); })}>Remove</button>
                                </div>
                            </div>
                            <div className="grid two">
                                <label className="fld">
                                    <span>Name</span>
                                    <input value={c.name} maxLength={60} onChange={field(f => f.contacts[i], 'name')} />
                                </label>
                                <label className="fld">
                                    <span>Email <i>(optional)</i></span>
                                    <input type="email" value={c.email} maxLength={100} onChange={field(f => f.contacts[i], 'email')} />
                                </label>
                                <label className="fld">
                                    <span>Call number</span>
                                    <input type="tel" value={c.call} onChange={field(f => f.contacts[i], 'call')} placeholder="+91 98765 43210" />
                                </label>
                                <label className="fld">
                                    <span>WhatsApp number</span>
                                    <input type="tel" value={c.whatsapp} onChange={field(f => f.contacts[i], 'whatsapp')} placeholder="+1 201 555 0123" />
                                </label>
                            </div>
                        </li>
                    ))}
                </ol>
                <p className="hint">Include the country code. A 10-digit number without one is treated as Indian (+91). Leave a field empty to hide that button.</p>
                <button type="button" className="add" disabled={form.contacts.length >= limits.contacts}
                    onClick={() => update(f => { f.contacts.push({ name: '', call: '', whatsapp: '', email: '' }); })}>
                    + Add contact
                </button>
            </section>

            {/* ---------- Venue ---------- */}
            <section className="card">
                <h2>Venue</h2>
                <div className="grid two">
                    <label className="fld">
                        <span>Venue name</span>
                        <input value={form.venue.name} maxLength={60} onChange={field(f => f.venue, 'name')} />
                    </label>
                    <label className="fld">
                        <span>Town / area</span>
                        <input value={form.venue.area} maxLength={60} onChange={field(f => f.venue, 'area')} placeholder="Navsari, Gujarat" />
                    </label>
                    <label className="fld wide">
                        <span>Full address</span>
                        <input value={form.venue.address} maxLength={200} onChange={field(f => f.venue, 'address')} />
                    </label>
                    <label className="fld wide">
                        <span>Google Maps link <i>(optional)</i></span>
                        <input type="url" value={form.venue.mapUrl} onChange={field(f => f.venue, 'mapUrl')} placeholder="https://maps.google.com/…" />
                    </label>
                </div>
                <p className="hint">The town / area appears under the names at the top and in the link preview. Leave the map link empty to create one from the address.</p>
            </section>

            {/* ---------- Save ---------- */}
            <div className="save-bar">
                <div className="save-status" role="status">
                    {status?.error && <span className="err">{status.error}</span>}
                    {status?.ok && !dirty && <span className="ok">Saved — the invitation is updated.</span>}
                    {!status && dirty && <span>You have unsaved changes.</span>}
                </div>
                <button type="submit" className="btn" disabled={!dirty || pending}>
                    {pending ? 'Saving…' : 'Save changes'}
                </button>
            </div>
        </form>
    );
}
