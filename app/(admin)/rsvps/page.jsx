import { readLatestRsvps } from '@/lib/rsvp';
import { formatDate, formatPhone, getSettings } from '@/lib/settings';
import AdminNav from '../AdminNav';

// Always read the file fresh — never cache this page
export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH;

function formatTime(iso) {
    return new Date(iso).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
    });
}

export default async function RsvpsPage({ searchParams }) {
    const { show = 'all' } = await searchParams;
    const all = await readLatestRsvps();
    const { day } = formatDate((await getSettings()).date);

    const coming = all.filter(r => r.attending === 'yes');
    const declined = all.filter(r => r.attending === 'no');
    const guests = coming.reduce((sum, r) => sum + r.guests, 0);

    const list = show === 'yes' ? coming : show === 'no' ? declined : all;
    const tabs = [['all', 'All', all.length], ['yes', 'Attending', coming.length], ['no', 'Declined', declined.length]];

    return (
        <main className="wrap">
            <AdminNav current="rsvps" />
            <header className="head">
                <div>
                    <div className="eyebrow">Bhavi &amp; Priyanka · {day}</div>
                    <h1>RSVPs</h1>
                </div>
                <a className="btn" href={`${BASE}/rsvps/export`}>Download CSV</a>
            </header>

            <section className="stats">
                <div className="stat big"><b>{guests}</b><span>guests coming</span></div>
                <div className="stat"><b>{coming.length}</b><span>families attending</span></div>
                <div className="stat"><b>{declined.length}</b><span>declined</span></div>
                <div className="stat"><b>{all.length}</b><span>total responses</span></div>
            </section>

            <nav className="tabs">
                {tabs.map(([key, label, count]) => (
                    <a key={key} href={`${BASE}/rsvps?show=${key}`} className={show === key ? 'on' : ''}>
                        {label} <span>{count}</span>
                    </a>
                ))}
            </nav>

            {list.length === 0 ? (
                <p className="empty">No responses yet. They&apos;ll appear here as guests reply.</p>
            ) : (
                <ul className="list">
                    {list.map(r => (
                        <li key={r.phone} className="row">
                            <div className="who">
                                <b>{r.name}</b>
                                <a href={`https://wa.me/${r.phone}`} target="_blank" rel="noopener">{formatPhone(r.phone)}</a>
                            </div>
                            <div className={`status ${r.attending}`}>
                                {r.attending === 'yes' ? `Attending · ${r.guests} ${r.guests === 1 ? 'guest' : 'guests'}` : 'Declined'}
                            </div>
                            {r.message && <p className="msg">“{r.message}”</p>}
                            <div className="when">
                                {formatTime(r.at)}
                                {r.updates > 0 && ` · updated ${r.updates === 1 ? 'once' : `${r.updates} times`}`}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
