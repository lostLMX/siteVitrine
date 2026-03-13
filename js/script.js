// ── Nebula canvas background ────────────────────────────────────────────────
;(function initNebula() {
    const cv = document.createElement('canvas')
    cv.setAttribute('aria-hidden', 'true')
    cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none;display:block;'
    document.body.prepend(cv)

    const cx = cv.getContext('2d')
    let W = cv.width  = window.innerWidth
    let H = cv.height = window.innerHeight

    const PI2 = Math.PI * 2
    const rnd = (a, b) => a + Math.random() * (b - a)

    function bandY(x) {
        return H * 0.52 - (x - W * 0.45) * 0.15
    }

    let stars = [], dust = []

    function initStars() {
        stars = []
        for (let i = 0; i < 1800; i++) {
            const x = rnd(0, W)
            const y = rnd(0, H)
            const dy = y - bandY(x)
            const inBand = Math.abs(dy) < H * 0.22
            if (!inBand && Math.random() < 0.45) continue
            const gold   = inBand && x > W * 0.46 && Math.random() < 0.55
            const blue   = inBand && x < W * 0.54 && Math.random() < 0.40
            const bright = inBand && Math.random() < 0.07
            stars.push({
                x, y,
                r:    rnd(0.2, inBand ? 1.8 : 1.0),
                base: rnd(0.15, inBand ? 0.95 : 0.45),
                tw:   rnd(0, PI2),
                gold, blue, bright
            })
        }
    }

    function initDust() {
        dust = []
        for (let i = 0; i < 700; i++) {
            const x    = rnd(0, W)
            const cy2  = bandY(x)
            const y    = cy2 + rnd(-H * 0.2, H * 0.2)
            const gold = x > W * 0.44 && Math.random() < 0.6
            dust.push({
                x0: x, y0: y,
                r:     rnd(0.8, 3.8),
                alpha: rnd(0.04, 0.28),
                gold,
                sx:    rnd(-0.06, 0.06),
                sy:    rnd(-0.02, 0.02),
                phase: rnd(0, PI2),
                freq:  rnd(0.3, 1.2)
            })
        }
    }

    const HALOS = [
        { px: 0.46, py: 0.50, pr: 0.07,  c: [240,252,255], a: 0.32 },
        { px: 0.41, py: 0.51, pr: 0.04,  c: [180,225,255], a: 0.20 },
        { px: 0.37, py: 0.52, pr: 0.025, c: [140,195,255], a: 0.14 },
        { px: 0.54, py: 0.49, pr: 0.022, c: [210,175,100], a: 0.14 },
        { px: 0.66, py: 0.50, pr: 0.05,  c: [210,145, 55], a: 0.16 },
        { px: 0.76, py: 0.52, pr: 0.035, c: [190,120, 45], a: 0.12 },
        { px: 0.27, py: 0.53, pr: 0.025, c: [130,195,250], a: 0.12 },
        { px: 0.17, py: 0.58, pr: 0.018, c: [100,165,230], a: 0.09 },
        { px: 0.82, py: 0.47, pr: 0.020, c: [215,165, 80], a: 0.11 },
    ]

    let t = 0

    function drawBackground() {
        const bg = cx.createRadialGradient(W*0.45, H*0.5, 20, W*0.45, H*0.5, W*0.7)
        bg.addColorStop(0,   '#0c2340')
        bg.addColorStop(0.4, '#071525')
        bg.addColorStop(1,   '#020810')
        cx.fillStyle = bg
        cx.fillRect(0, 0, W, H)
    }

    function drawNebulaClouds() {
        const band = cx.createRadialGradient(W*0.44, H*0.50, 0, W*0.44, H*0.50, W*0.32)
        band.addColorStop(0,   'rgba(160,220,255,0.13)')
        band.addColorStop(0.3, 'rgba(80,160,220,0.07)')
        band.addColorStop(1,   'rgba(20,60,120,0)')
        cx.save()
        cx.translate(W*0.44, H*0.50)
        cx.scale(2.6, 0.5)
        cx.translate(-W*0.44, -H*0.50)
        cx.fillStyle = band
        cx.fillRect(0, 0, W, H)
        cx.restore()

        const core = cx.createRadialGradient(W*0.46, H*0.50, 0, W*0.46, H*0.50, W*0.10)
        core.addColorStop(0,    'rgba(240,252,255,0.38)')
        core.addColorStop(0.15, 'rgba(190,238,255,0.22)')
        core.addColorStop(0.45, 'rgba(100,180,230,0.09)')
        core.addColorStop(1,    'rgba(20,60,120,0)')
        cx.fillStyle = core
        cx.fillRect(0, 0, W, H)

        const blueL = cx.createRadialGradient(W*0.30, H*0.52, 0, W*0.30, H*0.52, W*0.14)
        blueL.addColorStop(0, 'rgba(100,180,240,0.10)')
        blueL.addColorStop(1, 'rgba(30,80,150,0)')
        cx.fillStyle = blueL
        cx.fillRect(0, 0, W, H)

        const goldR = cx.createRadialGradient(W*0.66, H*0.50, 0, W*0.66, H*0.50, W*0.18)
        goldR.addColorStop(0,   'rgba(210,145,55,0.17)')
        goldR.addColorStop(0.4, 'rgba(180,110,40,0.08)')
        goldR.addColorStop(1,   'rgba(150,80,20,0)')
        cx.fillStyle = goldR
        cx.fillRect(0, 0, W, H)

        const goldR2 = cx.createRadialGradient(W*0.80, H*0.60, 0, W*0.80, H*0.60, W*0.12)
        goldR2.addColorStop(0, 'rgba(200,130,45,0.13)')
        goldR2.addColorStop(1, 'rgba(150,80,20,0)')
        cx.fillStyle = goldR2
        cx.fillRect(0, 0, W, H)

        const blueS = cx.createRadialGradient(W*0.22, H*0.62, 0, W*0.22, H*0.62, W*0.065)
        blueS.addColorStop(0, 'rgba(120,190,240,0.09)')
        blueS.addColorStop(1, 'rgba(40,100,180,0)')
        cx.fillStyle = blueS
        cx.fillRect(0, 0, W, H)
    }

    function drawHalos() {
        HALOS.forEach(s => {
            const x = s.px * W, y = s.py * H, r = s.pr * W
            const g = cx.createRadialGradient(x, y, 0, x, y, r)
            g.addColorStop(0, `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${s.a})`)
            g.addColorStop(1, 'rgba(0,0,0,0)')
            cx.fillStyle = g
            cx.fillRect(0, 0, W, H)
        })
    }

    function drawDust() {
        dust.forEach(p => {
            const px = ((p.x0 + Math.sin(t * p.freq * 0.4 + p.phase) * 14 + t * p.sx * 40) % W + W) % W
            const py = p.y0 + Math.cos(t * p.freq * 0.3 + p.phase) * 6
            if (py < 0 || py > H) return
            const pulse = 0.6 + 0.4 * Math.sin(t * p.freq + p.phase)
            cx.beginPath()
            cx.arc(px, py, p.r, 0, PI2)
            cx.fillStyle = p.gold
                ? `rgba(220,150,55,${p.alpha * pulse})`
                : `rgba(120,190,240,${p.alpha * pulse})`
            cx.fill()
        })
    }

    function drawStars() {
        stars.forEach(s => {
            const tw  = 0.55 + 0.45 * Math.sin(t * 1.2 + s.tw)
            const col = s.gold  ? `rgba(255,${190 + Math.random()*40|0},${80  + Math.random()*50|0},${s.base*tw})`
                      : s.blue  ? `rgba(${170 + Math.random()*50|0},${215 + Math.random()*35|0},255,${s.base*tw})`
                      :            `rgba(200,225,255,${s.base*tw})`
            if (s.bright) {
                const hc = s.gold ? 'rgba(255,210,140,' : 'rgba(200,235,255,'
                const g  = cx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6)
                g.addColorStop(0,    hc + '0.85)')
                g.addColorStop(0.25, hc + '0.25)')
                g.addColorStop(1,   'rgba(0,0,0,0)')
                cx.fillStyle = g
                cx.beginPath()
                cx.arc(s.x, s.y, s.r * 6, 0, PI2)
                cx.fill()
            }
            cx.beginPath()
            cx.arc(s.x, s.y, s.r, 0, PI2)
            cx.fillStyle = col
            cx.fill()
        })
    }

    function frame() {
        cx.clearRect(0, 0, W, H)
        drawBackground()
        drawNebulaClouds()
        drawHalos()
        drawDust()
        drawStars()
        t += 0.008
        requestAnimationFrame(frame)
    }

    initStars()
    initDust()
    frame()

    window.addEventListener('resize', () => {
        W = cv.width  = window.innerWidth
        H = cv.height = window.innerHeight
        initStars()
        initDust()
    })
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
