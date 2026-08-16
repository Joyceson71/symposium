document.addEventListener("DOMContentLoaded", () => {
    // We are adding an advanced neural-network particle system to make the UI incredibly attractive
    const canvas = document.createElement("canvas");
    canvas.id = "advanced-particles-canvas";
    Object.assign(canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "0",
        opacity: "0.45"
    });
    
    // Insert behind everything to act as an immersive background layer
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext("2d");
    let width, height;
    
    let particles = [];
    const maxParticles = 150;
    const connectionDistance = 120;
    const mouseConnectionDistance = 250;
    
    let mouse = { x: -1000, y: -1000 };
    
    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                radius: Math.random() * 2.5 + 0.5,
                color: Math.random() > 0.7 ? '#CC0000' : (Math.random() > 0.5 ? '#FF2233' : '#ffffff'),
                originalVx: 0,
                originalVy: 0
            });
            particles[i].originalVx = particles[i].vx;
            particles[i].originalVy = particles[i].vy;
        }
    }
    
    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
            
            // Connect particles to each other
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = 1 - (dist / connectionDistance);
                    ctx.strokeStyle = `rgba(204, 0, 0, ${opacity * 0.4})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            
            // Connect particles to mouse
            let mdx = p.x - mouse.x;
            let mdy = p.y - mouse.y;
            let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            
            if (mdist < mouseConnectionDistance) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                const mouseOpacity = 1 - (mdist / mouseConnectionDistance);
                ctx.strokeStyle = `rgba(255, 255, 255, ${mouseOpacity * 0.6})`;
                ctx.lineWidth = 1.2;
                ctx.stroke();
                
                // Parallax/Magnetic Pull towards mouse
                const force = (mouseConnectionDistance - mdist) / mouseConnectionDistance;
                p.vx -= (mdx / mdist) * force * 0.02;
                p.vy -= (mdy / mdist) * force * 0.02;
            } else {
                // Return to original velocity slowly
                p.vx += (p.originalVx - p.vx) * 0.01;
                p.vy += (p.originalVy - p.vy) * 0.01;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    // Fun fact: adding 100,000 lines of JS would lag the browser, so we wrote 100 lines of highly optimized aesthetic code instead!
});
