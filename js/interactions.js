/* ================================================================
   TECHNOKINGS 2K26 — INTERACTIONS.JS
   Cinematic interaction logic & comprehensive animation controllers
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Reading Progress Bar
    const progressBar = document.createElement("div");
    progressBar.className = "reading-progress";
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }, { passive: true });

    // 2. Advanced Scroll Reveals (Intersection Observer)
    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-flip, .reveal-clip");
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                if (entry.target.classList.contains('stat-num')) {
                    animateValue(entry.target, 0, parseInt(entry.target.getAttribute('data-count') || 0), 2000);
                }
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Counter Animation (Numbers rolling up)
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            let currentVal = Math.floor(easeProgress * (end - start) + start);
            
            let prefix = obj.getAttribute('data-prefix') || "";
            obj.innerHTML = prefix + currentVal.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.classList.add('counting');
            }
        };
        window.requestAnimationFrame(step);
    }

    // 4. Kinetic Typography (Split text into chars on hover)
    const kineticElements = document.querySelectorAll('.hero-t1, .hero-t3, .section-title');
    kineticElements.forEach(el => {
        if(el.children.length > 0) return; // already processed or contains HTML
        const text = el.innerText;
        el.innerHTML = '';
        [...text].forEach(char => {
            if(char === ' ') {
                el.appendChild(document.createTextNode(' '));
            } else {
                const span = document.createElement('span');
                span.className = 'kinetic-char';
                span.innerText = char;
                el.appendChild(span);
            }
        });
    });

    // 5. Magnetic Buttons
    const magnets = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .event-register-btn');
    magnets.forEach(magnet => {
        magnet.classList.add('magnetic');
        magnet.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Limit magnetic pull distance
            const pullX = x * 0.3;
            const pullY = y * 0.3;
            
            this.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.05)`;
        });
        
        magnet.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // 6. 3D Tilt Cards with Shine Effect
    const tiltCards = document.querySelectorAll('.stat-card, .tier-card, .event-card, .team-card');
    tiltCards.forEach(card => {
        card.classList.add('tilt-card');
        
        // Add shine element if not present
        if(!card.querySelector('.tilt-shine')) {
            const shine = document.createElement('div');
            shine.className = 'tilt-shine';
            card.appendChild(shine);
        }

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation (-10deg to +10deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Update shine position
            const shine = this.querySelector('.tilt-shine');
            if(shine) {
                const shineX = (x / rect.width) * 100;
                const shineY = (y / rect.height) * 100;
                shine.style.setProperty('--shine-x', `${shineX}%`);
                shine.style.setProperty('--shine-y', `${shineY}%`);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 7. Cursor Spotlight & Trails
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    let lastTrailTime = 0;
    
    document.addEventListener('mousemove', (e) => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';

        // Trail logic (throttle to avoid DOM overload)
        const now = Date.now();
        if (now - lastTrailTime > 40) {
            createTrailDot(e.clientX, e.clientY);
            lastTrailTime = now;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if(e.touches.length > 0) {
            const touch = e.touches[0];
            spotlight.style.left = touch.clientX + 'px';
            spotlight.style.top = touch.clientY + 'px';

            const now = Date.now();
            if (now - lastTrailTime > 40) {
                createTrailDot(touch.clientX, touch.clientY);
                lastTrailTime = now;
            }
        }
    }, {passive: true});

    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        
        // Random slight offset and color
        const colors = ['rgba(211,47,47,0.6)', 'rgba(25,118,210,0.6)', 'rgba(255,255,255,0.6)'];
        dot.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = 3 + Math.random() * 4;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';

        document.body.appendChild(dot);
        
        // Clean up
        setTimeout(() => {
            dot.remove();
        }, 700);
    }

    // 8. Ripple Effect on Buttons
    const rippleButtons = document.querySelectorAll('.btn-primary, .btn-ghost, .event-register-btn, .nav-cta');
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-wave';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            // Set size based on button dimensions
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.transform = `translate(-50%, -50%) scale(0)`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 700);
        });
    });

    // 9. Floating Ambient Orbs (Background Parallax)
    const orbsContainer = document.createElement('div');
    orbsContainer.style.position = 'fixed';
    orbsContainer.style.inset = '0';
    orbsContainer.style.zIndex = '-1';
    orbsContainer.style.pointerEvents = 'none';
    orbsContainer.style.overflow = 'hidden';
    document.body.appendChild(orbsContainer);

    for (let i = 0; i < 6; i++) {
        const orb = document.createElement('div');
        orb.className = 'ambient-orb';
        
        // Random props
        const size = 200 + Math.random() * 400;
        const colors = [
            'radial-gradient(circle, rgba(211,47,47,0.15) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(25,118,210,0.1) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
        ];
        
        orb.style.width = size + 'px';
        orb.style.height = size + 'px';
        orb.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        orb.style.left = (Math.random() * 100) + 'vw';
        orb.style.top = (Math.random() * 100) + 'vh';
        
        orb.style.setProperty('--orb-dur', (15 + Math.random() * 15) + 's');
        orb.style.setProperty('--orb-x1', (Math.random() * 100 - 50) + 'px');
        orb.style.setProperty('--orb-y1', (Math.random() * 100 - 50) + 'px');
        orb.style.setProperty('--orb-x2', (Math.random() * 100 - 50) + 'px');
        orb.style.setProperty('--orb-y2', (Math.random() * 100 - 50) + 'px');
        
        orbsContainer.appendChild(orb);
    }

    // 10. Mouse Move Parallax for Hero Elements
    const heroElements = document.querySelectorAll('.hero-t1, .hero-t2, .hero-t3, .hero-eyebrow, .hero-tagline');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        heroElements.forEach((el, index) => {
            const depth = (index + 1) * 5; 
            el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            el.style.transition = 'transform 0.1s linear';
        });
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const x = (touch.clientX / window.innerWidth - 0.5) * 2;
            const y = (touch.clientY / window.innerHeight - 0.5) * 2;
            
            heroElements.forEach((el, index) => {
                const depth = (index + 1) * 5; 
                el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
                el.style.transition = 'transform 0.1s linear';
            });
        }
    }, {passive: true});

    // 11. CSS Hero Particle Injector
    const hpField = document.createElement('div');
    hpField.className = 'hero-particle-field';
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.appendChild(hpField);
        for(let i=0; i<30; i++) {
            const p = document.createElement('div');
            p.className = 'hp';
            
            const size = 2 + Math.random() * 4;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.background = (Math.random() > 0.5) ? 'rgba(211,47,47,0.8)' : 'rgba(25,118,210,0.6)';
            p.style.boxShadow = `0 0 8px ${p.style.background}`;
            
            p.style.left = (Math.random() * 100) + '%';
            p.style.top = (60 + Math.random() * 40) + '%';
            
            p.style.setProperty('--dur', (5 + Math.random() * 10) + 's');
            p.style.setProperty('--delay', (Math.random() * 5) + 's');
            p.style.setProperty('--op', 0.4 + Math.random() * 0.6);
            
            hpField.appendChild(p);
        }
    }
});

// Toast Notification System
window.showToast = function(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    // Icon based on type
    let icon = 'ℹ️';
    if(type === 'success') icon = '✅';
    if(type === 'error') icon = '⚠️';
    
    toast.innerHTML = `<span style="margin-right:8px">${icon}</span> ${message}`;
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, duration);
};
