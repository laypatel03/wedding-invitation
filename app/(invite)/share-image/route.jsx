import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { formatDate, formatTime, getSettings } from '@/lib/settings';

// The 1200×630 card shown when the invitation link is shared (WhatsApp etc.).
// Background (frame, peacocks, Ganesha) is a fixed image; the text is drawn
// from the admin settings, so it follows date/time/venue changes.
export const dynamic = 'force-dynamic';

const ASSETS = path.join(process.cwd(), 'assets');
const load = file => readFile(path.join(ASSETS, file));
const assets = Promise.all([
    load('og-base.png'),
    load('fonts/Marcellus-Regular.ttf'),
    load('fonts/CormorantGaramond-MediumItalic.ttf'),
    load('fonts/Jost-Medium.ttf'),
]);

const PLUM = '#4A2E3B';
const PLUM_SOFT = '#7A5A68';
const GOLD = '#C39A56';

// Text must stay clear of the two peacocks (about 580px); shrink long lines to fit.
// widthPerChar is the average glyph width as a fraction of the font size.
function fit(maxSize, text, widthPerChar) {
    return Math.min(maxSize, Math.floor(580 / (text.length * widthPerChar)));
}

export async function GET() {
    const [base, marcellus, cormorant, jost] = await assets;
    const s = await getSettings();
    const { weekday, day } = formatDate(s.date);
    const dateLine = `${weekday} · ${day} · ${formatTime(s.startTime, { short: true })}`.toUpperCase();
    const venueLine = [s.venue.name, s.venue.area].filter(Boolean).join(', ');

    return new ImageResponse(
        (
            <div style={{ width: 1200, height: 630, display: 'flex', position: 'relative' }}>
                <img src={`data:image/png;base64,${base.toString('base64')}`} width={1200} height={630}
                    style={{ position: 'absolute', top: 0, left: 0 }} />
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: 1200, height: 630,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 228,
                }}>
                    <div style={{ fontFamily: 'Jost', fontSize: 19, letterSpacing: 8, color: GOLD, paddingLeft: 8 }}>
                        WEDDING RECEPTION
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4 }}>
                        <span style={{ fontFamily: 'Marcellus', fontSize: 88, color: PLUM }}>Bhavi</span>
                        <span style={{ fontFamily: 'Cormorant', fontSize: 70, color: GOLD, margin: '0 12px' }}>&amp;</span>
                        <span style={{ fontFamily: 'Marcellus', fontSize: 88, color: PLUM }}>Priyanka</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 14, marginBottom: 20 }}>
                        <div style={{ width: 110, height: 1, background: GOLD }} />
                        <div style={{ width: 7, height: 7, background: GOLD, transform: 'rotate(45deg)', margin: '0 14px' }} />
                        <div style={{ width: 110, height: 1, background: GOLD }} />
                    </div>
                    <div style={{
                        fontFamily: 'Jost', fontSize: fit(27, dateLine, 0.69), letterSpacing: 3.8, color: PLUM,
                    }}>
                        {dateLine}
                    </div>
                    <div style={{
                        fontFamily: 'Cormorant', fontSize: fit(30, venueLine, 0.4), color: PLUM_SOFT, marginTop: 10,
                    }}>
                        {venueLine}
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                { name: 'Marcellus', data: marcellus, weight: 400, style: 'normal' },
                { name: 'Cormorant', data: cormorant, weight: 500, style: 'normal' },
                { name: 'Jost', data: jost, weight: 500, style: 'normal' },
            ],
            headers: { 'Cache-Control': 'public, max-age=300' },
        },
    );
}
