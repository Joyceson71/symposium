/* ===================== FLUID PARTICLE PHYSICS ENGINE ===================== */
// A high-performance 2D liquid swarm simulation using HTML5 Canvas

(function initFluidPhysics() {
    const canvas = document.getElementById("fluid-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let width, height;
    
    // Performance scaling
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 800 : 3000;
    
    // Physics Configuration
    const DRAG = 0.92;           // Friction/viscosity of the fluid
    const EASE = 0.05;           // Speed at which they track the target
    const MOUSE_FORCE = 0.15;    // Push force away from cursor when moving fast
    const BASE_RADIUS = isMobile ? 1.5 : 2;
    
    let particles = [];
    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resize);
    resize();

    // Track mouse and calculate velocity
    window.addEventListener("mousemove", (e) => {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.vx = mouse.x - lastMouse.x;
        mouse.vy = mouse.y - lastMouse.y;
    });
    
    // Smooth out mouse velocity decay
    setInterval(() => {
        mouse.vx *= 0.8;
        mouse.vy *= 0.8;
    }, 50);

    class Particle {
        constructor() {
            // Random start positions
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            
            // Current velocity
            this.vx = 0;
            this.vy = 0;
            
            // Random offset for organic swarm movement
            this.ox = (Math.random() - 0.5) * 400;
            this.oy = (Math.random() - 0.5) * 400;
            
            this.radius = BASE_RADIUS + Math.random() * 1.5;
        }

        update() {
            // Calculate target position (mouse + organic offset)
            let tx = mouse.x + this.ox;
            let ty = mouse.y + this.oy;
            
            // Distance to mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            // Core fluid logic: 
            // 1. Move toward the target organic spot around the mouse
            this.vx += (tx - this.x) * EASE;
            this.vy += (ty - this.y) * EASE;
            
            // 2. If close to the mouse, be influenced by the mouse's velocity (pushing effect)
            if (dist < 150) {
                // The faster the mouse moves, the harder it pushes particles
                this.vx += mouse.vx * MOUSE_FORCE * (1 - dist/150);
                this.vy += mouse.vy * MOUSE_FORCE * (1 - dist/150);
            }
            
            // 3. Apply fluid drag (viscosity)
            this.vx *= DRAG;
            this.vy *= DRAG;
            
            // 4. Update position
            this.x += this.vx;
            this.y += this.vy;
            
            // Screen wrap if they get pushed too far out
            if (this.x < -200) this.x = width + 200;
            if (this.x > width + 200) this.x = -200;
            if (this.y < -200) this.y = height + 200;
            if (this.y > height + 200) this.y = -200;
        }

        draw() {
            // Calculate speed to determine color (Blue to Red)
            let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            
            // Clamp speed for color mapping
            let normalizedSpeed = Math.min(speed / 15, 1); 
            
            // Colors: Classic Peter Parker 
            // Slow = Blue (25, 118, 210)
            // Fast = Red (211, 47, 47)
            let r = Math.floor(25 + (211 - 25) * normalizedSpeed);
            let g = Math.floor(118 + (47 - 118) * normalizedSpeed);
            let b = Math.floor(210 + (47 - 210) * normalizedSpeed);
            
            // Size expands slightly when moving fast
            let currentRadius = this.radius + (normalizedSpeed * 1.5);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
            ctx.fill();
        }
    }

    // Initialize Swarm
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Main render loop
    function animate() {
        // Clear with slight trailing effect (liquid smear)
        // Set composite operation back to source-over for trailing blur
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "rgba(10, 17, 40, 0.2)";
        ctx.fillRect(0, 0, width, height);

        // Add additive blending for bright glowing fluid effects
        ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }
    
    // Start simulation
    animate();
})();
