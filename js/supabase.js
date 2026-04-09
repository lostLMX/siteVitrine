// ── Configuration ────────────────────────────────────────────────────────────
// Admins : ajoutez/retirez des utilisateurs directement dans le dashboard Supabase
// (Authentication > Users) — aucun email à coder en dur ici.
const SUPABASE_URL      = 'https://vgvudfjdibieuvukclqu.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_OOK6f85ZrW9yxj58lTVBfw__hP0m_oo'
const PHOTOS_BUCKET     = 'photos'
const PHOTOS_TABLE      = 'photos'
const UPLOAD_MAX_MB     = 8              // taille max upload
const UPLOAD_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const PHOTO_CATEGORY = { CAROUSEL: 'carousel', GALLERY: 'gallery' }

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
})

// ── Auth ─────────────────────────────────────────────────────────────────────
async function checkAuth() {
    const { data: { session } } = await window.supabase.auth.getSession()
    return session
}

async function isAdminSession() {
    const session = await checkAuth()
    return !!session
}

// Redirige vers portail.html si non connecté.
// Tout utilisateur authentifié dans Supabase est admin.
// Gérez les comptes dans Authentication > Users du dashboard Supabase.
async function requireAdmin() {
    const session = await checkAuth()
    if (!session) { window.location.replace('portail.html'); return null }
    return session
}

// Écoute les changements de session (expiry, logout depuis un autre onglet…)
window.supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' && window.location.pathname.endsWith('atelier.html')) {
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
    const { data } = window.supabase.storage
        .from(PHOTOS_BUCKET)
        .getPublicUrl(path)
    return data.publicUrl
}

async function createSignedPhotoUrlsBatch(paths) {
    const result = {}
    for (const path of paths) {
        const { data } = window.supabase.storage
            .from(PHOTOS_BUCKET)
            .getPublicUrl(path)
        result[path] = data.publicUrl
    }
    return result
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
    const { error } = await window.supabase.storage.from(PHOTOS_BUCKET).remove([path])
    if (error) throw error
}

// ── Articles — lecture ────────────────────────────────────────────────────────
// SQL à exécuter dans Supabase (SQL Editor) si ces tables n'existent pas :
//
// CREATE TABLE articles (
//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     title TEXT NOT NULL,
//     description TEXT,
//     cover_path TEXT,
//     created_at TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE TABLE article_photos (
//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
//     path TEXT NOT NULL,
//     caption TEXT,
//     sort_order INTEGER DEFAULT 0,
//     created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
// ALTER TABLE article_photos ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
// CREATE POLICY "Public read article_photos" ON article_photos FOR SELECT USING (true);
// CREATE POLICY "Auth write articles" ON articles FOR ALL USING (auth.role() = 'authenticated');
// CREATE POLICY "Auth write article_photos" ON article_photos FOR ALL USING (auth.role() = 'authenticated');

async function listArticles() {
    const { data, error } = await window.supabase
        .from('articles')
        .select('id, title, description, cover_path, created_at, layout')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
}

async function listArticlesWithTypes() {
    const { data, error } = await window.supabase
        .from('articles')
        .select('id, title, description, cover_path, created_at, article_type_links(article_types(id, name))')
        .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(art => ({
        ...art,
        types: (art.article_type_links || []).map(l => l.article_types).filter(Boolean)
    }))
}

async function getArticle(id) {
    const { data, error } = await window.supabase
        .from('articles')
        .select('id, title, description, cover_path, created_at')
        .eq('id', id)
        .single()
    if (error) throw error
    return data
}

async function insertArticle({ title, description = null, cover_path = null }) {
    const { data, error } = await window.supabase
        .from('articles')
        .insert([{ title: title?.trim(), description: description?.trim() || null, cover_path }])
        .select('id, title, description, cover_path, created_at')
        .single()
    if (error) throw error
    return data
}

async function updateArticle(id, fields) {
    const { data, error } = await window.supabase
        .from('articles')
        .update(fields)
        .eq('id', id)
        .select('id, title, description, cover_path, created_at')
        .single()
    if (error) throw error
    return data
}

async function deleteArticle(id) {
    const { error } = await window.supabase
        .from('articles')
        .delete()
        .eq('id', id)
    if (error) throw error
}

// ── Article photos — lecture/écriture ─────────────────────────────────────────
async function listArticlePhotos(articleId) {
    const { data, error } = await window.supabase
        .from('article_photos')
        .select('id, article_id, path, caption, sort_order, created_at')
        .eq('article_id', articleId)
        .order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
}

async function insertArticlePhotoRow({ article_id, path, caption = null, sort_order = 0 }) {
    const { data, error } = await window.supabase
        .from('article_photos')
        .insert([{ article_id, path, caption: caption?.trim() || null, sort_order }])
        .select('id, article_id, path, caption, sort_order, created_at')
        .single()
    if (error) throw error
    return data
}

async function deleteArticlePhotoRow(id) {
    const { data, error } = await window.supabase
        .from('article_photos')
        .delete()
        .eq('id', id)
        .select('path')
        .single()
    if (error) throw error
    return data
}

// ── Types d'articles ──────────────────────────────────────────────────────────
// SQL à exécuter dans Supabase (SQL Editor) si ces tables n'existent pas :
//
// CREATE TABLE article_types (
//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     name TEXT NOT NULL UNIQUE,
//     created_at TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE TABLE article_type_links (
//     article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
//     type_id UUID REFERENCES article_types(id) ON DELETE CASCADE NOT NULL,
//     PRIMARY KEY (article_id, type_id)
// );
// ALTER TABLE article_types ENABLE ROW LEVEL SECURITY;
// ALTER TABLE article_type_links ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read article_types" ON article_types FOR SELECT USING (true);
// CREATE POLICY "Public read article_type_links" ON article_type_links FOR SELECT USING (true);
// CREATE POLICY "Auth write article_types" ON article_types FOR ALL USING (auth.role() = 'authenticated');
// CREATE POLICY "Auth write article_type_links" ON article_type_links FOR ALL USING (auth.role() = 'authenticated');

async function listArticleTypes() {
    const { data, error } = await window.supabase
        .from('article_types')
        .select('id, name, created_at')
        .order('name', { ascending: true })
    if (error) throw error
    return data || []
}

async function insertArticleType({ name }) {
    const { data, error } = await window.supabase
        .from('article_types')
        .insert([{ name: name.trim() }])
        .select('id, name, created_at')
        .single()
    if (error) throw error
    return data
}

async function updateArticleType(id, { name }) {
    const { data, error } = await window.supabase
        .from('article_types')
        .update({ name: name.trim() })
        .eq('id', id)
        .select('id, name, created_at')
        .single()
    if (error) throw error
    return data
}

async function deleteArticleType(id) {
    const { error } = await window.supabase
        .from('article_types')
        .delete()
        .eq('id', id)
    if (error) throw error
}

async function listTypesForArticle(articleId) {
    const { data, error } = await window.supabase
        .from('article_type_links')
        .select('type_id')
        .eq('article_id', articleId)
    if (error) throw error
    return (data || []).map(r => r.type_id)
}

async function setTypesForArticle(articleId, typeIds) {
    const { error: delErr } = await window.supabase
        .from('article_type_links')
        .delete()
        .eq('article_id', articleId)
    if (delErr) throw delErr
    if (!typeIds.length) return
    const rows = typeIds.map(type_id => ({ article_id: articleId, type_id }))
    const { error: insErr } = await window.supabase
        .from('article_type_links')
        .insert(rows)
    if (insErr) throw insErr
}
