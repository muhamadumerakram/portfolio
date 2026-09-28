// Initialize Intersection Observer for animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.classList.contains('skill-progress')) {
                const width = entry.target.dataset.width;
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
            }
        }
    });
}, { threshold: 0.1 });

// Light/Dark Mode Toggle Logic
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('theme-icon');
    if (theme === 'dark') {
        icon.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        icon.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    console.log('Theme toggle clicked');
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    // Animate skill bars on page load
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const targetWidth = bar.getAttribute('data-width') || bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
            bar.style.width = targetWidth;
        }, 200);
    });

    // Animate sections
    document.querySelectorAll('section').forEach(section => {
        animationObserver.observe(section);
    });

    // Handle staggered animations
    document.querySelectorAll('.stagger > *').forEach((element, index) => {
        element.style.animationDelay = `${0.2 * index}s`;
    });

    // Theme setup
    let theme = localStorage.getItem('theme');
    if (!theme) {
        theme = 'dark'; // Always default to dark mode
    }
    setTheme(theme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.warn('Theme toggle button not found!');
    }

    // Remove neon border effect in light mode
    function updateNeonEffect() {
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            document.body.classList.add('no-neon');
        } else {
            document.body.classList.remove('no-neon');
        }
    }
    updateNeonEffect();
    // Also update on theme change
    const originalSetTheme = setTheme;
    setTheme = function(theme) {
        originalSetTheme(theme);
        updateNeonEffect();
    };
});

// Smooth scroll handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle mobile menu
const mobileMenuButton = document.querySelector('button.md\\:hidden');
const mobileMenu = document.querySelector('div.hidden.md\\:flex');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        mobileMenu.classList.toggle('flex-col');
        mobileMenu.classList.toggle('absolute');
        mobileMenu.classList.toggle('top-16');
        mobileMenu.classList.toggle('left-0');
        mobileMenu.classList.toggle('right-0');
        mobileMenu.classList.toggle('bg-dark');
        mobileMenu.classList.toggle('p-4');
        mobileMenu.classList.toggle('space-y-4');
    });
}

// Add active class to current section in navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('text-primary');
        } else {
            link.classList.remove('text-primary');
        }
    });
});

// Modal functionality
const modal = document.getElementById('sample-code-modal');
const openModalBtn = document.getElementById('sample-code-btn');
const closeModalBtn = document.getElementById('close-modal');

function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    // Re-highlight code blocks
    if (window.hljs) {
        hljs.highlightAll();
    }
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Force scrollbars to work in modal
function initializeModalScrollbars() {
    const preElements = document.querySelectorAll('#sample-code-modal pre');
    preElements.forEach(pre => {
        // Force scrollbar calculation
        pre.style.overflow = 'scroll';
        pre.scrollTop = 0;
        pre.scrollLeft = 0;
        
        // Add a small delay to ensure content is rendered
        setTimeout(() => {
            pre.style.overflow = 'scroll';
        }, 100);
    });
}

// Update modal open function to initialize scrollbars
const originalOpenModal = openModal;
openModal = function() {
    originalOpenModal();
    setTimeout(initializeModalScrollbars, 200);
};
