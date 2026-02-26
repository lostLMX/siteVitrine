// === CONFIGURE ICI TES CLÉS SUPABASE ===
const SUPABASE_URL = 'https://vgvudfjdibieuvukclqu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndnVkZmpkaWJpZXV2dWtjbHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjQ4ODIsImV4cCI6MjA4NzcwMDg4Mn0.Ta1wTeLwDP4dAKaAhmA1BfqeRNNRSpVtL0C3zafzxXM'

// Le CDN `@supabase/supabase-js@2` expose un global `supabase`.
// On crée notre client et on le met sur `window.supabase` pour qu'il soit accessible partout.
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const PHOTOS_BUCKET = 'photos'
const PHOTOS_TABLE = 'photos'

function getAdminEmail() {
    return 'dorian.collindu28@gmail.com'
}

async function isAdminSession() {
    const session = await checkAuth()
    if (!session?.user?.email) return false
    return session.user.email === getAdminEmail()
}

async function listPhotos() {
    const { data, error } = await window.supabase
        .from(PHOTOS_TABLE)
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
}

async function createSignedPhotoUrl(path, expiresInSeconds = 60 * 10) {
    const { data, error } = await window.supabase.storage
        .from(PHOTOS_BUCKET)
        .createSignedUrl(path, expiresInSeconds)
    if (error) throw error
    return data?.signedUrl || null
}

async function uploadPhotoFile(file, folder = 'uploads') {
    if (!file) throw new Error('Fichier manquant')
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const safeExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg'
    const fileName = `${crypto.randomUUID()}.${safeExt}`
    const path = `${folder}/${fileName}`

    const { error } = await window.supabase.storage
        .from(PHOTOS_BUCKET)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || undefined,
        })
    if (error) throw error
    return path
}

async function insertPhotoRow({ title, path }) {
    const { data, error } = await window.supabase
        .from(PHOTOS_TABLE)
        .insert([{ title: title || null, path }])
        .select('*')
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
    const { error } = await window.supabase.storage
        .from(PHOTOS_BUCKET)
        .remove([path])
    if (error) throw error
}

// Fonction pour vérifier si l'utilisateur est connecté
async function checkAuth() {
    const { data: { session } } = await window.supabase.auth.getSession()
    return session
}

// Déconnexion
async function logout() {
    await window.supabase.auth.signOut()
    window.location.href = 'login.html'
}