// ── Barre d'administration persistante ───────────────────────────────────────
// Injecte une barre collante en haut de page si l'utilisateur est connecté.
// À inclure après supabase.js sur toutes les pages publiques.
;(async function initAdminBar() {
    if (!window.supabase) return
    const { data: { session } } = await window.supabase.auth.getSession()
    if (!session) return

    // ── Styles ────────────────────────────────────────────────────────────────
    const style = document.createElement('style')
    style.textContent = `
        #admin-topbar {
            position: sticky;
            top: 0;
            z-index: 1100;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 7px 20px;
            background: rgba(4, 8, 20, 0.97);
            border-bottom: 1px solid rgba(110, 180, 255, 0.22);
            backdrop-filter: blur(14px);
            font-family: var(--font-title, 'Cinzel', serif);
            font-size: 0.66rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            white-space: nowrap;
        }
        .atb-badge {
            display: flex;
            align-items: center;
            gap: 7px;
            color: rgba(158, 215, 255, 0.88);
            flex-shrink: 0;
        }
        .atb-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #9ed7ff;
            box-shadow: 0 0 8px rgba(158, 215, 255, 0.85);
            flex-shrink: 0;
        }
        .atb-spacer { flex: 1; }
        .atb-sep {
            color: rgba(191, 233, 255, 0.18);
            flex-shrink: 0;
        }
        .atb-link {
            color: rgba(191, 233, 255, 0.60);
            text-decoration: none;
            transition: color 150ms;
            flex-shrink: 0;
        }
        .atb-link:hover { color: rgba(191, 233, 255, 0.95); }
        .atb-logout {
            padding: 4px 12px;
            background: transparent;
            border: 1px solid rgba(255, 80, 80, 0.22);
            border-radius: 20px;
            color: rgba(255, 140, 140, 0.65);
            font-family: var(--font-title, 'Cinzel', serif);
            font-size: 0.66rem;
            letter-spacing: 0.10em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 150ms, border-color 150ms, color 150ms;
            flex-shrink: 0;
        }
        .atb-logout:hover {
            background: rgba(255, 80, 80, 0.10);
            border-color: rgba(255, 80, 80, 0.45);
            color: rgba(255, 140, 140, 0.95);
        }
    `
    document.head.appendChild(style)

    // ── Structure ─────────────────────────────────────────────────────────────
    const bar = document.createElement('div')
    bar.id = 'admin-topbar'
    bar.setAttribute('role', 'banner')
    bar.setAttribute('aria-label', 'Barre d\'administration')

    const badge = document.createElement('span')
    badge.className = 'atb-badge'
    badge.innerHTML = '<span class="atb-dot" aria-hidden="true"></span>Mode Admin'

    const spacer = document.createElement('span')
    spacer.className = 'atb-spacer'

    const sep1 = document.createElement('span')
    sep1.className = 'atb-sep'
    sep1.setAttribute('aria-hidden', 'true')
    sep1.textContent = '✦'

    const page = window.location.pathname.split('/').pop() || 'index.html'
    const isAtelier = page === 'atelier.html'

    const atelierLink = document.createElement('a')
    atelierLink.href = isAtelier ? 'index.html' : 'atelier.html'
    atelierLink.className = 'atb-link'
    atelierLink.textContent = isAtelier ? '← Site' : 'L\'Atelier'

    const sep2 = document.createElement('span')
    sep2.className = 'atb-sep'
    sep2.setAttribute('aria-hidden', 'true')
    sep2.textContent = '·'

    const logoutBtn = document.createElement('button')
    logoutBtn.className = 'atb-logout'
    logoutBtn.textContent = 'Déconnexion'
    logoutBtn.addEventListener('click', () => {
        if (typeof logout === 'function') logout()
    })

    bar.appendChild(badge)
    bar.appendChild(spacer)
    bar.appendChild(sep1)
    bar.appendChild(atelierLink)
    bar.appendChild(sep2)
    bar.appendChild(logoutBtn)

    // Insertion avant tout autre élément du body
    document.body.insertBefore(bar, document.body.firstChild)

    // ── Ajuste la navbar pour qu'elle reste sous la barre admin ───────────────
    const navbar = document.querySelector('.navbar-ad')
    if (navbar) {
        const barHeight = bar.offsetHeight
        navbar.style.top = barHeight + 'px'
    }
})()
