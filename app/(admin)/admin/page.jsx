import { EVENT_ICONS, LIMITS, getSettings } from '@/lib/settings';
import AdminNav from '../AdminNav';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Edit invitation — Bhavi & Priyanka' };

export default async function AdminPage() {
    const settings = await getSettings();
    return (
        <main className="wrap">
            <AdminNav current="admin" />
            <header className="head">
                <div>
                    <div className="eyebrow">Bhavi &amp; Priyanka</div>
                    <h1>Edit invitation</h1>
                </div>
            </header>
            <p className="intro">
                Changes go live on the invitation as soon as you save. The link preview picture
                (WhatsApp etc.) updates too, but chats that already show the link keep the old one.
            </p>
            <SettingsForm initial={settings} icons={EVENT_ICONS} limits={LIMITS} />
        </main>
    );
}
