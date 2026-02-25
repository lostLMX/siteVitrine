// ===== PORTFOLIO MANAGEMENT SYSTEM WITH BCRYPT SECURITY =====

class PortfolioManager {
    constructor() {
        this.works = [];
        this.categories = ['photography', 'illustration', 'design'];
        this.currentFilter = 'all';
        this.isAdmin = false;
        this.requirePasswordChange = false;
        this.bcryptReady = false;
        
        // Default credentials
        this.defaultUsername = 'smithLePlusBeau';
        this.defaultPassword = '1234';
        this.defaultPasswordHash = null; // Will be set when bcrypt is ready
        
        this.init();
    }

    async init() {
        // Wait for bcrypt to be ready
        await this.waitForBcrypt();
        
        this.loadWorks();
        this.loadAdminSettings();
        this.setupEventListeners();
        this.renderGallery();
        this.updateStats();
    }

    // ===== BCRYPT SETUP =====
    waitForBcrypt() {
        return new Promise((resolve) => {
            const checkBcrypt = () => {
                if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
                    this.bcryptReady = true;
                    // Generate hash for default password
                    this.defaultPasswordHash = dcodeIO.bcrypt.hashSync(this.defaultPassword, 10);
                    console.log('🔐 bcrypt.js loaded and ready');
                    resolve();
                } else {
                    setTimeout(checkBcrypt, 100);
                }
            };
            checkBcrypt();
        });
    }

    // ===== SECURE CRYPTO FUNCTIONS =====
    async hashPassword(password) {
        if (!this.bcryptReady) {
            console.error('bcrypt not ready');
            return null;
        }
        
        try {
            // Use bcrypt with salt rounds of 12 for high security
            const salt = await dcodeIO.bcrypt.genSalt(12);
            const hash = await dcodeIO.bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            console.error('Error hashing password:', error);
            return null;
        }
    }

    async verifyPassword(password, hash) {
        if (!this.bcryptReady) {
            console.error('bcrypt not ready');
            return false;
        }
        
        try {
            const match = await dcodeIO.bcrypt.compare(password, hash);
            return match;
        } catch (error) {
            console.error('Error verifying password:', error);
            return false;
        }
    }

    // ===== MIGRATION FOR OLD PASSWORDS =====
    async migrateOldPassword(oldHash, newPassword) {
        // Check if the old hash is not a bcrypt hash (migration needed)
        if (oldHash && !oldHash.startsWith('$2') && oldHash.length < 60) {
            console.log('🔄 Migrating old password hash to bcrypt');
            const newHash = await this.hashPassword(newPassword);
            return newHash;
        }
        return oldHash;
    }

    // ===== DATA MANAGEMENT =====
    loadWorks() {
        const savedWorks = localStorage.getItem('portfolioWorks');
        if (savedWorks) {
            this.works = JSON.parse(savedWorks);
        } else {
            // Load sample works
            this.loadSampleWorks();
        }
    }

    saveWorks() {
        localStorage.setItem('portfolioWorks', JSON.stringify(this.works));
        this.updateStats();
    }

    loadSampleWorks() {
        this.works = [
            {
                id: 1,
                title: 'Architecture Moderne',
                category: 'photography',
                image: 'https://picsum.photos/seed/arch1/400/300.jpg',
                description: 'Une exploration des lignes architecturales contemporaines.'
            },
            {
                id: 2,
                title: 'Portrait Artistique',
                category: 'photography',
                image: 'https://picsum.photos/seed/portrait1/400/300.jpg',
                description: 'Étude de lumière et d\'ombre dans le portrait.'
            },
            {
                id: 3,
                title: 'Nature Abstraite',
                category: 'illustration',
                image: 'https://picsum.photos/seed/nature1/400/300.jpg',
                description: 'Interprétation artistique des formes naturelles.'
            },
            {
                id: 4,
                title: 'Design Minimaliste',
                category: 'design',
                image: 'https://picsum.photos/seed/design1/400/300.jpg',
                description: 'L\'élégance de la simplicité dans le design.'
            },
            {
                id: 5,
                title: 'Urbain Poétique',
                category: 'photography',
                image: 'https://picsum.photos/seed/urban1/400/300.jpg',
                description: 'La poésie cachée dans les paysages urbains.'
            },
            {
                id: 6,
                title: 'Illustration Conceptuelle',
                category: 'illustration',
                image: 'https://picsum.photos/seed/concept1/400/300.jpg',
                description: 'Exploration visuelle de concepts abstraits.'
            }
        ];
        this.saveWorks();
    }

    async loadAdminSettings() {
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.currentPasswordHash = settings.passwordHash || this.defaultPasswordHash;
            this.requirePasswordChange = settings.requirePasswordChange !== false;
            
            // Check if migration is needed
            if (settings.passwordHash && !settings.passwordHash.startsWith('$2')) {
                console.log('🔄 Detected old password format, initiating migration...');
                // For migration, we'll require password change on next login
                this.requirePasswordChange = true;
                this.saveAdminSettings();
            }
        } else {
            // First time setup - use default credentials with bcrypt
            this.currentPasswordHash = this.defaultPasswordHash;
            this.requirePasswordChange = true;
            this.saveAdminSettings();
        }
    }

    async saveAdminSettings() {
        const settings = {
            username: this.defaultUsername,
            passwordHash: this.currentPasswordHash,
            requirePasswordChange: this.requirePasswordChange,
            bcryptVersion: '2.4.3',
            migratedAt: new Date().toISOString()
        };
        localStorage.setItem('adminSettings', JSON.stringify(settings));
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Gallery filters
        this.setupFilters();
        
        // Lightbox
        this.setupLightbox();
        
        // Admin panel
        this.setupAdminPanel();
        
        // Contact form
        this.setupContactForm();
    }

    setupNavigation() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const navHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu
                        if (navMenu.classList.contains('active')) {
                            menuToggle.classList.remove('active');
                            navMenu.classList.remove('active');
                        }
                    }
                }
            });
        });

        // Admin toggle
        const adminToggle = document.getElementById('adminToggle');
        if (adminToggle) {
            adminToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAdminPanel();
            });
        }
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter gallery
                this.currentFilter = btn.dataset.filter;
                this.renderGallery();
            });
        });
    }

    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.getElementById('lightboxClose');
        
        // Open lightbox on gallery item click
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const workId = parseInt(galleryItem.dataset.workId);
                const work = this.works.find(w => w.id === workId);
                if (work) {
                    this.openLightbox(work);
                }
            }
        });
        
        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                this.closeLightbox();
            });
        }
        
        // Close on background click
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        });
    }

    setupAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        const adminClose = document.getElementById('adminClose');
        const loginForm = document.getElementById('loginForm');
        const passwordChangeForm = document.getElementById('passwordChangeForm');
        const uploadForm = document.getElementById('uploadForm');
        const simulateUpload = document.getElementById('simulateUpload');
        const saveSettings = document.getElementById('saveSettings');
        
        // Close admin panel
        if (adminClose) {
            adminClose.addEventListener('click', () => {
                this.closeAdminPanel();
            });
        }
        
        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Password change form
        if (passwordChangeForm) {
            passwordChangeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordChange();
            });
        }
        
        // Upload form
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUpload();
            });
        }
        
        // Simulate upload button
        if (simulateUpload) {
            simulateUpload.addEventListener('click', () => {
                this.simulateImageUpload();
            });
        }
        
        // Settings save
        if (saveSettings) {
            saveSettings.addEventListener('click', () => {
                this.saveSettings();
            });
        }
        
        // Admin tabs
        this.setupAdminTabs();
    }

    setupAdminTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                const targetContent = document.getElementById(targetTab + 'Tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Refresh works list if manage tab
                if (targetTab === 'manage') {
                    this.renderWorksList();
                }
            });
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }

    // ===== GALLERY FUNCTIONS =====
    renderGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        // Show loading
        this.showLoading();
        
        // Simulate loading delay
        setTimeout(() => {
            const filteredWorks = this.currentFilter === 'all' 
                ? this.works 
                : this.works.filter(work => work.category === this.currentFilter);
            
            galleryGrid.innerHTML = '';
            
            if (filteredWorks.length === 0) {
                galleryGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Aucune œuvre trouvée.</p>';
            } else {
                filteredWorks.forEach(work => {
                    const galleryItem = this.createGalleryItem(work);
                    galleryGrid.appendChild(galleryItem);
                });
            }
            
            this.hideLoading();
        }, 300);
    }

    createGalleryItem(work) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.workId = work.id;
        
        item.innerHTML = `
            <img src="${work.image}" alt="${work.title}" loading="lazy">
            <div class="gallery-overlay">
                <h3 class="gallery-title">${work.title}</h3>
                <p class="gallery-category">${this.getCategoryLabel(work.category)}</p>
            </div>
        `;
        
        return item;
    }

    getCategoryLabel(category) {
        const labels = {
            'photography': 'Photographie',
            'illustration': 'Illustration',
            'design': 'Design'
        };
        return labels[category] || category;
    }

    // ===== LIGHTBOX FUNCTIONS =====
    openLightbox(work) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxDescription = document.getElementById('lightboxDescription');
        
        if (lightbox && lightboxImage && lightboxTitle && lightboxDescription) {
            lightboxImage.src = work.image;
            lightboxImage.alt = work.title;
            lightboxTitle.textContent = work.title;
            lightboxDescription.textContent = work.description || '';
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ===== ADMIN FUNCTIONS =====
    toggleAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.toggle('active');
        }
    }

    closeAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.remove('active');
            this.isAdmin = false;
            this.resetAdminPanel();
        }
    }

    async handleLogin() {
        const usernameInput = document.getElementById('adminUsername');
        const passwordInput = document.getElementById('adminPassword');
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        if (!this.bcryptReady) {
            alert('Système de sécurité en cours de chargement. Veuillez réessayer.');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Vérification en cours...';
        submitBtn.disabled = true;
        
        try {
            const isValid = await this.verifyPassword(password, this.currentPasswordHash);
            
            if (username === this.defaultUsername && isValid) {
                this.isAdmin = true;
                
                // Check if password change is required
                if (this.requirePasswordChange) {
                    this.showPasswordChangeForm();
                } else {
                    this.showAdminDashboard();
                }
                
                usernameInput.value = '';
                passwordInput.value = '';
            } else {
                alert('Identifiant ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Erreur lors de la vérification. Veuillez réessayer.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showPasswordChangeForm() {
        const adminLogin = document.getElementById('adminLogin');
        const forcePasswordChange = document.getElementById('forcePasswordChange');
        
        if (adminLogin && forcePasswordChange) {
            adminLogin.style.display = 'none';
            forcePasswordChange.style.display = 'block';
        }
    }

    async handlePasswordChange() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword.length < 8) {
            alert('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        
        // Check password strength
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumbers = /\d/.test(newPassword);
        const hasNonalphas = /\W/.test(newPassword);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            const confirmWeak = confirm('Votre mot de passe semble faible. Pour plus de sécurité, utilisez une combinaison de majuscules, minuscules et chiffres. Continuer quand même ?');
            if (!confirmWeak) return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('#passwordChangeForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Cryptage en cours...';
        submitBtn.disabled = true;
        
        try {
            // Update password with bcrypt
            this.currentPasswordHash = await this.hashPassword(newPassword);
            this.requirePasswordChange = false;
            await this.saveAdminSettings();
            
            // Show admin dashboard
            this.showAdminDashboard();
            
            alert('Mot de passe changé avec succès et sécurisé avec bcrypt !');
        } catch (error) {
            console.error('Password change error:', error);
            alert('Erreur lors du changement de mot de passe. Veuillez réessayer.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showAdminDashboard() {
        const adminLogin = document.getElementById('adminLogin');
        const forcePasswordChange = document.getElementById('forcePasswordChange');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (adminLogin && forcePasswordChange && adminDashboard) {
            adminLogin.style.display = 'none';
            forcePasswordChange.style.display = 'none';
            adminDashboard.style.display = 'block';
            this.renderWorksList();
        }
    }

    resetAdminPanel() {
        const adminLogin = document.getElementById('adminLogin');
        const forcePasswordChange = document.getElementById('forcePasswordChange');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (adminLogin && forcePasswordChange && adminDashboard) {
            adminLogin.style.display = 'block';
            forcePasswordChange.style.display = 'none';
            adminDashboard.style.display = 'none';
        }
    }

    handleUpload() {
        const title = document.getElementById('workTitle').value;
        const category = document.getElementById('workCategory').value;
        const description = document.getElementById('workDescription').value;
        const imageUrl = document.getElementById('workImageUrl').value;
        
        if (!title || !imageUrl) {
            alert('Veuillez remplir le titre et l\'URL de l\'image');
            return;
        }
        
        const newWork = {
            id: Date.now(),
            title,
            category,
            description,
            image: imageUrl
        };
        
        this.works.unshift(newWork);
        this.saveWorks();
        this.renderGallery();
        
        // Reset form
        document.getElementById('uploadForm').reset();
        
        alert('Œuvre ajoutée avec succès !');
    }

    simulateImageUpload() {
        const randomSeed = Math.random().toString(36).substring(7);
        const imageUrl = `https://picsum.photos/seed/${randomSeed}/400/300.jpg`;
        
        document.getElementById('workImageUrl').value = imageUrl;
        alert('URL d\'image simulée générée !');
    }

    renderWorksList() {
        const worksList = document.getElementById('worksList');
        if (!worksList) return;
        
        worksList.innerHTML = '';
        
        if (this.works.length === 0) {
            worksList.innerHTML = '<p>Aucune œuvre à gérer.</p>';
            return;
        }
        
        this.works.forEach(work => {
            const workItem = document.createElement('div');
            workItem.className = 'work-item';
            
            workItem.innerHTML = `
                <img src="${work.image}" alt="${work.title}">
                <div class="work-info">
                    <h5>${work.title}</h5>
                    <p>${this.getCategoryLabel(work.category)}</p>
                </div>
                <div class="work-actions">
                    <button onclick="portfolioManager.editWork(${work.id})" title="Modifier">✏️</button>
                    <button onclick="portfolioManager.deleteWork(${work.id})" class="delete" title="Supprimer">🗑️</button>
                </div>
            `;
            
            worksList.appendChild(workItem);
        });
    }

    editWork(workId) {
        const work = this.works.find(w => w.id === workId);
        if (!work) return;
        
        // Fill upload form with work data
        document.getElementById('workTitle').value = work.title;
        document.getElementById('workCategory').value = work.category;
        document.getElementById('workDescription').value = work.description || '';
        document.getElementById('workImageUrl').value = work.image;
        
        // Switch to upload tab
        document.querySelector('[data-tab="upload"]').click();
        
        // Remove work (will be re-added when form is submitted)
        this.deleteWork(workId, false);
    }

    deleteWork(workId, confirm = true) {
        if (confirm && !window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
            return;
        }
        
        this.works = this.works.filter(w => w.id !== workId);
        this.saveWorks();
        this.renderGallery();
        this.renderWorksList();
        
        if (confirm) {
            alert('Œuvre supprimée avec succès !');
        }
    }

    async saveSettings() {
        const galleryName = document.getElementById('galleryName').value;
        const contactEmail = document.getElementById('contactEmail').value;
        const newPassword = document.getElementById('updatePassword').value;
        
        // Update gallery name
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && galleryName) {
            heroTitle.textContent = galleryName;
        }
        
        // Update contact email
        const contactEmailElement = document.querySelector('.contact-details p');
        if (contactEmailElement && contactEmail) {
            contactEmailElement.innerHTML = `<strong>Email:</strong> ${contactEmail}`;
        }
        
        // Update admin password if provided
        if (newPassword && newPassword.length >= 8) {
            const submitBtn = document.getElementById('saveSettings');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Cryptage...';
            submitBtn.disabled = true;
            
            try {
                this.currentPasswordHash = await this.hashPassword(newPassword);
                await this.saveAdminSettings();
                alert('Mot de passe admin mis à jour !');
            } catch (error) {
                console.error('Password update error:', error);
                alert('Erreur lors de la mise à jour du mot de passe.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
        
        // Save settings to localStorage
        const settings = {
            galleryName,
            contactEmail
        };
        localStorage.setItem('portfolioSettings', JSON.stringify(settings));
        
        if (!newPassword) {
            alert('Paramètres sauvegardés avec succès !');
        }
        
        // Clear password field
        document.getElementById('updatePassword').value = '';
    }

    // ===== CONTACT FORM =====
    handleContactForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = 'Message envoyé !';
            submitBtn.style.background = '#28a745';
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
            
            console.log('✉️ Message envoyé avec succès !');
        }, 1500);
    }

    // ===== UTILITY FUNCTIONS =====
    showLoading() {
        const loading = document.getElementById('galleryLoading');
        if (loading) {
            loading.style.display = 'block';
        }
    }

    hideLoading() {
        const loading = document.getElementById('galleryLoading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    updateStats() {
        const totalWorks = document.getElementById('totalWorks');
        const totalCategories = document.getElementById('totalCategories');
        const lastUpdate = document.getElementById('lastUpdate');
        
        if (totalWorks) {
            totalWorks.textContent = this.works.length;
        }
        
        if (totalCategories) {
            const uniqueCategories = [...new Set(this.works.map(w => w.category))];
            totalCategories.textContent = uniqueCategories.length;
        }
        
        if (lastUpdate) {
            const today = new Date().toLocaleDateString('fr-FR');
            lastUpdate.textContent = today;
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    window.portfolioManager = new PortfolioManager();
    
    // Load saved settings
    const savedSettings = localStorage.getItem('portfolioSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply saved settings
        if (settings.galleryName) {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.textContent = settings.galleryName;
            }
        }
        
        if (settings.contactEmail) {
            const contactEmailElement = document.querySelector('.contact-details p');
            if (contactEmailElement) {
                contactEmailElement.innerHTML = `<strong>Email:</strong> ${settings.contactEmail}`;
            }
        }
    }
    
    console.log('🎨 Portfolio Manager initialized with bcrypt security');
});

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// ===== CONSOLE GREETING =====
console.log('%c🎨 Portfolio Artistique', 'font-size: 20px; color: #000; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
console.log('%c"La créativité sans limites"', 'font-style: italic; color: #666;');
console.log('%c🔐 Sécurité renforcée avec bcrypt.js', 'font-size: 12px; color: #28a745;');
