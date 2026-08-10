/**
 * ============================================================================
 * TECHNOKINGS 2K26 - SPIDER PHYSICS ENGINE (2.0.0)
 * Massive Custom Vanilla JS Rigid Body & Cloth Simulator
 * ============================================================================
 * Contains a custom verlet integration physics engine built from scratch.
 */

class Vector2 {
    constructor(x, y) { this.x = x; this.y = y; }
    add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vector2(this.x - v.x, this.y - v.y); }
    mult(n) { return new Vector2(this.x * n, this.y * n); }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() { let m = this.mag(); return m === 0 ? new Vector2(0,0) : new Vector2(this.x/m, this.y/m); }
    dist(v) { let dx = this.x - v.x; let dy = this.y - v.y; return Math.sqrt(dx*dx + dy*dy); }
}

class PointMass {
    constructor(x, y, mass = 1, pinned = false) {
        this.pos = new Vector2(x, y);
        this.oldPos = new Vector2(x, y);
        this.acc = new Vector2(0, 0);
        this.mass = mass;
        this.pinned = pinned;
    }

    update(dt) {
        if (this.pinned) return;
        const velocity = this.pos.sub(this.oldPos);
        velocity.x *= 0.99; // friction
        velocity.y *= 0.99;
        
        this.oldPos.x = this.pos.x;
        this.oldPos.y = this.pos.y;
        
        this.pos = this.pos.add(velocity).add(this.acc.mult(dt * dt));
        this.acc = new Vector2(0, 0); // reset acceleration
    }

    applyForce(force) {
        this.acc = this.acc.add(force.mult(1 / this.mass));
    }
}

class Link {
    constructor(p1, p2, restingDist, stiffness = 1) {
        this.p1 = p1;
        this.p2 = p2;
        this.restingDist = restingDist;
        this.stiffness = stiffness;
    }

    solve() {
        const diff = this.p1.pos.sub(this.p2.pos);
        const dist = diff.mag();
        if (dist === 0) return;

        const difference = (this.restingDist - dist) / dist;
        const offset = diff.mult(difference * 0.5 * this.stiffness);

        if (!this.p1.pinned) this.p1.pos = this.p1.pos.add(offset);
        if (!this.p2.pinned) this.p2.pos = this.p2.pos.sub(offset);
    }
}

class SpiderPhysicsEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'physics-layer';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none'; // click through
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gravity = new Vector2(0, 980); // Gravity constant
        
        this.webs = [];
        this.mousePos = new Vector2(this.width/2, this.height/2);
        this.isMouseDown = false;

        this.initEventListeners();
        this.loop();
    }

    initEventListeners() {
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        });

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        window.addEventListener('mousedown', (e) => {
            if(e.button === 0) { // Left click shoots web
                this.isMouseDown = true;
                this.shootWeb(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        // Context menu clear webs
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.webs = []; // Clear webs on right click
        });
    }

    shootWeb(targetX, targetY) {
        // Find nearest edge of window to shoot from (simulate wrists)
        const originX = targetX < this.width/2 ? 0 : this.width;
        const originY = this.height;
        
        const origin = new PointMass(originX, originY, 1, true);
        const points = [origin];
        const links = [];
        
        const segments = 15;
        const dist = new Vector2(targetX - originX, targetY - originY);
        const segmentLen = dist.mag() / segments;
        const dir = dist.normalize();

        for(let i=1; i<=segments; i++) {
            const pX = originX + dir.x * (segmentLen * i);
            const pY = originY + dir.y * (segmentLen * i);
            const isTarget = i === segments;
            const pm = new PointMass(pX, pY, 1, isTarget);
            points.push(pm);
            links.push(new Link(points[i-1], points[i], segmentLen, 0.8));
        }

        this.webs.push({
            points,
            links,
            targetNode: points[segments],
            createdAt: Date.now()
        });
        
        // Limit max webs
        if(this.webs.length > 5) this.webs.shift();
    }

    update(dt) {
        this.webs.forEach(web => {
            // If mouse down and web is fresh, pull the target node towards mouse
            if(this.isMouseDown && (Date.now() - web.createdAt < 2000)) {
                web.targetNode.pos.x += (this.mousePos.x - web.targetNode.pos.x) * 0.1;
                web.targetNode.pos.y += (this.mousePos.y - web.targetNode.pos.y) * 0.1;
            } else {
                web.targetNode.pinned = false; // release web
            }

            web.points.forEach(p => {
                p.applyForce(this.gravity);
                p.update(dt);
            });

            // Solve constraints multiple times for stability
            for(let i=0; i<5; i++) {
                web.links.forEach(link => link.solve());
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.webs.forEach(web => {
            this.ctx.beginPath();
            this.ctx.moveTo(web.points[0].pos.x, web.points[0].pos.y);
            
            web.points.forEach(p => {
                this.ctx.lineTo(p.pos.x, p.pos.y);
            });
            
            this.ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'white';
            this.ctx.stroke();
            
            // Draw connection node
            const target = web.targetNode;
            this.ctx.beginPath();
            this.ctx.arc(target.pos.x, target.pos.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#CC0000';
            this.ctx.fill();
        });
    }

    loop() {
        // Fixed time step 60fps
        this.update(1/60);
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Inject physics engine on load
window.addEventListener('load', () => {
    if (window.innerWidth > 768) {
        window.SymposiumPhysics = new SpiderPhysicsEngine();
    }
});
