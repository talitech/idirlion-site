document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animation on Scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats Counter Animation
    const counters = document.querySelectorAll('.count-up');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(counter); // Run once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 3D Tilt Effect for Glass Panels & Holo Cards
    const panels = document.querySelectorAll('.glass-panel, .bento-item, .holo-card');

    panels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position
            // Increased sensitivity for holo-cards
            const xRotation = ((y - rect.height / 2) / rect.height) * 8;
            const yRotation = ((x - rect.width / 2) / rect.width) * -8;

            // Apply transform with a spotlight/glare effect simulation via brightness
            panel.style.transform = `perspective(1000px) scale(1.02) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });

        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
        });
    });

    // --- Typewriter Effect ---
    const typewriterText = document.getElementById('typewriter-text');
    if (typewriterText) {
        const phrases = [
            'Smart Infrastructure.',
            'Secure Connectivity.',
            'Sustainable Power.'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 80; // ms per character when typing
        const deletingSpeed = 50; // ms per character when deleting
        const pauseEnd = 2000; // pause after typing complete
        const pauseStart = 500; // pause before deleting

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                // Deleting characters
                typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(typeEffect, pauseStart);
                    return;
                }
            } else {
                // Typing characters
                typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, pauseEnd);
                    return;
                }
            }

            setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
        }

        // Start the typewriter effect
        typeEffect();
    }

    // ========================================
    // PAGE LOADING ANIMATION
    // ========================================
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageLoader.classList.add('hidden');
            }, 300);
        });
    }

    // ========================================
    // COOKIE CONSENT BANNER
    // ========================================
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    // Check if user has already made a choice
    if (cookieConsent && !localStorage.getItem('cookieConsent')) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 1500);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.classList.remove('show');
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.classList.remove('show');
        });
    }
});
