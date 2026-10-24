import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'rsvp_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // stay signed in for 30 days

// The cookie value is derived from the password, so changing
// RSVP_ADMIN_PASSWORD signs out every device.
export function adminToken() {
    const password = process.env.RSVP_ADMIN_PASSWORD;
    if (!password) return null;
    return createHmac('sha256', password).update('rsvp-admin-v1').digest('hex');
}

export function safeEqual(a, b) {
    const x = Buffer.from(String(a ?? ''));
    const y = Buffer.from(String(b ?? ''));
    return x.length === y.length && timingSafeEqual(x, y);
}
