document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!revealTargets.length) return;

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
});
