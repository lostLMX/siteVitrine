// === CONFIGURE ICI TES CLÉS SUPABASE ===
const SUPABASE_URL = 'https://TONID.supabase.co'          // ← remplace TONID
const SUPABASE_ANON_KEY = 'eyJ...ta-clé-anon-entière...' // ← colle ta clé anon

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Fonction pour vérifier si l'utilisateur est connecté
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

// Déconnexion
async function logout() {
    await supabase.auth.signOut()
    window.location.href = 'login.html'
}