// ===============================================
// VARIABLES GLOBALES
// ===============================================
let audioContext = null;
let currentTab = 'accueil';

// ===============================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGuitarStrings();
    initCustomCursor();
    initCTAButtons();
    initMobileMenu();
    
    // Initialiser l'AudioContext au premier clic (requis par les navigateurs)
    document.addEventListener('click', initAudioContext, { once: true });
});

// ===============================================
// INITIALISATION DE L'AUDIO CONTEXT
// ===============================================
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// ===============================================
// NAVIGATION ENTRE LES ONGLETS
// ===============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetTab = link.getAttribute('data-tab');
            switchTab(targetTab);
            
            // Fermer le menu mobile si ouvert
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

function switchTab(tabName) {
    // Cacher tous les contenus
    const allContents = document.querySelectorAll('.tab-content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Afficher le contenu sélectionné
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
        currentTab = tabName;
    }
    
    // Mettre à jour les liens actifs
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabName) {
            link.classList.add('active');
        }
    });
    
    // Scroll en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===============================================
// CORDES DE GUITARE INTERACTIVES
// ===============================================
function initGuitarStrings() {
    const strings = document.querySelectorAll('.string');
    
    strings.forEach((string, index) => {
        // Événement au survol
        string.addEventListener('mouseenter', () => {
            playStringSound(string);
            string.classList.add('vibrating');
            
            // Retirer l'animation après un délai
            setTimeout(() => {
                string.classList.remove('vibrating');
            }, 500);
        });
        
        // Événement au clic (pour mobile)
        string.addEventListener('click', () => {
            playStringSound(string);
            string.classList.add('vibrating');
            
            setTimeout(() => {
                string.classList.remove('vibrating');
            }, 500);
        });
    });
}

function playStringSound(string) {
    if (!audioContext) {
        initAudioContext();
    }
    
    // Obtenir la fréquence depuis l'attribut data
    const frequency = parseFloat(string.getAttribute('data-frequency'));
    
    // Créer un oscillateur pour générer le son
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configuration de l'oscillateur
    oscillator.type = 'sine'; // Type de forme d'onde
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Configuration du gain (volume)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    // Connexion des nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Jouer le son
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

// ===============================================
// CURSEUR PERSONNALISÉ
// ===============================================
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    // Ne pas afficher le curseur sur mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        return;
    }
    
    // Suivre la position de la souris
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Effet hover sur les éléments cliquables
    const hoverElements = document.querySelectorAll('a, button, .string, .nav-link, .project-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// ===============================================
// BOUTONS CTA (CALL TO ACTION)
// ===============================================
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('[data-navigate]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-navigate');
            switchTab(targetTab);
        });
    });
}

// ===============================================
// MENU MOBILE
// ===============================================
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// ===============================================
// ANIMATIONS AU SCROLL (optionnel)
// ===============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observer les cartes de projets
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        observer.observe(card);
    });
}

// ===============================================
// GESTION DU REDIMENSIONNEMENT
// ===============================================
window.addEventListener('resize', () => {
    const cursor = document.querySelector('.custom-cursor');
    
    // Cacher le curseur personnalisé sur mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
    } else {
        cursor.style.display = 'block';
    }
});

// ===============================================
// GESTION DES LIENS EXTERNES
// ===============================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Animation de feedback avant ouverture
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
    });
});

// ===============================================
// EASTER EGG : KONAMI CODE (optionnel)
// ===============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Effet visuel spécial
    const body = document.body;
    body.style.animation = 'rainbow 2s ease-in-out';
    
    // Créer l'animation rainbow dans le style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Jouer toutes les cordes en séquence
    const strings = document.querySelectorAll('.string');
    strings.forEach((string, index) => {
        setTimeout(() => {
            playStringSound(string);
            string.classList.add('vibrating');
            setTimeout(() => string.classList.remove('vibrating'), 500);
        }, index * 100);
    });
    
    // Retirer l'animation après
    setTimeout(() => {
        body.style.animation = '';
        style.remove();
    }, 2000);
    
    console.log('🎸 Easter Egg activé ! Rock on! 🤘');
}

// ===============================================
// AMÉLIORATION DES PERFORMANCES
// ===============================================
// Lazy loading des images (si on en ajoute plus tard)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback pour les navigateurs qui ne supportent pas le lazy loading natif
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===============================================
// PRÉCHARGEMENT DES RESSOURCES CRITIQUES
// ===============================================
function preloadResources() {
    // Ici on pourrait précharger des sons ou des images
    // Pour l'instant, l'AudioContext est initialisé à la demande
}

// ===============================================
// ACCESSIBILITÉ : NAVIGATION AU CLAVIER
// ===============================================
document.addEventListener('keydown', (e) => {
    // Navigation avec les flèches
    if (e.key === 'ArrowRight') {
        navigateToNextTab();
    } else if (e.key === 'ArrowLeft') {
        navigateToPreviousTab();
    }
});

function navigateToNextTab() {
    const tabs = ['accueil', 'projets', 'studio', 'contact'];
    const currentIndex = tabs.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    switchTab(tabs[nextIndex]);
}

function navigateToPreviousTab() {
    const tabs = ['accueil', 'projets', 'studio', 'contact'];
    const currentIndex = tabs.indexOf(currentTab);
    const previousIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    switchTab(tabs[previousIndex]);
}

// ===============================================
// MESSAGES DE CONSOLE STYLISÉS
// ===============================================
console.log('%c🎵 Frequency Lab', 'font-size: 24px; font-weight: bold; color: #00ff88; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);');
console.log('%cExploring sound, shaping frequencies', 'font-size: 14px; font-style: italic; color: #a0a0a0;');
console.log('%cSite développé avec ❤️ par Loïc', 'font-size: 12px; color: #e0e0e0;');
console.log('%cAstuces:', 'font-size: 14px; font-weight: bold; color: #00ff88;');
console.log('- Survolez les cordes de guitare sur la page d\'accueil');
console.log('- Utilisez les flèches ← → pour naviguer entre les onglets');
console.log('- Essayez le Konami Code pour un easter egg 😉');

// ===============================================
// EXPORT DES FONCTIONS (pour usage externe si besoin)
// ===============================================
window.FrequencyLab = {
    switchTab,
    playStringSound,
    initAudioContext
};
