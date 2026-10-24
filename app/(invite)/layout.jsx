import './invite.css';

// Link previews (WhatsApp, iMessage, etc.) need absolute URLs
const SITE_URL = 'https://bhavipriyanka.com/wedding';
const SHARE_DESCRIPTION =
    'Join us on Friday, 29 January 2027 at JP Farm, Navsari for the Grand Wedding Reception of Bhavi & Priyanka.';
const SHARE_IMAGE = {
    url: 'https://bhavipriyanka.com/wedding/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'Bhavi & Priyanka — Wedding Reception, Friday 29 January 2027, JP Farm, Navsari',
};

export const metadata = {
    title: 'Bhavi & Priyanka — Wedding Reception Invitation',
    description:
        'Wedding Reception Invitation for Bhavi & Priyanka at JP Farm, Gandevi Road, Navsari, Gujarat. Join us for an evening of joy.',
    openGraph: {
        type: 'website',
        url: SITE_URL,
        siteName: 'Bhavi & Priyanka',
        locale: 'en_IN',
        title: 'Bhavi & Priyanka — Wedding Reception Invitation',
        description: SHARE_DESCRIPTION,
        images: [SHARE_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Bhavi & Priyanka — Wedding Reception Invitation',
        description: SHARE_DESCRIPTION,
        images: [SHARE_IMAGE.url],
    },
    icons: {
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>",
    },
};

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
