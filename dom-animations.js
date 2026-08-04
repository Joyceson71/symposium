/**
 * ============================================================================
 * TECHNOKINGS 2K26 - ADVANCED DOM ANIMATION & PHYSICS ENGINE
 * Custom GSAP-style timeline, split-text, magnetic UI, and tilt physics.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("[DOM-Engine] Initializing DOM Physics and Animation Systems...");

    /* --- 1. TEXT SPLITTING ENGINE --- */
    // Targets all major headings and splits them into span.char for staggered reveals
    const textTargets = document.querySelectorAll("h1, h2, .section-title, .hero-t1, .hero-t2, .hero-t3, .hero-tagline");
    
    textTargets.forEach(el => {
        // Don't split if it has complex HTML children
        if (el.children.length > 0) return;
        
        const text = el.innerText;
        el.innerHTML = "";
        el.style.display = "inline-block";
        el.style.overflow = "hidden"; // For mask reveals

        text.split("").forEach(char => {
            const span = document.createElement("span");
            span.innerText = char === " " ? "\u00A0" : char;
            span.style.display = "inline-block";
            span.style.transform = "translateY(120%) rotate(15deg)"; // Initial hidden state
            span.style.opacity = "0";
            span.style.transition = "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease";
            span.classList.add("split-char");
            el.appendChild(span);
        });
    });

    /* --- 2. INTERSECTION OBSERVER (SCROLL TRIGGERS) --- */
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -10% 0px", // Trigger slightly before it comes into view
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Animate Split Text
                const chars = el.querySelectorAll(".split-char");
                if (chars.length > 0) {
                    chars.forEach((char, idx) => {
                        setTimeout(() => {
                            char.style.transform = "translateY(0) rotate(0deg)";
                            char.style.opacity = "1";
                        }, idx * 25); // Stagger
                    });
                }
                
                // Animate Cards / Containers
                if (el.classList.contains("event-card") || el.classList.contains("coordinator-card")) {
                    el.style.opacity = "0";
                    el.style.transform = "translateY(50px) scale(0.9)";
                    el.style.transition = "all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)";
                    
                    // Force reflow
                    void el.offsetWidth;
                    
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0) scale(1)";
                }

                observer.unobserve(el); // Play once
            }
        });
    }, observerOptions);

    // Observe targets
    textTargets.forEach(el => scrollObserver.observe(el));
    document.querySelectorAll(".event-card, .coordinator-card, .stat-card").forEach(el => scrollObserver.observe(el));


    /* --- 3. MAGNETIC BUTTONS (PHYSICS) --- */
    const magneticElements = document.querySelectorAll(".btn-primary, .btn-secondary, .nav-links a");
    
    magneticElements.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Magnetic pull (stronger in center)
            const strength = 0.3;
            btn.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`;
            
            // Box shadow reacts to light
            const shadowX = -x * 0.2;
            const shadowY = -y * 0.2;
            btn.style.boxShadow = `${shadowX}px ${shadowY}px 15px rgba(204, 0, 0, 0.5)`;
        });

        btn.addEventListener("mouseleave", () => {
            // Spring back
            btn.style.transform = "translate(0px, 0px) scale(1)";
            btn.style.boxShadow = ""; // Revert to CSS default
            btn.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease";
        });
        
        btn.addEventListener("mouseenter", () => {
            btn.style.transition = "transform 0.1s ease, box-shadow 0.1s ease"; // Quick snap to cursor
        });
    });


    /* --- 4. 3D TILT CARDS --- */
    const tiltCards = document.querySelectorAll(".event-card, .coordinator-card");
    
    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = "transform 0.1s ease-out";
            
            // Dynamic glare effect based on mouse position
            let glare = card.querySelector(".tilt-glare");
            if (!glare) {
                glare = document.createElement("div");
                glare.classList.add("tilt-glare");
                glare.style.position = "absolute";
                glare.style.top = "0";
                glare.style.left = "0";
                glare.style.width = "100%";
                glare.style.height = "100%";
                glare.style.pointerEvents = "none";
                glare.style.background = "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)";
                card.appendChild(glare);
            }
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(204,0,0,0.3) 0%, transparent 80%)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
            const glare = card.querySelector(".tilt-glare");
            if(glare) glare.style.opacity = "0";
        });
        
        card.addEventListener("mouseenter", () => {
            const glare = card.querySelector(".tilt-glare");
            if(glare) glare.style.opacity = "1";
        });
    });


    /* --- 5. SMOOTH SCROLL PARALLAX (Custom lerping) --- */
    let currentScroll = 0;
    let targetScroll = 0;
    
    window.addEventListener("scroll", () => {
        targetScroll = window.scrollY;
    });

    const parallaxElements = document.querySelectorAll(".parallax-bg, .hero-title, .web-bg");
    
    function updateParallax() {
        // Easing interpolation for butter-smooth scrolling
        currentScroll += (targetScroll - currentScroll) * 0.1;
        
        parallaxElements.forEach(el => {
            const speed = el.getAttribute("data-speed") || 0.3;
            // Move opposite to scroll
            const yPos = currentScroll * speed;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        requestAnimationFrame(updateParallax);
    }
    updateParallax();


    /* --- 6. INTERACTIVE CANVAS WEB-SHOOTER (Click Effect) --- */
    const webCanvas = document.createElement("canvas");
    webCanvas.id = "interactive-web-shooter";
    Object.assign(webCanvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "9999" // Highest priority visual effect
    });
    document.body.appendChild(webCanvas);

    const ctx = webCanvas.getContext("2d");
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    webCanvas.width = cw;
    webCanvas.height = ch;

    window.addEventListener("resize", () => {
        cw = webCanvas.width = window.innerWidth;
        ch = webCanvas.height = window.innerHeight;
    });

    const webStrands = [];

    class WebStrand {
        constructor(startX, startY) {
            this.startX = startX;
            this.startY = startY;
            // Target edges of screen
            this.targetX = (Math.random() > 0.5) ? (Math.random() > 0.5 ? 0 : cw) : Math.random() * cw;
            this.targetY = (this.targetX === 0 || this.targetX === cw) ? Math.random() * ch : (Math.random() > 0.5 ? 0 : ch);
            
            this.currentX = startX;
            this.currentY = startY;
            
            this.progress = 0;
            this.speed = 0.05 + Math.random() * 0.05; // Fast shoot
            this.life = 1.0;
        }

        update() {
            if (this.progress < 1.0) {
                this.progress += this.speed;
                // Easing out
                const easeOut = 1 - Math.pow(1 - this.progress, 3);
                this.currentX = this.startX + (this.targetX - this.startX) * easeOut;
                this.currentY = this.startY + (this.targetY - this.startY) * easeOut;
            } else {
                this.life -= 0.02; // Fade out slowly
            }
        }

        draw(ctx) {
            if (this.life <= 0) return;
            
            ctx.beginPath();
            ctx.moveTo(this.startX, this.startY);
            ctx.lineTo(this.currentX, this.currentY);
            
            // Primary web styling
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.8})`;
            ctx.lineWidth = 1.5 + (this.life * 1.5);
            ctx.stroke();

            // Web shadow / Red tint
            ctx.beginPath();
            ctx.moveTo(this.startX, this.startY);
            ctx.lineTo(this.currentX, this.currentY);
            ctx.strokeStyle = `rgba(204, 0, 0, ${this.life * 0.5})`;
            ctx.lineWidth = 3 + (this.life * 2);
            ctx.stroke();
        }
    }

    window.addEventListener("click", (e) => {
        // Shoot 3-5 webs on click
        const count = 3 + Math.floor(Math.random() * 3);
        for(let i = 0; i < count; i++) {
            webStrands.push(new WebStrand(e.clientX, e.clientY));
        }
    });

    function animateWebShooter() {
        ctx.clearRect(0, 0, cw, ch);
        
        for (let i = 0; i < webStrands.length; i++) {
            const strand = webStrands[i];
            strand.update();
            strand.draw(ctx);
            
            if (strand.life <= 0) {
                webStrands.splice(i, 1);
                i--;
            }
        }
        
        requestAnimationFrame(animateWebShooter);
    }
    animateWebShooter();

});
