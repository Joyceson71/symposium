
// SPIDER-VERSE MEGA UI - MILES MORALES UPGRADES
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Vanilla Tilt for Comic Book 3D Cards
    const tiltScript = document.createElement("script");
    tiltScript.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js";
    tiltScript.onload = () => {
        VanillaTilt.init(document.querySelectorAll(".event-card, .stat-card, .register-wrap, .skewed-container"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            scale: 1.05
        });
    };
    document.head.appendChild(tiltScript);

    // 2. Spidey-Sense Radar Trail
    let lastX = 0;
    let lastY = 0;
    document.addEventListener("mousemove", (e) => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Only spawn trail if moving fast enough
        if (dist > 10) {
            const dot = document.createElement("div");
            dot.className = "spidey-sense-trail";
            dot.style.left = e.clientX + "px";
            dot.style.top = e.clientY + "px";
            // Alternate colors between miles red and miles cyan
            dot.style.color = Math.random() > 0.5 ? "#ff1a1a" : "#00ffff";
            document.body.appendChild(dot);
            
            setTimeout(() => {
                dot.remove();
            }, 1000);
            
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    // 3. Scroll Velocity Chromatic Aberration
    let scrollTimeout;
    const glitchElements = document.querySelectorAll("h1, h2, .multiverse-glitch-text, .ultra-shadow-text");
    window.addEventListener("scroll", () => {
        glitchElements.forEach(el => el.classList.add("scroll-glitch-active"));
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            glitchElements.forEach(el => el.classList.remove("scroll-glitch-active"));
        }, 150);
    });

    // 4. Web-Sling Page Transition Overlay
    const overlay = document.createElement("div");
    overlay.id = "web-transition-overlay";
    overlay.innerHTML = '<div class="transition-spider-logo"></div>';
    document.body.appendChild(overlay);

    // Intercept links
    document.querySelectorAll("a").forEach(link => {
        if (link.href && link.href.includes(".html") && !link.target) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                overlay.classList.add("active");
                setTimeout(() => {
                    window.location.href = link.href;
                }, 600);
            });
        }
    });

    // Slide out overlay on page load
    setTimeout(() => {
        overlay.classList.remove("active");
    }, 100);
    
    // 5. Add random graffiti splatters
    const sections = document.querySelectorAll("section");
    sections.forEach(sec => {
        if(Math.random() > 0.3) {
            const splatter = document.createElement("div");
            splatter.className = "graffiti-splatter";
            splatter.style.left = (Math.random() * 80) + "%";
            splatter.style.top = (Math.random() * 80) + "%";
            // Randomize color between red and cyan
            if(Math.random() > 0.5) {
                splatter.style.background = "radial-gradient(circle, #0ff 0%, transparent 60%)";
            }
            sec.appendChild(splatter);
        }
    });
});
