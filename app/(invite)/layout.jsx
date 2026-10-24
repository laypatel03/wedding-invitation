import './invite.css';

export const metadata = {
    title: 'Bhavi & Priyanka — Wedding Reception Invitation',
    description:
        'Wedding Reception Invitation for Bhavi & Priyanka at JP Farm, Gandevi Road, Navsari, Gujarat. Join us for an evening of joy.',
    openGraph: {
        title: 'Bhavi & Priyanka — Wedding Reception Invitation',
        description:
            'Join us on Friday, 29 January 2028 at JP Farm, Navsari for the Grand Wedding Reception of Bhavi & Priyanka.',
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
