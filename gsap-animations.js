// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// Utility: Text Splitter (Pure JS to avoid loading SplitText plugin)
function splitTextIntoSpans(selector) {
    const elements = document.querySelectorAll(selector);
    
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text.trim()) return node.cloneNode();
            
            const fragment = document.createDocumentFragment();
            const words = text.split(/(\s+)/); 
            
            words.forEach(word => {
                if (/^\s+$/.test(word)) {
                    const space = document.createElement('span');
                    space.style.display = 'inline-block';
                    space.style.whiteSpace = 'pre';
                    space.innerText = word;
                    fragment.appendChild(space);
                } else if (word.length > 0) {
                    const wordSpan = document.createElement('span');
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.whiteSpace = 'nowrap';
                    
                    const chars = [...word];
                    chars.forEach(char => {
                        const charSpan = document.createElement('span');
                        charSpan.style.display = 'inline-block';
                        charSpan.innerText = char;
                        charSpan.className = 'char-span';
                        wordSpan.appendChild(charSpan);
                    });
                    fragment.appendChild(wordSpan);
                }
            });
            return fragment;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName === 'BR') {
                return node.cloneNode();
            }
            const clone = node.cloneNode(false);
            Array.from(node.childNodes).forEach(child => {
                clone.appendChild(processNode(child));
            });
            return clone;
        }
        return node.cloneNode();
    }

    elements.forEach(el => {
        if(el.classList.contains('splitted')) return;
        
        const newContent = document.createDocumentFragment();
        Array.from(el.childNodes).forEach(child => {
            newContent.appendChild(processNode(child));
        });
        
        el.innerHTML = '';
        el.appendChild(newContent);
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

    // Stagger Cards (Stats, Why)
    gsap.utils.toArray('.stats-row, .why-grid').forEach(grid => {
        const cards = grid.children;
        gsap.fromTo(cards, 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: "back.out(1.2)"
            }
        );
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
        }, { passive: true });
    }
});
