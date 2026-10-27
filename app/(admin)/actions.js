'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, adminToken, safeEqual } from '@/lib/admin-auth';
import { saveSettings, validateSettings } from '@/lib/settings';

const COOKIE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/';
// Where the login page may send you afterwards
const AFTER_LOGIN = ['/rsvps', '/admin'];

export async function login(_prev, formData) {
    const token = adminToken();
    if (!token) return { error: 'RSVP_ADMIN_PASSWORD is not set on the server.' };

    const given = formData.get('password');
    const expected = process.env.RSVP_ADMIN_PASSWORD;
    if (!safeEqual(given, expected)) {
        await new Promise(r => setTimeout(r, 800)); // slow down password guessing
        return { error: 'That password is not right. Please try again.' };
    }

    (await cookies()).set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: COOKIE_PATH,
        maxAge: ADMIN_COOKIE_MAX_AGE,
    });
    const next = formData.get('next');
    redirect(AFTER_LOGIN.includes(next) ? next : '/rsvps');
}

export async function logout() {
    (await cookies()).delete({ name: ADMIN_COOKIE, path: COOKIE_PATH });
    redirect('/rsvps/login');
}

// Saves the invitation details from /admin. Returns { settings } or { error }.
export async function updateSettings(input) {
    // The proxy already guards /admin, but server actions are POST endpoints,
    // so check the sign-in again here
    const token = adminToken();
    if (!token || !safeEqual((await cookies()).get(ADMIN_COOKIE)?.value, token)) {
        return { error: 'You have been signed out. Please sign in again.' };
    }

    const { data, error } = validateSettings(input);
    if (error) return { error };
    await saveSettings(data);
    return { settings: data };
}
