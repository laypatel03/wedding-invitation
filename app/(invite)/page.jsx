import { calendarUrl, formatDate, formatPhone, formatTime, getSettings, startTimestamp } from '@/lib/settings';
import EventIcon from './EventIcon';
import InviteEffects from './InviteEffects';
import RsvpForm from './RsvpForm';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH;

const HEART_PATH = 'M12 21s-7.5-5.2-10-9.3C-0.5 7.8 2 4 6 4c2.2 0 3.6 1.2 6 3.6C14.4 5.2 15.8 4 18 4c4 0 6.5 3.8 4 7.7C19.5 15.8 12 21 12 21z';

const FLOATING_HEARTS = [
    { left: '12%', size: 16, s: 0.8, duration: '9s', delay: '0.3s' },
    { left: '78%', size: 22, s: 1.1, duration: '11s', delay: '1.5s' },
    { left: '45%', size: 14, s: 0.7, duration: '8s', delay: '3s' },
    { left: '88%', size: 18, s: 0.9, duration: '10s', delay: '4.2s' },
    { left: '25%', size: 20, s: 1, duration: '12s', delay: '2.2s' },
];

const hiddenSvg = { position: 'absolute', pointerEvents: 'none' };
const familyName = { fontFamily: 'var(--display)', fontSize: 'clamp(18px, 3.4vw, 22px)', color: 'var(--plum)' };
const outlineBtn = { background: 'transparent', border: '1px solid var(--gold)', color: 'var(--plum)' };
const btnRow = { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' };

export default async function InvitePage() {
    const settings = await getSettings();
    const { weekday, day } = formatDate(settings.date);
    const { venue } = settings;

    return (
        <>
            {/* Hidden filter defs — recolor-plum for the Ganesha artwork, recolor-gold for the peacocks */}
            <svg width="0" height="0" style={hiddenSvg} aria-hidden="true">
                <filter id="recolor-plum" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="
                        0 0 0 0 0.2902
                        0 0 0 0 0.1804
                        0 0 0 0 0.2314
                        0.3333 0.3333 0.3333 0 0" />
                </filter>
                <filter id="recolor-gold" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="
                        0 0 0 0 0.8118
                        0 0 0 0 0.6824
                        0 0 0 0 0.4706
                        0 0 0 1 0" />
                </filter>
            </svg>

            {/* ================= WELCOME COVER ================= */}
            <div className="cover" id="cover">
                <div className="cover-panel left"></div>
                <div className="cover-panel right"></div>

                {/* ambient floating hearts */}
                {FLOATING_HEARTS.map((h, i) => (
                    <div
                        key={i}
                        className="floating-heart"
                        style={{
                            left: h.left, width: h.size, height: h.size, '--s': h.s,
                            animationDuration: h.duration, animationDelay: h.delay,
                        }}
                    >
                        <svg viewBox="0 0 24 24"><path d={HEART_PATH} /></svg>
                    </div>
                ))}

                {/* arch line-art */}
                <svg className="cover-arch" viewBox="0 0 300 180" aria-hidden="true">
                    <path className="cover-line" d="M20 170 V75 C20 35, 75 20, 150 20 C225 20, 280 35, 280 75 V170" />
                    <path className="cover-line" d="M36 170 V82 Q36 45 80 34 Q115 48 150 28 Q185 48 220 34 Q264 45 264 82 V170" />
                    <path className="cover-line" d="M150 8 L154 18 L150 22 L146 18 Z" fill="var(--gold)" />
                    <circle className="cover-line" cx="150" cy="5" r="2.5" />
                    <path className="cover-line" d="M15 170 H285" />
                    <circle className="cover-line" cx="80" cy="38" r="2.5" />
                    <circle className="cover-line" cx="115" cy="46" r="2.5" />
                    <circle className="cover-line" cx="150" cy="32" r="2.5" />
                    <circle className="cover-line" cx="185" cy="46" r="2.5" />
                    <circle className="cover-line" cx="220" cy="38" r="2.5" />
                </svg>

                {/* peacock artwork */}
                <div className="cover-peacock left">
                    <img src={`${BASE}/images/peacock.png`} alt="Peacock" className="cover-peacock-img mirror" />
                </div>
                <div className="cover-peacock right">
                    <img src={`${BASE}/images/peacock.png`} alt="Peacock" className="cover-peacock-img" />
                </div>

                <div className="cover-content">
                    <div className="cover-seal">
                        <svg viewBox="0 0 100 100" aria-hidden="true">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--gold)" strokeWidth="1.4"
                                strokeDasharray="4 3" />
                            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--gold-soft)" strokeWidth="1" />
                            <path d="M50 18 L52.5 25 L60 25 L54 29.5 L56 37 L50 32.5 L44 37 L46 29.5 L40 25 L47.5 25 Z"
                                fill="var(--gold)" />
                            <text x="50" y="62" fontFamily="'Marcellus', serif" fontSize="19" fill="var(--plum)"
                                textAnchor="middle" fontWeight="600" letterSpacing="1">B &amp; P</text>
                        </svg>
                    </div>
                    <div className="eyebrow">With the blessings of both families</div>
                    <h1 className="cover-title">Wedding<br />Reception</h1>
                    <div className="cover-names">Bhavi &amp; Priyanka</div>
                    <button id="openInvite" className="btn open-btn" type="button">✦ Open Invitation ✦</button>
                </div>
            </div>
            <div className="heart-burst" id="heartBurst" aria-hidden="true"></div>

            {/* ================= BACKGROUND MUSIC ================= */}
            {/* Replace the src below with your song file (put it in public/audio/ and keep the ${BASE} prefix) or a hosted MP3 link */}
            {/* <audio id="bgMusic" src={`${BASE}/audio/KrishnaTheme.mp3`} loop preload="none"></audio> */}
            <audio id="bgMusic" src={`${BASE}/audio/bol-na-halke-halke-instrumental.mp3`} loop preload="auto"></audio>
            <button id="musicToggle" className="music-toggle" type="button" aria-label="Toggle background music">
                <svg viewBox="0 0 24 24">
                    <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
            </button>

            <canvas id="petal-canvas" aria-hidden="true"></canvas>

            {/* ================= HERO ================= */}
            <section className="hero">
                <svg width="0" height="0" style={hiddenSvg} aria-hidden="true">
                    <filter id="tint-plum" colorInterpolationFilters="sRGB">
                        <feColorMatrix type="matrix" values="
                            0 0 0 0 0.2902
                            0 0 0 0 0.1804
                            0 0 0 0 0.2314
                            0 0 0 1 0" />
                    </filter>
                </svg>

                <img className="diya" src={`${BASE}/images/ganesha.svg`} alt="Lord Ganesha" style={{ filter: 'url(#tint-plum)' }} />

                <div className="eyebrow">Together with their families</div>
                <h1 className="hero-names">
                    <span className="name">Bhavi</span>
                    <span className="amp">&amp;</span>
                    <span className="name">Priyanka</span>
                </h1>
                <p className="hero-sub">cordially request the honor of your presence at their Grand Wedding Reception</p>
                <div className="hero-date">
                    <span>{weekday} · {day} · {formatTime(settings.startTime)} Onwards</span>
                </div>
                <div className="hero-date">
                    <span>{[venue.name, venue.area].filter(Boolean).join(' · ')}</span>
                </div>
                <div className="scroll-cue">Scroll to unfold ✦</div>
            </section>

            {/* ================= BLESSING ================= */}
            <section className="blessing">
                <div className="ganesha-wrap reveal">
                    <img src={`${BASE}/images/ganesh.png`} alt="Lord Ganesha" className="ganesha-img" />
                </div>
                <p className="shloka reveal">Vakratunda Mahākāya, Sūryakoṭi Samaprabha<br />Nirvighnaṁ Kuru Me Deva, Sarva-Kāryeṣu
                    Sarvadā</p>
                <p className="shloka-en reveal">A prayer to Lord Ganesha, remover of obstacles, to bless this union and the grand
                    evening of celebration.</p>
            </section>

            {/* ================= WITH BLESSINGS / FAMILY ================= */}
            <section className="blessing">
                <div className="eyebrow reveal">✦ With Blessings ✦</div>
                <div className="divider reveal"></div>

                <p className="shloka reveal" style={{ marginBottom: 14 }}>
                    By the infinite grace of the Almighty<br />
                    and the blessings of our beloved grandparents
                </p>

                <div className="reveal" style={{ ...familyName, lineHeight: 1.9 }}>
                    Late Shri Ramanbhai Dullabhbhai Patel<br />
                    Smt. Sitaben Ramanbhai Patel
                </div>

                <div className="divider reveal" style={{ margin: '30px auto' }}></div>

                <div className="reveal" style={{ ...familyName, lineHeight: 1.9 }}>
                    Shri Niteshbhai Ramanbhai Patel<br />
                    Smt. Sitalkumari Niteshbhai Patel
                </div>

                <p className="shloka reveal" style={{ margin: '24px auto 6px' }}>along with</p>

                <div className="reveal" style={familyName}>
                    Shiv Niteshbhai Patel
                </div>

                <p className="shloka-en reveal" style={{ fontStyle: 'italic', margin: '30px auto 34px' }}>
                    cordially request the pleasure of your gracious presence<br />at the wedding of their beloved son
                </p>

                <div className="reveal"
                    style={{ fontFamily: 'var(--script)', fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1.2 }}>
                    <div style={{ fontSize: 'clamp(46px, 10vw, 72px)' }}>Bhavi</div>
                    <div style={{ fontSize: 'clamp(18px, 3vw, 22px)', color: 'var(--plum-soft)', margin: '6px 0' }}>with</div>
                    <div style={{ fontSize: 'clamp(46px, 10vw, 72px)' }}>Priyanka</div>
                </div>

                <p className="shloka-en reveal" style={{ fontStyle: 'italic', marginTop: 20 }}>
                    Daughter of Shri Bipinbhai Vallabhbhai Patel &amp; Smt. Pushpaben Bipinbhai Patel
                </p>
            </section>

            {/* ================= RECEPTION PROGRAM ================= */}
            <section className="events">
                <div className="eyebrow reveal">The Celebration</div>
                <h2 className="section-title reveal">An Evening of Joy</h2>
                <div className="divider reveal"></div>
                <div className="event-list">
                    {settings.events.map((e, i) => (
                        <div key={i} className="event-card reveal">
                            <div className="event-icon"><EventIcon name={e.icon} /></div>
                            <div className="event-body">
                                <div className="event-name">{e.name}</div>
                                <div className="event-meta">
                                    <strong>{formatTime(e.time)}{e.onwards && ' Onwards'}</strong>
                                    {e.description && <><br />{e.description}</>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= COUNTDOWN ================= */}
            <section className="countdown">
                <div className="eyebrow reveal">Counting Down</div>
                <h2 className="section-title reveal">Until The Grand Reception</h2>
                <div className="divider reveal"></div>
                <div className="countdown-grid reveal" id="countdown">
                    <div className="cd-unit">
                        <div className="cd-num" id="cd-days">00</div>
                        <div className="cd-label">Days</div>
                    </div>
                    <div className="cd-unit">
                        <div className="cd-num" id="cd-hours">00</div>
                        <div className="cd-label">Hours</div>
                    </div>
                    <div className="cd-unit">
                        <div className="cd-num" id="cd-mins">00</div>
                        <div className="cd-label">Minutes</div>
                    </div>
                    <div className="cd-unit">
                        <div className="cd-num" id="cd-secs">00</div>
                        <div className="cd-label">Seconds</div>
                    </div>
                </div>
            </section>

            {/* ================= VENUE ================= */}
            <section className="venue">
                <div className="eyebrow reveal">Reception Venue</div>
                <h2 className="section-title reveal">{venue.name}</h2>
                <div className="divider reveal"></div>
                <div className="venue-card reveal">
                    <div className="venue-name">{venue.name}</div>
                    {venue.address && <div className="venue-addr">{venue.address}</div>}
                    <div style={btnRow}>
                        {venue.mapUrl && (
                            <a className="btn" href={venue.mapUrl} target="_blank" rel="noopener">View on Map</a>
                        )}
                        <a className="btn" style={outlineBtn} href={calendarUrl(settings)}
                            target="_blank" rel="noopener">Add to Calendar</a>
                    </div>
                </div>
            </section>

            {/* ================= RSVP ================= */}
            <section className="venue" id="rsvp">
                <div className="eyebrow reveal">Kindly Respond</div>
                <h2 className="section-title reveal">Will You Join Us?</h2>
                <div className="divider reveal"></div>
                <div className="venue-card rsvp-card reveal">
                    <RsvpForm />
                </div>
            </section>

            {/* ================= HOSTS / COMPLIMENTS ================= */}
            <section className="blessing" style={{ paddingTop: 30, paddingBottom: 60 }}>
                <div className="eyebrow reveal">With Warm Regards</div>
                <h2 className="section-title reveal">With Best Compliments</h2>
                <div className="divider reveal"></div>
                <p className="shloka-en reveal" style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--plum)' }}>
                    Your gracious presence and blessings will make our celebration complete.<br />
                    We look forward to welcoming you and your family to an unforgettable evening.
                </p>
            </section>

            {/* ================= CONTACT / INQUIRIES ================= */}
            <section className="venue">
                <div className="eyebrow reveal">Get In Touch</div>
                <h2 className="section-title reveal">For Any Inquiries</h2>
                <div className="divider reveal"></div>
                <div className="venue-card reveal">
                    <div className="venue-addr" style={{ marginBottom: 26 }}>
                        For any questions about the celebration,<br />
                        please feel free to reach out to us.
                    </div>
                    {settings.contacts.map((c, i) => (
                        <div key={i} className={i > 0 ? 'contact-more' : undefined}>
                            <div style={btnRow}>
                                {c.call && <a className="btn" href={`tel:+${c.call}`}>Call Us</a>}
                                {c.whatsapp && (
                                    <a className="btn" style={c.call ? outlineBtn : undefined}
                                        href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>
                                )}
                                {c.email && (
                                    <a className="btn" style={c.call || c.whatsapp ? outlineBtn : undefined}
                                        href={`mailto:${c.email}`}>Email</a>
                                )}
                            </div>
                            <div className="venue-addr" style={{ marginTop: 26, marginBottom: 0 }}>
                                <strong style={{ color: 'var(--plum)' }}>{c.name}</strong>
                                {(c.call || c.whatsapp) && <> &nbsp;·&nbsp; {formatPhone(c.call || c.whatsapp)}</>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer>
                <svg className="diya" viewBox="0 0 100 100" aria-hidden="true">
                    <path className="flame" d="M50 20 C42 32, 40 44, 50 54 C60 44, 58 32, 50 20 Z" fill="var(--gold-soft)" />
                    <path className="flame-core" d="M50 28 C46 36, 45 43, 50 50 C55 43, 54 36, 50 28 Z" fill="#FFFBF2" />
                    <path d="M15 58 Q50 50 85 58 Q80 82 50 84 Q20 82 15 58 Z" fill="var(--blush)" stroke="var(--gold-soft)"
                        strokeWidth="1.8" />
                    <ellipse cx="50" cy="58" rx="35" ry="6" fill="var(--gold-soft)" opacity="0.6" />
                    <path d="M38 84 Q50 90 62 84 Q58 92 42 92 Z" fill="var(--gold-soft)" />
                </svg>
                <div className="foot-names">Bhavi &amp; Priyanka</div>
                <div className="foot-sub">With gratitude and joy, we welcome you</div>
            </footer>

            <InviteEffects startsAt={startTimestamp(settings)} />
        </>
    );
}
