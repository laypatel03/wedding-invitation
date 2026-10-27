'use client';

import { useEffect } from 'react';

const HEART_PATH = 'M12 21s-7.5-5.2-10-9.3C-0.5 7.8 2 4 6 4c2.2 0 3.6 1.2 6 3.6C14.4 5.2 15.8 4 18 4c4 0 6.5 3.8 4 7.7C19.5 15.8 12 21 12 21z';

// Port of the old static/js/main.js. The markup is rendered by page.jsx;
// this component only wires up behaviour once it is in the DOM, and tears
// everything down again on unmount (matters for dev-mode double effects).
// startsAt: reception start (ms since epoch), from the admin settings
export default function InviteEffects({ startsAt }) {
    useEffect(() => {
        const cleanups = [];
        const listen = (target, evt, fn, opts) => {
            target.addEventListener(evt, fn, opts);
            cleanups.push(() => target.removeEventListener(evt, fn, opts));
        };

        // ---------- Scroll reveal ----------
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('.reveal, .ganesha-wrap').forEach(el => io.observe(el));
        cleanups.push(() => io.disconnect());

        // ---------- Countdown ----------
        function tickCountdown() {
            const diff = Math.max(0, startsAt - Date.now());
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            const pad = n => String(n).padStart(2, '0');
            document.getElementById('cd-days').textContent = pad(d);
            document.getElementById('cd-hours').textContent = pad(h);
            document.getElementById('cd-mins').textContent = pad(m);
            document.getElementById('cd-secs').textContent = pad(s);
        }
        tickCountdown();
        const countdownTimer = setInterval(tickCountdown, 1000);
        cleanups.push(() => clearInterval(countdownTimer));

        // ---------- Ambient petal particles ----------
        const canvas = document.getElementById('petal-canvas');
        const ctx = canvas.getContext('2d');
        let W, H;
        const petals = [];
        const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        listen(window, 'resize', resize);
        resize();

        function makePetal() {
            return {
                x: Math.random() * W,
                y: -20 - Math.random() * H,
                r: 4 + Math.random() * 5,
                speed: 0.4 + Math.random() * 0.7,
                drift: (Math.random() - 0.5) * 0.6,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.02,
                hue: Math.random() > 0.5 ? '#E3A9A0' : '#E4C88C'
            };
        }

        const PETAL_COUNT = REDUCE_MOTION ? 0 : 26;
        for (let i = 0; i < PETAL_COUNT; i++) petals.push(makePetal());

        function drawPetal(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.hue;
            ctx.globalAlpha = 0.55;
            const s = p.r * 1.1;
            ctx.beginPath();
            ctx.moveTo(0, s * 0.35);
            ctx.bezierCurveTo(0, 0, -s, 0, -s, s * 0.35);
            ctx.bezierCurveTo(-s, s * 0.75, -s * 0.4, s * 1.0, 0, s * 1.4);
            ctx.bezierCurveTo(s * 0.4, s * 1.0, s, s * 0.75, s, s * 0.35);
            ctx.bezierCurveTo(s, 0, 0, 0, 0, s * 0.35);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        let frame;
        function animate() {
            if (!REDUCE_MOTION) {
                ctx.clearRect(0, 0, W, H);
                petals.forEach(p => {
                    p.y += p.speed;
                    p.x += p.drift;
                    p.angle += p.spin;
                    if (p.y > H + 20) Object.assign(p, makePetal(), { y: -20 });
                    drawPetal(p);
                });
                frame = requestAnimationFrame(animate);
            }
        }
        animate();
        cleanups.push(() => cancelAnimationFrame(frame));

        // ---------- Welcome cover / open invitation ----------
        const cover = document.getElementById('cover');
        const openBtn = document.getElementById('openInvite');
        const heartBurst = document.getElementById('heartBurst');
        const bgMusic = document.getElementById('bgMusic');
        const musicToggle = document.getElementById('musicToggle');

        function spawnHeartBurst(x, y, count = 18) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 90 + Math.random() * 180;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist - 70; // bias upward
                const el = document.createElement('div');
                el.className = 'heart-particle';
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.setProperty('--tx', tx + 'px');
                el.style.setProperty('--ty', ty + 'px');
                el.style.setProperty('--scale', (0.5 + Math.random() * 1).toFixed(2));
                el.style.setProperty('--delay', (Math.random() * 0.25) + 's');
                el.innerHTML = `<svg viewBox="0 0 24 24"><path d="${HEART_PATH}"/></svg>`;
                heartBurst.appendChild(el);
                setTimeout(() => el.remove(), 1600);
            }
        }

        // ---------- Background music: try to play unmuted on load ----------
        // Opening this page via a clicked link counts as a user gesture in most
        // browsers, so this often succeeds immediately with no extra tap needed.
        function markPlaying() {
            if (musicToggle) musicToggle.classList.add('playing');
        }

        // Fallback for browsers that refused the unmuted attempt (mainly
        // mobile Safari): start muted right away, unmute on the first tap/click
        // anywhere on the page. Playback continues from wherever it already is —
        // it does NOT restart the track.
        let fallbackArmed = false;
        function startMutedThenUnmuteOnInteraction() {
            if (fallbackArmed || !bgMusic) return;
            fallbackArmed = true;
            bgMusic.muted = true;
            bgMusic.play().then(markPlaying).catch(() => { /* will retry on first interaction below */ });

            function unmuteMusic() {
                bgMusic.muted = false;
                if (bgMusic.paused) bgMusic.play().then(markPlaying).catch(() => { });
            }
            ['click', 'touchstart', 'keydown'].forEach(evt => {
                listen(document, evt, unmuteMusic, { once: true });
            });
        }

        function tryPlayMusic() {
            if (!bgMusic || !bgMusic.getAttribute('src')) return;
            bgMusic.currentTime = 0;
            bgMusic.play().then(markPlaying).catch(() => {
                startMutedThenUnmuteOnInteraction();
            });
        }

        tryPlayMusic();
        cleanups.push(() => bgMusic.pause());

        listen(bgMusic, 'ended', () => {
            bgMusic.currentTime = 0;
            bgMusic.play().catch(() => { });
        });

        listen(openBtn, 'click', () => {
            const rect = openBtn.getBoundingClientRect();
            spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

            cover.classList.add('open');
            document.documentElement.classList.remove('lock-scroll');

            setTimeout(() => { cover.style.display = 'none'; }, 1250);
        });

        // ---------- Heart burst on interactive elements & gentle cursor trail ----------
        let lastMove = 0;
        listen(document, 'mousemove', (e) => {
            const now = Date.now();
            if (now - lastMove > 220) { // throttled to 220ms for optimal performance
                lastMove = now;
                spawnHeartBurst(e.clientX, e.clientY, 1);
            }
        });

        document.querySelectorAll('.event-card, .venue-card, .ganesha-img, .btn').forEach(el => {
            listen(el, 'mouseenter', () => {
                const rect = el.getBoundingClientRect();
                spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 4);
            });
        });

        if (musicToggle) listen(musicToggle, 'click', () => {
            if (!bgMusic.getAttribute('src')) return;
            if (bgMusic.paused) {
                bgMusic.play().then(markPlaying).catch(() => { });
            } else {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            }
        });

        return () => cleanups.forEach(fn => fn());
    }, [startsAt]);

    return null;
}
