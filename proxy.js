import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminToken, safeEqual } from '@/lib/admin-auth';

// Keeps the admin pages (/reception/rsvps, its CSV export and /reception/admin)
// behind the login page.
export function proxy(req) {
    const token = adminToken();
    if (!token) {
        return new NextResponse('RSVP_ADMIN_PASSWORD is not set on the server.', { status: 503 });
    }

    const { pathname } = req.nextUrl;
    const isLogin = pathname === '/rsvps/login';
    const signedIn = safeEqual(req.cookies.get(ADMIN_COOKIE)?.value, token);

    if (signedIn || isLogin) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = '/rsvps/login';
    url.search = pathname.startsWith('/admin') ? '?next=/admin' : '';
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/rsvps', '/rsvps/:path*', '/admin', '/admin/:path*'],
};
