import { addRsvp, validateRsvp } from '@/lib/rsvp';

// Simple per-IP limit so the form can't be flooded: 10 submissions per hour.
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 10;
const hits = new Map();

function rateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > LIMIT;
}

export async function POST(req) {
    if (Number(req.headers.get('content-length') || 0) > 5000) {
        return Response.json({ error: 'Request too large.' }, { status: 413 });
    }

    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    if (rateLimited(ip)) {
        return Response.json({ error: 'Too many responses from this device. Please try again later.' }, { status: 429 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    // Honeypot: real guests never see this field, bots fill it in
    if (body?.website) return Response.json({ ok: true });

    const { data, error } = validateRsvp(body);
    if (error) return Response.json({ error }, { status: 400 });

    await addRsvp(data);
    return Response.json({ ok: true });
}
