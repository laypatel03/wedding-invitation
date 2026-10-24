import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminToken, safeEqual } from '@/lib/admin-auth';

// Keeps the RSVP list (/wedding/rsvps and its CSV export) behind the login page.
export function proxy(req) {
    const token = adminToken();
    if (!token) {
        return new NextResponse('RSVP_ADMIN_PASSWORD is not set on the server.', { status: 503 });
    }

    const isLogin = req.nextUrl.pathname === '/rsvps/login';
    const signedIn = safeEqual(req.cookies.get(ADMIN_COOKIE)?.value, token);

    if (signedIn || isLogin) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = '/rsvps/login';
    url.search = '';
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/rsvps', '/rsvps/:path*'],
};
