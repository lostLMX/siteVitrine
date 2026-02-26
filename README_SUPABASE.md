# Configuration Supabase pour votre Portfolio

## Étapes de configuration

### 1. Créer un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé anon

### 2. Configurer les clés dans le code
Dans le fichier `js/script.js`, modifiez les lignes suivantes :

```javascript
// Remplacez ces valeurs par vos clés Supabase
this.supabaseUrl = 'VOTRE_URL_SUPABASE';        // ex: 'https://votre-projet.supabase.co'
this.supabaseAnonKey = 'VOTRE_CLE_ANON_SUPABASE'; // ex: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### 3. Configuration de l'authentification
Dans votre dashboard Supabase :
1. Allez dans `Authentication` > `Settings`
2. Vérifiez que `Enable email confirmations` est désactivé (pour le développement)
3. Ajoutez l'URL de votre site dans `Site URL` : `http://localhost:3000` ou votre domaine

### 4. Compte admin par défaut
Le système utilise automatiquement :
- **Email**: `smithLePlusBeau@admin.local`
- **Mot de passe**: `1234`

Ce compte sera créé automatiquement lors de la première connexion.

## Fonctionnalités

### ✅ Authentification sécurisée
- Login/logout avec Supabase Auth
- Sessions persistantes
- Gestion automatique des tokens

### ✅ Migration automatique
- Le système détecte si Supabase est configuré
- Crée automatiquement le compte admin si nécessaire
- Compatible avec l'ancien système bcrypt

### ✅ Sécurité
- Mots de passe hachés par Supabase
- Tokens JWT gérés automatiquement
- Pas de mots de passe en clair dans le code

## Utilisation

1. Configurez vos clés Supabase dans le code
2. Ouvrez votre portfolio
3. Connectez-vous avec `smithLePlusBeau` et `1234`
4. Changez le mot de passe lors de la première connexion

## Dépannage

### "Supabase non configuré"
- Vérifiez que vous avez bien rempli les clés dans le constructeur
- Assurez-vous que l'URL et la clé sont correctes

### "Invalid login credentials"
- Le compte admin sera créé automatiquement à la première connexion
- Vérifiez que vous utilisez bien `smithLePlusBeau` comme identifiant

### Problèmes de session
- Supabase gère automatiquement les sessions
- Les sessions persistent même après rechargement de la page

## Avantages par rapport à bcrypt

✅ **Plus sécurisé** : Géré par Supabase, pas de stockage local des hashes  
✅ **Plus simple** : Pas besoin de gérer le hachage manuellement  
✅ **Sessions persistantes** : Reste connecté entre les visites  
✅ **Scalable** : Peut gérer plusieurs utilisateurs facilement  
✅ **Professionnel** : Solution d'authentification standard de l'industrie
