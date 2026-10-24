'use client';

import { useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH;
const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);
const EMPTY = { name: '', phone: '', attending: '', guests: '2', message: '', website: '' };

export default function RsvpForm() {
    const [form, setForm] = useState(EMPTY);
    const [status, setStatus] = useState('idle'); // idle | sending | done
    const [error, setError] = useState('');

    const set = key => e => {
        setForm(f => ({ ...f, [key]: e.target.value }));
        setError('');
    };

    async function submit(e) {
        e.preventDefault();
        setError('');
        if (!form.attending) {
            setError('Please let us know if you can attend.');
            return;
        }
        setStatus('sending');
        try {
            const res = await fetch(`${BASE}/api/rsvp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
            setStatus('done');
        } catch (err) {
            setError(err.message === 'Failed to fetch' ? 'Could not connect. Please check your internet and try again.' : err.message);
            setStatus('idle');
        }
    }

    if (status === 'done') {
        const firstName = form.name.trim().split(' ')[0];
        return (
            <div className="rsvp-done">
                <div className="rsvp-done-title">Thank you, {firstName}!</div>
                <p>
                    {form.attending === 'yes'
                        ? `We're delighted you'll be joining us — we've saved ${form.guests} ${form.guests === '1' ? 'seat' : 'seats'} for you.`
                        : "We'll miss you, and we're grateful for your blessings."}
                </p>
                <button type="button" className="rsvp-link" onClick={() => setStatus('idle')}>
                    Change my response
                </button>
            </div>
        );
    }

    return (
        <form className="rsvp-form" onSubmit={submit} noValidate>
            <div className="field">
                <label htmlFor="rsvp-name">Your name</label>
                <input id="rsvp-name" type="text" autoComplete="name" required maxLength={80}
                    value={form.name} onChange={set('name')} placeholder="e.g. Rameshbhai Patel" />
            </div>

            <div className="field">
                <label htmlFor="rsvp-phone">Mobile number</label>
                <input id="rsvp-phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={16}
                    value={form.phone} onChange={set('phone')} placeholder="98765 43210" />
            </div>

            <div className="field">
                <span className="field-label" id="rsvp-attending">Will you attend?</span>
                <div className="choice" role="radiogroup" aria-labelledby="rsvp-attending">
                    {[['yes', 'Joyfully accept'], ['no', 'Regretfully decline']].map(([value, label]) => (
                        <label key={value} className={form.attending === value ? 'on' : ''}>
                            <input type="radio" name="attending" value={value}
                                checked={form.attending === value} onChange={set('attending')} />
                            {label}
                        </label>
                    ))}
                </div>
            </div>

            {form.attending === 'yes' && (
                <div className="field">
                    <label htmlFor="rsvp-guests">Number of guests (including you)</label>
                    <select id="rsvp-guests" value={form.guests} onChange={set('guests')}>
                        {GUEST_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            )}

            <div className="field">
                <label htmlFor="rsvp-message">Blessings or a message <span>(optional)</span></label>
                <textarea id="rsvp-message" rows={3} maxLength={500}
                    value={form.message} onChange={set('message')} />
            </div>

            {/* Honeypot for bots — hidden from guests and screen readers */}
            <div className="hp" aria-hidden="true">
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
            </div>

            {error && <p className="rsvp-error" role="alert">{error}</p>}

            <div className="rsvp-actions">
                <button type="submit" className="btn" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send RSVP'}
                </button>
            </div>
        </form>
    );
}
