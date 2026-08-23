function toggleDropdown() {
    document.getElementById('customDropdown')?.classList.toggle('open');
}

function selectPlatform(val, html, element) {
    if (element.classList.contains('disabled')) return;

    const select = document.getElementById('platformSelect');
    const display = document.getElementById('selectedDisplay');
    if (select) select.value = val;
    if (display) display.innerHTML = html;

    document.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    document.getElementById('customDropdown')?.classList.remove('open');
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('customDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

function handleFormSubmit(e) {
    e.preventDefault();

    const platform = document.getElementById('platformSelect')?.value;
    const name = document.getElementById('name')?.value.trim() || '';
    const contact = document.getElementById('contactInfo')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    if (platform === 'email') {
        const subject = encodeURIComponent(`Benchmark Inquiry from ${name}`);
        const body = encodeURIComponent(`Hello HF Plays,\n\nSender Name: ${name}\nContact / Email: ${contact}\n\nMessage:\n${message}`);
        window.location.href = `mailto:hilmipc06@gmail.com?subject=${subject}&body=${body}`;
    } else if (platform === 'whatsapp') {
        const waNumber = '6283874760794';
        const waText = `New message via HF Plays Website:%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Contact:* ${encodeURIComponent(contact)}%0A*Message:*%0A${encodeURIComponent(message)}`;
        window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const ecoToggle = document.querySelector('.eco-toggle');
    const root = document.documentElement;

    const updateModeControls = () => {
        const theme = root.getAttribute('data-theme') || 'dark';
        const isMobile = window.innerWidth <= 780 || window.matchMedia('(max-width: 780px)').matches || window.matchMedia('(pointer: coarse)').matches;
        const defaultView = isMobile ? 'lite' : 'normal';
        const view = root.getAttribute('data-view') || defaultView;

        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark'
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }

        if (ecoToggle) {
            ecoToggle.classList.toggle('is-active', view === 'lite');
            ecoToggle.innerHTML = view === 'lite'
                ? '<i class="fa-solid fa-bolt"></i>'
                : '<i class="fa-solid fa-feather-pointed"></i>';
            ecoToggle.setAttribute('aria-label', view === 'lite' ? 'Eco Mode active. Switch to rich mode' : 'Switch to Eco Mode');
        }
    };

    themeToggle?.addEventListener('click', () => {
        const nextTheme = (root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        root.setAttribute('data-bs-theme', nextTheme);
        localStorage.setItem('hfplays_theme', nextTheme);
        updateModeControls();
    });

    ecoToggle?.addEventListener('click', () => {
        const nextView = (root.getAttribute('data-view') || 'normal') === 'lite' ? 'normal' : 'lite';
        root.setAttribute('data-view', nextView);
        localStorage.setItem('hfplays_view', nextView);
        updateModeControls();
    });

    updateModeControls();

    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // 1. Scroll-Reveal Observer Ringan
    const revealElements = document.querySelectorAll('.glass-card, .section-title, .hero-section, .contact-form');
    revealElements.forEach(el => el.classList.add('reveal-init'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
        el.classList.add(`delay-${(index % 4) + 1}`);
        revealObserver.observe(el);
    });

    // 2. Active Nav Link Tracking
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveLink() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // 3. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#!')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        });
    });

    // 4. Privacy Policy Modal Handling
    const privacyModal = document.getElementById('privacyModal');
    const privacyPolicyBtn = document.getElementById('privacyPolicyBtn');
    const privacyModalClose = document.getElementById('privacyModalClose');

    function closePrivacyModal() {
        if (!privacyModal) return;
        privacyModal.classList.remove('show');
        setTimeout(() => {
            privacyModal.hidden = true;
        }, 220);
        document.body.classList.remove('privacy-modal-open');
    }

    if (privacyPolicyBtn && privacyModal && privacyModalClose) {
        privacyPolicyBtn.addEventListener('click', () => {
            privacyModal.hidden = false;
            document.body.classList.add('privacy-modal-open');
            requestAnimationFrame(() => privacyModal.classList.add('show'));
            privacyModalClose.focus();
        });

        privacyModalClose.addEventListener('click', closePrivacyModal);
        privacyModal.addEventListener('click', (event) => {
            if (event.target === privacyModal) closePrivacyModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !privacyModal.hidden) closePrivacyModal();
        });
    }
});

// 5. Cookie Consent Banner Handling
(function initCookieConsent() {
    const isAccepted = localStorage.getItem('hfplays_cookies_status') === 'accepted';
    const isDeclined = sessionStorage.getItem('hfplays_cookies_status') === 'declined';

    if (isAccepted || isDeclined) return;

    document.addEventListener('DOMContentLoaded', () => {
        const banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-icon">
                    <i class="fa-solid fa-cookie-bite"></i>
                </div>
                <div class="cookie-text">
                    <h4>Cookie & Data Policy</h4>
                    <p>We use essential cookies to ensure optimal performance and browsing experience.</p>
                </div>
            </div>
            <div class="cookie-actions">
                <button class="cookie-btn-decline" id="declineCookieBtn">Decline</button>
                <button class="cookie-btn-accept" id="acceptCookieBtn">Accept All</button>
            </div>
        `;

        document.body.appendChild(banner);

        setTimeout(() => {
            banner.classList.add('show');
        }, 400);

        function closeBanner() {
            banner.classList.remove('show');
            banner.remove();
        }

        document.getElementById('acceptCookieBtn')?.addEventListener('click', () => {
            localStorage.setItem('hfplays_cookies_status', 'accepted');
            closeBanner();
        });

        document.getElementById('declineCookieBtn')?.addEventListener('click', () => {
            sessionStorage.setItem('hfplays_cookies_status', 'declined');
            closeBanner();
        });
    });
})();