// ── Translations ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
    fr: {
        'nav.about':    'Présentation',
        'nav.gallery':  'Galerie',
        'nav.contact':  'Contact',

        'hero.kicker':      'Vitrine · Galerie · Book Nook',
        'hero.subtitle':    'Book Nooks artisanaux au souffle médiéval, baignés d\'azur astral. Une galerie à parcourir comme un grimoire.',
        'hero.cta.gallery': 'Voir la galerie',
        'hero.cta.contact': 'Nous contacter',
        'hero.cta.about':   'En savoir plus',

        'carousel.label': '✦ Aperçu — Collection complète',

        'featured.title':    'Créations récentes',
        'featured.subtitle': 'Découvrez les dernières pièces de la collection.',
        'featured.cta':      'Voir toute la galerie →',
        'featured.empty':    'Bientôt disponible.',

        'gallery.title':              'Galerie',
        'gallery.subtitle':           'Cliquez sur une création pour découvrir sa page.',
        'gallery.search.placeholder': 'Rechercher une création…',
        'gallery.empty':              'Aucune création pour le moment.',
        'gallery.no.result':          'Aucune correspondance pour cette recherche.',
        'gallery.count.suffix':       'création',
        'gallery.count.suffix.pl':    'créations',

        'article.back':        '← Retour à la galerie',
        'article.photos':      'Photos',
        'article.loading':     'Chargement…',
        'article.not.found':   'Article introuvable.',
        'article.view':        'Voir la création →',

        'contact.title':                   'Contact',
        'contact.subtitle':                'Une question, une commande sur mesure ? Écrivez-moi !',
        'contact.form.name':               'Nom',
        'contact.form.name.placeholder':   'Votre prénom ou pseudo',
        'contact.form.email':              'Votre email',
        'contact.form.email.placeholder':  'pour vous répondre',
        'contact.form.subject':            'Sujet',
        'contact.form.subject.placeholder':'Ex : commande sur mesure, question sur une pièce…',
        'contact.form.message':            'Votre message',
        'contact.form.message.placeholder':'Thème souhaité, dimensions, budget, délai… Tout détail est utile !',
        'contact.form.submit':             '✦ Envoyer le message',
        'contact.form.error.name':         'Veuillez entrer votre nom',
        'contact.form.error.email':        'Email invalide',
        'contact.form.error.message':      'Le message ne peut pas être vide',
        'contact.form.ok':                 '✅ Message envoyé ! Je vous réponds sous 48h.',
        'contact.form.err':                '❌ Erreur lors de l\'envoi. Réessayez ou écrivez directement par email.',
        'contact.social.intro':            'Retrouvez-moi sur les réseaux ou écrivez-moi directement ✨',

        'about.page.title':       'Présentation',
        'about.kicker':           'L\'artisan derrière Astra Draconis',
        'about.intro':            'Passionné(e) de fantasy, de médiéval et de création artisanale, je confectionne à la main des Book Nooks uniques qui transforment vos étagères en portails vers d\'autres mondes.',
        'about.craft.title':      'L\'Artisanat',
        'about.craft.text':       'Chaque pièce est imaginée, sculptée et peinte avec soin. Des matériaux sélectionnés, des détails minutieux, une âme inimitable.',
        'about.universe.title':   'L\'Univers',
        'about.universe.text':    'Inspirées des donjons, des forêts enchantées, des châteaux médiévaux et des bibliothèques magiques, mes créations invitent à l\'évasion.',
        'about.custom.title':     'Sur Mesure',
        'about.custom.text':      'Vous avez une idée précise ? Un univers favori ? Je crée des pièces personnalisées selon vos envies et votre imagination.',
        'about.cta.gallery':      'Voir la galerie',
        'about.cta.contact':      'Nous contacter',

        'footer.back': 'Retour en haut',
        'error.load':  'Erreur lors du chargement.',
    },
    en: {
        'nav.about':    'About',
        'nav.gallery':  'Gallery',
        'nav.contact':  'Contact',

        'hero.kicker':      'Showcase · Gallery · Book Nook',
        'hero.subtitle':    'Handcrafted Book Nooks with a medieval soul, bathed in astral azure. A gallery to browse like a grimoire.',
        'hero.cta.gallery': 'View the gallery',
        'hero.cta.contact': 'Contact us',
        'hero.cta.about':   'Learn more',

        'carousel.label': '✦ Preview — Full collection',

        'featured.title':    'Recent Creations',
        'featured.subtitle': 'Discover the latest pieces from the collection.',
        'featured.cta':      'View full gallery →',
        'featured.empty':    'Coming soon.',

        'gallery.title':              'Gallery',
        'gallery.subtitle':           'Click on a creation to discover its page.',
        'gallery.search.placeholder': 'Search a creation…',
        'gallery.empty':              'No creations yet.',
        'gallery.no.result':          'No results found.',
        'gallery.count.suffix':       'creation',
        'gallery.count.suffix.pl':    'creations',

        'article.back':        '← Back to gallery',
        'article.photos':      'Photos',
        'article.loading':     'Loading…',
        'article.not.found':   'Article not found.',
        'article.view':        'View creation →',

        'contact.title':                   'Contact',
        'contact.subtitle':                'A question, a custom order? Write to me!',
        'contact.form.name':               'Name',
        'contact.form.name.placeholder':   'Your first name or alias',
        'contact.form.email':              'Your email',
        'contact.form.email.placeholder':  'so I can reply to you',
        'contact.form.subject':            'Subject',
        'contact.form.subject.placeholder':'E.g.: custom order, question about a piece…',
        'contact.form.message':            'Your message',
        'contact.form.message.placeholder':'Desired theme, dimensions, budget, deadline… Every detail helps!',
        'contact.form.submit':             '✦ Send message',
        'contact.form.error.name':         'Please enter your name',
        'contact.form.error.email':        'Invalid email',
        'contact.form.error.message':      'Message cannot be empty',
        'contact.form.ok':                 '✅ Message sent! I\'ll reply within 48h.',
        'contact.form.err':                '❌ Send error. Retry or write directly by email.',
        'contact.social.intro':            'Find me on social media or write directly ✨',

        'about.page.title':       'About',
        'about.kicker':           'The artisan behind Astra Draconis',
        'about.intro':            'Passionate about fantasy, medieval worlds and handcraft, I create unique Book Nooks that transform your shelves into portals to other worlds.',
        'about.craft.title':      'The Craft',
        'about.craft.text':       'Every piece is imagined, sculpted and painted with care. Carefully selected materials, minute details, an inimitable soul.',
        'about.universe.title':   'The Universe',
        'about.universe.text':    'Inspired by dungeons, enchanted forests, medieval castles and magical libraries, my creations invite you to escape.',
        'about.custom.title':     'Custom Orders',
        'about.custom.text':      'Have a specific idea? A favourite universe? I create personalised pieces tailored to your wishes and imagination.',
        'about.cta.gallery':      'View the gallery',
        'about.cta.contact':      'Contact us',

        'footer.back': 'Back to top',
        'error.load':  'Loading error.',
    }
}

// ── State ─────────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('lang') ||
    (navigator.language?.startsWith('en') ? 'en' : 'fr')

// ── Helpers ───────────────────────────────────────────────────────────────────
function t(key) {
    return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS['fr']?.[key] ?? key
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n')
        const text = TRANSLATIONS[currentLang]?.[key]
        if (text !== undefined) el.textContent = text
    })
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder')
        const text = TRANSLATIONS[currentLang]?.[key]
        if (text !== undefined) el.placeholder = text
    })
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria')
        const text = TRANSLATIONS[currentLang]?.[key]
        if (text !== undefined) el.setAttribute('aria-label', text)
    })
    const langBtn = document.getElementById('langBtn')
    if (langBtn) langBtn.textContent = currentLang === 'fr' ? 'EN' : 'FR'
    document.documentElement.lang = currentLang
}

function setLang(lang) {
    currentLang = lang
    localStorage.setItem('lang', lang)
    applyTranslations()
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }))
}

function toggleLang() {
    setLang(currentLang === 'fr' ? 'en' : 'fr')
}

document.addEventListener('DOMContentLoaded', applyTranslations)
