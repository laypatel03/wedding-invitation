import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { at, TZ_OFFSET } from './format';

export { formatDate, formatPhone, formatTime } from './format';

// Editable invitation details, changed from /reception/admin. Kept outside the
// app folder on the server (SETTINGS_FILE) so redeploys never overwrite them.
const SETTINGS_FILE = process.env.SETTINGS_FILE || path.join(process.cwd(), 'data', 'settings.json');

export const EVENT_ICONS = {
    welcome: 'Welcome drink',
    rings: 'Rings',
    dinner: 'Dinner',
    music: 'Music',
};

export const LIMITS = { events: 10, contacts: 3 };

// What the invitation showed before the admin page existed
export const DEFAULT_SETTINGS = {
    date: '2027-01-29',
    startTime: '17:00',
    endTime: '00:00',
    events: [
        { name: 'Grand Welcome', time: '17:00', onwards: true, description: 'Guest Arrival & Welcome Refreshments', icon: 'welcome' },
        { name: 'Couple Entrance & Celebration', time: '18:00', onwards: false, description: 'Welcoming the Newlyweds & Celebration Toast', icon: 'rings' },
        { name: 'Royal Banquet & Festivities', time: '19:30', onwards: true, description: 'Exquisite Dinner Feast, Music & Photo Moments', icon: 'dinner' },
    ],
    contacts: [
        { name: 'Shiv Patel', call: '919824856661', whatsapp: '12018569575', email: 'shivpatel6661@gmail.com' },
    ],
    venue: {
        name: 'JP Farm',
        area: 'Navsari, Gujarat',
        address: 'Gandevi Road, near Salej, Ichhapur, Navsari, Gujarat 396350',
        mapUrl: 'https://maps.google.com/?q=JP+Farm+Gandevi+Road+near+Salej+Ichhapur+Navsari+Gujarat+396350',
    },
};

// ---------- reading & saving ----------

// cache(): read the file once per request even if several components ask
export const getSettings = cache(async () => {
    try {
        const saved = JSON.parse(await readFile(/*turbopackIgnore: true*/ SETTINGS_FILE, 'utf8'));
        const { data } = validateSettings(saved);
        return data ?? DEFAULT_SETTINGS;
    } catch (err) {
        if (err.code !== 'ENOENT') console.error('Could not read settings, using defaults:', err.message);
        return DEFAULT_SETTINGS;
    }
});

export async function saveSettings(settings) {
    await mkdir(/*turbopackIgnore: true*/ path.dirname(SETTINGS_FILE), { recursive: true });
    // Write to a temp file then rename, so a crash mid-save never leaves a broken file
    const tmp = SETTINGS_FILE + '.tmp';
    await writeFile(/*turbopackIgnore: true*/ tmp, JSON.stringify(settings, null, 2) + '\n', 'utf8');
    await rename(/*turbopackIgnore: true*/ tmp, SETTINGS_FILE);
}

// ---------- validation ----------

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, max) {
    return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
}

// Digits only, with country code. A bare 10-digit number is treated as Indian.
export function normalizePhone(value) {
    let digits = String(value ?? '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length === 10) digits = '91' + digits;
    return digits.length >= 11 && digits.length <= 15 ? digits : null;
}

// Returns { data } or { error } — error text is shown in the admin page as-is.
export function validateSettings(input) {
    const date = String(input?.date ?? '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(`${date}T12:00:00${TZ_OFFSET}`))) {
        return { error: 'Please choose a valid date.' };
    }
    const startTime = String(input?.startTime ?? '');
    const endTime = String(input?.endTime ?? '');
    if (!TIME_RE.test(startTime)) return { error: 'Please set a start time.' };
    if (!TIME_RE.test(endTime)) return { error: 'Please set an end time.' };

    const rawEvents = Array.isArray(input?.events) ? input.events : [];
    if (rawEvents.length < 1) return { error: 'Add at least one event to the programme.' };
    if (rawEvents.length > LIMITS.events) return { error: `The programme can have at most ${LIMITS.events} events.` };
    const events = [];
    for (const [i, e] of rawEvents.entries()) {
        const name = text(e?.name, 60);
        const time = String(e?.time ?? '');
        if (!name) return { error: `Event ${i + 1}: please enter a name.` };
        if (!TIME_RE.test(time)) return { error: `“${name}”: please set a time.` };
        events.push({
            name,
            time,
            onwards: Boolean(e?.onwards),
            description: text(e?.description, 120),
            icon: e?.icon in EVENT_ICONS ? e.icon : 'welcome',
        });
    }
    // Show the programme in time order, counting from the start so events
    // after midnight come last
    const toMinutes = t => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    const sinceStart = t => (toMinutes(t) - toMinutes(startTime) + 1440) % 1440;
    events.sort((a, b) => sinceStart(a.time) - sinceStart(b.time));

    const rawContacts = Array.isArray(input?.contacts) ? input.contacts : [];
    if (rawContacts.length < 1) return { error: 'Add at least one contact person.' };
    if (rawContacts.length > LIMITS.contacts) return { error: `You can list at most ${LIMITS.contacts} contacts.` };
    const contacts = [];
    for (const [i, c] of rawContacts.entries()) {
        const name = text(c?.name, 60);
        if (!name) return { error: `Contact ${i + 1}: please enter a name.` };
        const call = normalizePhone(c?.call);
        const whatsapp = normalizePhone(c?.whatsapp);
        if (call === null) return { error: `${name}: the call number doesn't look right. Include the country code, e.g. +91 98765 43210.` };
        if (whatsapp === null) return { error: `${name}: the WhatsApp number doesn't look right. Include the country code, e.g. +1 201 555 0123.` };
        const email = text(c?.email, 100);
        if (email && !EMAIL_RE.test(email)) return { error: `${name}: the email address doesn't look right.` };
        if (!call && !whatsapp && !email) return { error: `${name}: add at least a phone number, WhatsApp number or email.` };
        contacts.push({ name, call, whatsapp, email });
    }

    const venueName = text(input?.venue?.name, 60);
    if (!venueName) return { error: 'Please enter the venue name.' };
    const address = text(input?.venue?.address, 200);
    let mapUrl = String(input?.venue?.mapUrl ?? '').trim();
    if (mapUrl && !/^https:\/\/\S+$/.test(mapUrl)) return { error: 'The map link must start with https://' };
    if (!mapUrl && address) mapUrl = 'https://maps.google.com/?q=' + encodeURIComponent(`${venueName}, ${address}`);

    return {
        data: {
            date, startTime, endTime, events, contacts,
            venue: { name: venueName, area: text(input?.venue?.area, 60), address, mapUrl },
        },
    };
}

// ---------- derived values for the invitation ----------

export function startTimestamp(s) {
    return at(s.date, s.startTime).getTime();
}

// Google Calendar link; an end time at or before the start means "after midnight"
export function calendarUrl(s) {
    const start = at(s.date, s.startTime);
    let end = at(s.date, s.endTime);
    if (end <= start) end = new Date(end.getTime() + 86400000);
    const utc = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: 'Bhavi & Priyanka Wedding Reception',
        dates: `${utc(start)}/${utc(end)}`,
        details: `Grand Wedding Reception of Bhavi & Priyanka at ${s.venue.name}`,
        location: [s.venue.name, s.venue.address].filter(Boolean).join(', '),
    });
    return 'https://calendar.google.com/calendar/render?' + params.toString();
}

// Changes whenever anything shown in the share preview changes, so apps re-fetch it
export function previewVersion(s) {
    const key = [s.date, s.startTime, s.venue.name, s.venue.area].join('|');
    let h = 0;
    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h.toString(36);
}
