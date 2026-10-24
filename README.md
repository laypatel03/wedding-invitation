# Bhavi & Priyanka — Wedding Invitation (Next.js)

## Folder structure

```
wedding-invite/
├── package.json
├── next.config.mjs
├── app/
│   ├── (invite)/              # "/"  — the wedding invitation
│   │   ├── layout.jsx         # <html>, fonts, page title/meta
│   │   ├── page.jsx           # the invitation markup
│   │   ├── InviteEffects.jsx  # countdown, scroll reveal, hearts, music, petals
│   │   └── invite.css         # all invitation styling
│   └── (menu)/                # "/menu" — Healthy Hunger café menu
│       ├── layout.jsx
│       ├── menu.css
│       └── menu/
│           ├── page.jsx
│           ├── MenuSection.jsx  # tabs, filters, menu list
│           ├── CopyPhone.jsx
│           └── data.js          # menu items and add-ons
└── public/
    ├── images/                # peacock.png, ganesh.png, ganesha.svg
    └── audio/                 # background music
```

The two pages live in separate route groups, each with its own root layout,
so their stylesheets never mix.

## 1. Images and music

Everything in `public/` is served from the site root, e.g.
`public/images/peacock.png` → `/images/peacock.png`.

To change the song, put the MP3 in `public/audio/` and edit the `<audio>` tag
in `app/(invite)/page.jsx`:

```jsx
<audio id="bgMusic" src="/audio/song.mp3" loop preload="auto"></audio>
```

## 2. Run it locally

```bash
npm install
npm run dev
```

Then open **http://localhost:5050** (invitation) or **http://localhost:5050/menu**.

## 3. Hosting it for real

- **Vercel** (vercel.com) — import the GitHub repo; it detects Next.js
  automatically. Free tier available.
- **Netlify**, **Render**, **Railway** — all support Next.js out of the box.

Or run it yourself with `npm run build && npm start`.
