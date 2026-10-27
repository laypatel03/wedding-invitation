import { logout } from './actions';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH;

// Top bar shared by the RSVP list and the invitation editor
export default function AdminNav({ current }) {
    return (
        <nav className="admin-nav">
            <div className="admin-tabs">
                <a href={`${BASE}/rsvps`} className={current === 'rsvps' ? 'on' : ''}>RSVPs</a>
                <a href={`${BASE}/admin`} className={current === 'admin' ? 'on' : ''}>Edit invitation</a>
            </div>
            <div className="admin-nav-end">
                <a href={BASE} target="_blank" rel="noopener">View invitation ↗</a>
                <form action={logout}>
                    <button type="submit">Sign out</button>
                </form>
            </div>
        </nav>
    );
}
