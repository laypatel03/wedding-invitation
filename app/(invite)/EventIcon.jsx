// Line icons for the programme cards; keys match EVENT_ICONS in lib/settings.js
const ICONS = {
    welcome: (
        <>
            <path d="M8 10h8c1 0 2 1 2 2v2c0 4-3 7-6 7s-6-3-6-7v-2c0-1 1-2 2-2z" />
            <path d="M6 10c0-3 3-5 6-5s6 2 6 5" />
            <path d="M10 5 Q12 2 14 5" />
        </>
    ),
    rings: (
        <>
            <circle cx="9" cy="13" r="5" />
            <circle cx="15" cy="13" r="5" />
            <path d="M12 4v3M12 7l-1-1M12 7l1-1" />
            <path d="M6 6l1.5 1.5M18 6l-1.5 1.5" />
        </>
    ),
    dinner: (
        <>
            <path d="M4 18h16M5 18a7 7 0 0 1 14 0H5z" />
            <path d="M12 11V8" />
            <circle cx="12" cy="7" r="1.2" fill="var(--gold)" />
            <path d="M8 21h8" />
        </>
    ),
    music: (
        <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    ),
};

export default function EventIcon({ name }) {
    return <svg viewBox="0 0 24 24">{ICONS[name] ?? ICONS.welcome}</svg>;
}
