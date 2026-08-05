// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// Utility: Text Splitter (Pure JS to avoid loading SplitText plugin)
function splitTextIntoSpans(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        // Prevent splitting twice
        if(el.classList.contains('splitted')) return;
        
        const text = el.innerText;
        el.innerHTML = '';
        
        // Split by words first, then by characters to preserve words
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            const chars = word.split('');
            chars.forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.style.display = 'inline-block';
                // preserve spaces properly or use margin
                charSpan.innerText = char;
                charSpan.className = 'char-span';
                wordSpan.appendChild(charSpan);
            });
            
            el.appendChild(wordSpan);
            
            if(wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                space.style.display = 'inline-block';
                el.appendChild(space);
            }
        });
        el.classList.add('splitted');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Loader Animation Override
    const loader = document.getElementById('loader');
    // If it's the index page (or has a loader)
    if (loader) {
        const tlLoader = gsap.timeline();
        tlLoader.to('#loader-fill', {
            width: '100%',
            duration: 1.5,
            ease: "power2.inOut"
        })
        .to(loader, {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                initHeroAnimations();
            }
        }, "+=0.2");
    } else {
        initHeroAnimations();
    }

    function initHeroAnimations() {
        splitTextIntoSpans('.hero-t1');
        
        const heroTl = gsap.timeline();
        
        // Animate hero text letters
        heroTl.from('.hero-t1 .char-span', {
            y: 50,
            opacity: 0,
            rotateX: -90,
            stagger: 0.05,
            duration: 0.8,
            ease: "back.out(1.7)"
        })
        .from('.hero-eyebrow, .hero-tagline', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.5")
        .from('.hero-btns .btn-primary, .hero-btns .btn-ghost', {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.4");
    }

    // 2. ScrollTrigger for Sections
    // Split text for section titles
    splitTextIntoSpans('.section-title');

    // Title reveal
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title.querySelectorAll('.char-span'), {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            stagger: 0.02,
            duration: 0.6,
            ease: "power3.out"
        });
    });

    // Reveal Left / Right
    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Stagger Cards (Stats, Why)
    gsap.utils.toArray('.stats-row, .why-grid').forEach(grid => {
        const cards = grid.children;
        gsap.from(cards, {
            scrollTrigger: {
                trigger: grid,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "back.out(1.2)"
        });
    });

    // 3. Velocity Skew Effect using GSAP
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".event-card, .stat-card, .why-card, .team-card", "skewY", "deg"),
        clamp = gsap.utils.clamp(-10, 10);
    
    // Only apply on desktop to avoid weird mobile jank
    if (window.innerWidth > 768) {
        window.addEventListener("scroll", () => {
            const velocity = window.scrollY - (window.lastScrollY || window.scrollY);
            window.lastScrollY = window.scrollY;
            
            let skew = clamp(velocity * -0.05);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, {
                    skew: 0, 
                    duration: 0.8, 
                    ease: "power3", 
                    overwrite: true, 
                    onUpdate: () => skewSetter(proxy.skew)
                });
            }
        });
    }
});
