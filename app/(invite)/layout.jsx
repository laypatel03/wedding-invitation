import { formatDate, getSettings, previewVersion } from '@/lib/settings';
import './invite.css';

// Date, times, venue and contacts come from the admin settings, so render on
// every request instead of once at build time.
export const dynamic = 'force-dynamic';

// Link previews (WhatsApp, iMessage, etc.) need absolute URLs
const SITE_URL = 'https://bhavipriyanka.com/reception';
const TITLE = 'Bhavi & Priyanka — Wedding Reception Invitation';

export async function generateMetadata() {
    const s = await getSettings();
    const { weekday, day } = formatDate(s.date);
    const town = s.venue.area.split(',')[0].trim();
    const place = [s.venue.name, town].filter(Boolean).join(', ');
    const shareDescription = `Join us on ${weekday}, ${day} at ${place} for the Grand Wedding Reception of Bhavi & Priyanka.`;
    const shareImage = {
        // ?v= changes whenever the date or venue does, so apps fetch the new picture
        url: `${SITE_URL}/share-image?v=${previewVersion(s)}`,
        width: 1200,
        height: 630,
        alt: `Bhavi & Priyanka — Wedding Reception, ${weekday} ${day}, ${place}`,
    };

    return {
        title: TITLE,
        description: `Wedding Reception Invitation for Bhavi & Priyanka at ${[s.venue.name, s.venue.address].filter(Boolean).join(', ')}. Join us for an evening of joy.`,
        openGraph: {
            type: 'website',
            url: SITE_URL,
            siteName: 'Bhavi & Priyanka',
            locale: 'en_IN',
            title: TITLE,
            description: shareDescription,
            images: [shareImage],
        },
        twitter: {
            card: 'summary_large_image',
            title: TITLE,
            description: shareDescription,
            images: [shareImage.url],
        },
        icons: {
            icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>",
        },
    };
}

export default function InviteLayout({ children }) {
    return (
        <html lang="en" className="lock-scroll">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Marcellus&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
