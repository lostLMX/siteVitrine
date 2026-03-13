// ── Canvas starfield ───────────────────────────────────────────────────────────
;(function initStarfield() {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:-3;pointer-events:none;display:block;'
    document.body.prepend(canvas)
    document.body.classList.add('has-starfield-canvas')

    const ctx = canvas.getContext('2d')
    let W = 0, H = 0

    const STARS = Array.from({ length: 380 }, () => {
        const rnd = Math.random()
        return {
            fx: Math.random(),
            fy: Math.random(),
            r: rnd < 0.60 ? 0.4 + Math.random() * 0.5
             : rnd < 0.85 ? 1.1 + Math.random() * 0.7
             :               2.4 + Math.random() * 1.4,
            o: 0.18 + Math.random() * 0.82,
            type: rnd < 0.25 ? 'ice' : rnd < 0.36 ? 'warm' : 'white',
        }
    })

    const CLOUDS = [
        { fx: 0.72, fy: 0.18, fr: 0.44, rgb: [18, 38, 130], o: 0.22 },
        { fx: 0.18, fy: 0.62, fr: 0.34, rgb: [52, 14, 108], o: 0.15 },
        { fx: 0.88, fy: 0.52, fr: 0.28, rgb: [12, 46, 118], o: 0.13 },
        { fx: 0.06, fy: 0.10, fr: 0.22, rgb: [28,  8,  78], o: 0.11 },
        { fx: 0.50, fy: 0.90, fr: 0.40, rgb: [ 8, 28,  88], o: 0.13 },
        { fx: 0.38, fy: 0.38, fr: 0.50, rgb: [ 4, 10,  40], o: 0.72 },
    ]

    const COLOR = { ice: [158, 215, 255], warm: [255, 230, 185], white: [255, 255, 255] }

    function draw() {
        ctx.clearRect(0, 0, W, H)

        for (const c of CLOUDS) {
            const x = c.fx * W, y = c.fy * H, r = c.fr * W
            const g = ctx.createRadialGradient(x, y, 0, x, y, r)
            g.addColorStop(0, `rgba(${c.rgb},${c.o})`)
            g.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fillStyle = g
            ctx.fill()
        }

        for (const s of STARS) {
            const x = s.fx * W, y = s.fy * H
            const col = COLOR[s.type]

            if (s.r > 1.8) {
                const halo = ctx.createRadialGradient(x, y, 0, x, y, s.r * 7)
                halo.addColorStop(0,   `rgba(${col},${(s.o * 0.55).toFixed(2)})`)
                halo.addColorStop(0.35,`rgba(${col},${(s.o * 0.12).toFixed(2)})`)
                halo.addColorStop(1,   'transparent')
                ctx.beginPath()
                ctx.arc(x, y, s.r * 7, 0, Math.PI * 2)
                ctx.fillStyle = halo
                ctx.fill()
            }

            ctx.beginPath()
            ctx.arc(x, y, s.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${col},${s.o.toFixed(2)})`
            ctx.fill()
        }
    }

    function resize() {
        W = canvas.width  = window.innerWidth
        H = canvas.height = window.innerHeight
        draw()
    }

    window.addEventListener('resize', resize)
    resize()
})()

document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'));
    if (revealTargets.length) {
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add('reveal-in');
                    io.unobserve(entry.target);
                }
            },
            { root: null, threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );
        for (const el of revealTargets) io.observe(el);
    }

    const mobileNavBtn = document.getElementById('mobileNavBtn');
    const mobileNav    = document.getElementById('mobileNav');
    if (mobileNavBtn && mobileNav) {
        mobileNavBtn.addEventListener('click', () => {
            const open = mobileNav.classList.toggle('open');
            mobileNavBtn.setAttribute('aria-expanded', open);
        });
        document.addEventListener('click', (e) => {
            if (!mobileNavBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('open');
                mobileNavBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
