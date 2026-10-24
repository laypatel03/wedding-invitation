'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, adminToken, safeEqual } from '@/lib/admin-auth';

const COOKIE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/';

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
    redirect('/rsvps');
}

export async function logout() {
    (await cookies()).delete({ name: ADMIN_COOKIE, path: COOKIE_PATH });
    redirect('/rsvps/login');
}
