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
