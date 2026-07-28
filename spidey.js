
/* ===================== SPIDER-MAN: WEB-SLINGER ENGINE ===================== */
// Inject the Web Canvas
const webCanvas = document.createElement("canvas");
webCanvas.id = "web-slinger-canvas";
webCanvas.style.position = "fixed";
webCanvas.style.top = "0";
webCanvas.style.left = "0";
webCanvas.style.width = "100vw";
webCanvas.style.height = "100vh";
webCanvas.style.pointerEvents = "none";
webCanvas.style.zIndex = "9000"; // Below modals, above some backgrounds
document.body.appendChild(webCanvas);

const wctx = webCanvas.getContext("2d");
let cw, ch;
function resizeWebCanvas() {
    cw = webCanvas.width = window.innerWidth;
    ch = webCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeWebCanvas);
resizeWebCanvas();

// Web physics nodes
const numNodes = 5;
const nodes = [];
const targetMouse = { x: cw / 2, y: ch / 2 };
const currentMouse = { x: cw / 2, y: ch / 2 };

// Anchor points (Corners + Edges)
const anchors = [];

function initAnchors() {
    anchors.length = 0;
    anchors.push({ x: 0, y: 0 }); // Top Left
    anchors.push({ x: cw, y: 0 }); // Top Right
    anchors.push({ x: 0, y: ch }); // Bottom Left
    anchors.push({ x: cw, y: ch }); // Bottom Right
    anchors.push({ x: cw / 2, y: 0 }); // Top Center
}
initAnchors();
window.addEventListener("resize", initAnchors);

document.addEventListener("mousemove", (e) => {
    targetMouse.x = e.clientX;
    targetMouse.y = e.clientY;
});

class WebNode {
    constructor(anchorX, anchorY) {
        this.anchor = { x: anchorX, y: anchorY };
        this.pos = { x: anchorX, y: anchorY };
        this.vel = { x: 0, y: 0 };
        this.attached = false;
        this.restLength = Math.random() * 200 + 100;
        this.stiffness = 0.05 + Math.random() * 0.05;
        this.damping = 0.8;
    }
    update(mx, my) {
        let tx = this.anchor.x;
        let ty = this.anchor.y;
        
        // If mouse is somewhat close, attach to it
        const dx = mx - this.anchor.x;
        const dy = my - this.anchor.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 600) {
            this.attached = true;
            // Point on the line between anchor and mouse
            tx = this.anchor.x + dx * 0.8;
            ty = this.anchor.y + dy * 0.8;
        } else {
            this.attached = false;
        }
        
        const forceX = (tx - this.pos.x) * this.stiffness;
        const forceY = (ty - this.pos.y) * this.stiffness;
        
        this.vel.x = (this.vel.x + forceX) * this.damping;
        this.vel.y = (this.vel.y + forceY) * this.damping;
        
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
    draw(ctx, mx, my) {
        if (!this.attached) return; // Only draw when active
        
        ctx.beginPath();
        ctx.moveTo(this.anchor.x, this.anchor.y);
        // Draw chaotic web strands
        ctx.quadraticCurveTo(this.pos.x, this.pos.y, mx, my);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Minor connecting threads
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(mx + (Math.random() - 0.5) * 50, my + (Math.random() - 0.5) * 50);
        ctx.strokeStyle = "rgba(255, 0, 60, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

let webNodes = [];
function resetWebNodes() {
    webNodes = anchors.map(a => new WebNode(a.x, a.y));
}
resetWebNodes();
window.addEventListener("resize", resetWebNodes);

function animateWebs() {
    wctx.clearRect(0, 0, cw, ch);
    
    // Smooth mouse follow
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.15;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.15;
    
    webNodes.forEach(node => {
        node.update(currentMouse.x, currentMouse.y);
        node.draw(wctx, currentMouse.x, currentMouse.y);
    });
    
    requestAnimationFrame(animateWebs);
}
animateWebs();

/* ===================== SPIDEY-SENSE INTERACTION ===================== */
// Inject vignette
const spideySense = document.createElement("div");
spideySense.id = "spidey-sense-vignette";
document.body.appendChild(spideySense);

// Triggers
const senseTriggers = document.querySelectorAll("button, a, .event-card, .spider-node, .stat-card");
senseTriggers.forEach(el => {
    el.addEventListener("mouseenter", () => {
        document.body.classList.add("spidey-sense-active");
    });
    el.addEventListener("mouseleave", () => {
        document.body.classList.remove("spidey-sense-active");
    });
});
