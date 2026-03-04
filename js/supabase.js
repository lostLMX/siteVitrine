// ── Configuration ────────────────────────────────────────────────────────────
const SUPABASE_URL      = 'https://vgvudfjdibieuvukclqu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndnVkZmpkaWJpZXV2dWtjbHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjQ4ODIsImV4cCI6MjA4NzcwMDg4Mn0.Ta1wTeLwDP4dAKaAhmA1BfqeRNNRSpVtL0C3zafzxXM'
const ADMIN_EMAIL       = 'dorian.collindu28@gmail.com'
const PHOTOS_BUCKET     = 'photos'
const PHOTOS_TABLE      = 'photos'
const SIGNED_URL_TTL    = 60 * 60        // 1 heure en secondes
const UPLOAD_MAX_MB     = 8              // taille max upload
const UPLOAD_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const PHOTO_CATEGORY = { CAROUSEL: 'carousel', GALLERY: 'gallery' }

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
})

// ── Cache des URLs signées (évite de re-signer à chaque render) ───────────────
// Structure : Map<path, { url: string, expiresAt: number }>
const _signedUrlCache = new Map()

// ── Auth ─────────────────────────────────────────────────────────────────────
async function checkAuth() {
    const { data: { session } } = await window.supabase.auth.getSession()
    return session
}

async function isAdminSession() {
    const session = await checkAuth()
    return session?.user?.email === ADMIN_EMAIL
}

// Redirige vers portail.html si non connecté ou non admin.
// Appeler en haut de atelier.html.
async function requireAdmin() {
    const session = await checkAuth()
    if (!session) { window.location.replace('portail.html'); return null }
    if (session.user.email !== ADMIN_EMAIL) { window.location.replace('portail.html'); return null }
    return session
}

// Écoute les changements de session (expiry, logout depuis un autre onglet…)
window.supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('portail.html')) {
        window.location.replace('index.html')
    }
})

async function logout() {
    await window.supabase.auth.signOut()
    window.location.replace('index.html')
}

// ── Mot de passe ──────────────────────────────────────────────────────────────
async function updateMyPassword(newPassword) {
    const session = await checkAuth()
    if (!session) throw new Error('Session expirée, veuillez vous reconnecter')

    const pwd = (newPassword || '').trim()
    if (pwd.length < 10)            throw new Error('10 caractères minimum requis')
    if (!/[a-z]/.test(pwd))         throw new Error('Au moins une lettre minuscule requise')
    if (!/[A-Z]/.test(pwd))         throw new Error('Au moins une lettre majuscule requise')
    if (!/[0-9]/.test(pwd))         throw new Error('Au moins un chiffre requis')
    if (!/[^A-Za-z0-9]/.test(pwd))  throw new Error('Au moins un symbole requis')

    const { error } = await window.supabase.auth.updateUser({ password: pwd })
    if (error) throw error
    return true
}

// ── Photos — lecture ──────────────────────────────────────────────────────────
async function listPhotos(category = null) {
    let query = window.supabase
        .from(PHOTOS_TABLE)
        .select('id, title, path, created_at, category')
        .order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) throw error
    return data || []
}

async function createSignedPhotoUrl(path) {
    const now = Date.now()

    const cached = _signedUrlCache.get(path)
    if (cached && cached.expiresAt > now + 60_000) {
        return cached.url
    }

    const { data, error } = await window.supabase.storage
        .from(PHOTOS_BUCKET)
        .createSignedUrl(path, SIGNED_URL_TTL)
    if (error) throw error

    const url = data?.signedUrl || null
    if (url) {
        _signedUrlCache.set(path, { url, expiresAt: now + SIGNED_URL_TTL * 1000 })
    }
    return url
}

// ── Photos — écriture ─────────────────────────────────────────────────────────
async function uploadPhotoFile(file, folder = 'uploads') {
    if (!file) throw new Error('Fichier manquant')

    if (!UPLOAD_MIME_TYPES.includes(file.type)) {
        throw new Error(`Format non supporté (acceptés : JPEG, PNG, WebP, GIF, AVIF)`)
    }
    if (file.size > UPLOAD_MAX_MB * 1024 * 1024) {
        throw new Error(`Fichier trop lourd (max ${UPLOAD_MAX_MB} Mo)`)
    }

    const ext      = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const path     = `${folder}/${crypto.randomUUID()}.${ext}`

    const { error } = await window.supabase.storage
        .from(PHOTOS_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
    if (error) throw error
    return path
}

async function insertPhotoRow({ title, path, category = PHOTO_CATEGORY.GALLERY }) {
    const { data, error } = await window.supabase
        .from(PHOTOS_TABLE)
        .insert([{ title: title?.trim() || null, path, category }])
        .select('id, title, path, created_at, category')
        .single()
    if (error) throw error
    return data
}

async function deletePhotoRow(id) {
    const { data, error } = await window.supabase
        .from(PHOTOS_TABLE)
        .delete()
        .eq('id', id)
        .select('path')
        .single()
    if (error) throw error
    return data
}

async function deletePhotoFile(path) {
    if (!path) return
    _signedUrlCache.delete(path)
    const { error } = await window.supabase.storage.from(PHOTOS_BUCKET).remove([path])
    if (error) throw error
}