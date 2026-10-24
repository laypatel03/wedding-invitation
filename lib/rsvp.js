import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// One JSON object per line. Set RSVP_FILE on the server to keep it outside the app folder.
const RSVP_FILE = process.env.RSVP_FILE || path.join(process.cwd(), 'data', 'rsvps.jsonl');

export const MAX_GUESTS = 10;

// Returns { data } or { error } — error text is shown to the guest as-is.
export function validateRsvp(input) {
    const name = String(input?.name ?? '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 80) return { error: 'Please enter your name.' };

    let phone = String(input?.phone ?? '').replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone; // Indian mobile without country code
    if (phone.length < 11 || phone.length > 15) return { error: 'Please enter a valid mobile number.' };

    const attending = input?.attending;
    if (attending !== 'yes' && attending !== 'no') return { error: 'Please let us know if you can attend.' };

    let guests = 0;
    if (attending === 'yes') {
        guests = Number(input?.guests);
        if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
            return { error: `Number of guests must be between 1 and ${MAX_GUESTS}.` };
        }
    }

    const message = String(input?.message ?? '').trim().slice(0, 500);

    return { data: { name, phone, attending, guests, message } };
}

export async function addRsvp(data) {
    await mkdir(/*turbopackIgnore: true*/ path.dirname(RSVP_FILE), { recursive: true });
    const entry = { ...data, at: new Date().toISOString() };
    await appendFile(/*turbopackIgnore: true*/ RSVP_FILE, JSON.stringify(entry) + '\n', 'utf8');
    return entry;
}

// Every submission, oldest first.
export async function readAllRsvps() {
    let text;
    try {
        text = await readFile(/*turbopackIgnore: true*/ RSVP_FILE, 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
    return text.split('\n').filter(Boolean).flatMap(line => {
        try { return [JSON.parse(line)]; } catch { return []; }
    });
}

// A guest who submits again replaces their earlier answer (matched by phone).
// Newest first; `updates` counts earlier submissions from the same number.
export async function readLatestRsvps() {
    const byPhone = new Map();
    for (const r of await readAllRsvps()) {
        const prev = byPhone.get(r.phone);
        byPhone.set(r.phone, { ...r, updates: prev ? prev.updates + 1 : 0 });
    }
    return [...byPhone.values()].sort((a, b) => b.at.localeCompare(a.at));
}
