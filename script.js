/* ===================== CURSOR ===================== */
const cur = document.getElementById("cursor"),
    ring = document.getElementById("cursor-ring");
let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + "px";
    cur.style.top = my + "px";
});
(function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animRing);
})();
document
    .querySelectorAll(
        "a,button,.event-card,.stat-card,.nontech-card,.tier-card,.team-label-box,.upload-zone",
    )
    .forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cur.style.width = "40px";
            cur.style.height = "40px";
            ring.style.opacity = "0";
        });
        el.addEventListener("mouseleave", () => {
            cur.style.width = "10px";
            cur.style.height = "10px";
            ring.style.opacity = "1";
        });
    });

/* ===================== LOADER ===================== */
function hideLoader() {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        if(loader) {
            loader.style.opacity = "0";
            setTimeout(() => (loader.style.display = "none"), 800);
        }
    }, 2800);
}

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", hideLoader);
} else {
    hideLoader();
}

/* ===================== NAVBAR ===================== */
window.addEventListener("scroll", () => {
    document
        .getElementById("navbar")
        .classList.toggle("scrolled", window.scrollY > 80);
});
function scrollToReg() {
    window.location.href = "register.html";
}
function toggleMenu() {
    const m = document.getElementById("mobile-menu");
    m.classList.toggle("open");
}

/* ===================== ADVANCED 3D CYBER-CITY BACKGROUND ===================== */
(function initBackgroundCity() {
    const canvas = document.getElementById("bg-canvas");
    if(!canvas) return;
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const scene = new THREE.Scene();
    
    // Deep fog for the endless city effect (Dark Purple/Blue for Spidey vibe)
    scene.fog = new THREE.FogExp2(0x0a0514, 0.015);
    
    const cam = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        300,
    );
    
    const isMobile = window.innerWidth < 768;
    
    // Camera starts based on device
    if (isMobile) {
        cam.position.set(0, 40, 30); // Wall-crawling perspective
    } else {
        cam.position.set(0, 0, 9); // Street level
    }

    /* LIGHTS */
    scene.add(new THREE.AmbientLight(0x0a0514, 2.5));
    const dirLight = new THREE.DirectionalLight(0x1976d2, 2.0);
    dirLight.position.set(-10, 20, 10);
    scene.add(dirLight);
    
    const spot1 = new THREE.SpotLight(0x4488ff, 100, 50, 0.5, 1);
    spot1.position.set(5, 8, 5);
    scene.add(spot1);
    
    const spot2 = new THREE.SpotLight(0xd32f2f, 100, 40);
    spot2.position.set(-5, -4, 3);
    scene.add(spot2);

    /* QUANTUM ENERGY CORE (Replaced Spider) */
    const spiderEmblem = new THREE.Group(); 
    
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 2.0, wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    spiderEmblem.add(coreMesh);
    
    const isoGeo = new THREE.IcosahedronGeometry(2.5, 0);
    const isoMat = new THREE.MeshStandardMaterial({
        color: 0xff0055, emissive: 0xaa0022, emissiveIntensity: 1.0, wireframe: true
    });
    const isoMesh = new THREE.Mesh(isoGeo, isoMat);
    spiderEmblem.add(isoMesh);

    spiderEmblem.userData.rings = [];
    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(3.5 + i*0.5, 0.05, 16, 100);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, wireframe: false
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.random() * Math.PI;
        ringMesh.rotation.y = Math.random() * Math.PI;
        spiderEmblem.userData.rings.push(ringMesh);
        spiderEmblem.add(ringMesh);
    }
    
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.1, color: 0xffffff, transparent: true, opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    spiderEmblem.add(particlesMesh);

    // Scale Emblem massive for Desktop Hero, hide for mobile
    spiderEmblem.scale.setScalar(isMobile ? 0.01 : 1.2);
    scene.add(spiderEmblem);

    /* CYBER CITY (INSTANCED MESH) */
    const buildingCount = isMobile ? 600 : 2000;
    
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    buildingGeo.translate(0, 0.5, 0); // Ground alignment
    
    const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x050a1f,
        roughness: 0.6,
        metalness: 0.5,
    });
    
    const city = new THREE.InstancedMesh(buildingGeo, buildingMat, buildingCount);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    const buildingPositions = []; // To attach spiders later
    
    for (let i = 0; i < buildingCount; i++) {
        let x = (Math.random() - 0.5) * 160;
        if (x > -10 && x < 10) x = x > 0 ? x + 10 : x - 10;
        
        const z = (Math.random() * -200) + 10;
        const distance = Math.abs(x);
        const heightBase = 5 + (distance * 0.8);
        const height = heightBase + Math.random() * 35;
        
        const w = 2 + Math.random() * 4;
        const d = 2 + Math.random() * 4;
        
        dummy.position.set(x, -10, z);
        dummy.scale.set(w, height, d);
        dummy.rotation.y = (Math.random() > 0.5) ? 0 : Math.PI / 4;
        dummy.updateMatrix();
        
        city.setMatrixAt(i, dummy.matrix);
        buildingPositions.push({x, y: -10 + height, z, w, d});
        
        const shade = 0.4 + Math.random() * 0.6;
        if (Math.random() > 0.5) {
            color.setRGB(0.05 * shade, 0.2 * shade, 0.5 * shade);
        } else {
            color.setRGB(0.6 * shade, 0.05 * shade, 0.1 * shade);
        }
        city.setColorAt(i, color);
    }
    scene.add(city);
    
    /* PROCEDURAL SPIDERS CRAWLING ON BUILDINGS */
    const swarmGroup = new THREE.Group();
    function createMiniSpider() {
        const mini = new THREE.Group();
        const abd = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), bodyMat);
        abd.position.y = -0.2;
        mini.add(abd);
        const hd = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), bodyMat);
        hd.position.set(0, 0.3, 0);
        mini.add(hd);
        const ce = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), glowMat);
        ce.position.set(0, -0.1, 0.3);
        mini.add(ce);
        for(let i=0; i<8; i++) {
            const side = i % 2 === 0 ? 1 : -1;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 1.2), bodyMat);
            leg.position.set(side * 0.3, -0.2, (i/2 - 2)*0.2);
            leg.rotation.z = side * Math.PI/3;
            leg.rotation.x = (Math.random() - 0.5) * 0.5;
            mini.add(leg);
        }
        return mini;
    }
    
    const swarmCount = isMobile ? 15 : 50;
    const swarmSpiders = [];
    for(let i=0; i<swarmCount; i++) {
        const sp = createMiniSpider();
        const b = buildingPositions[Math.floor(Math.random() * buildingPositions.length)];
        // Place on roof or side
        sp.position.set(b.x, b.y, b.z);
        sp.rotation.y = Math.random() * Math.PI * 2;
        sp.scale.setScalar(0.8 + Math.random() * 1.5);
        // speed and offset
        swarmSpiders.push({mesh: sp, speed: 0.02 + Math.random()*0.05, offset: Math.random()*100, b: b});
        swarmGroup.add(sp);
    }
    scene.add(swarmGroup);
    
    // Ground plane with grid (Red and Blue)
    const gridHelper = new THREE.GridHelper(300, 60, 0xd32f2f, 0x1976d2);
    gridHelper.position.y = -9.9;
    scene.add(gridHelper);

    /* PARTICLES */
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array((isMobile ? 800 : 3000) * 3);
    for (let i = 0; i < pos.length; i += 3) {
        pos[i] = (Math.random() - 0.5) * 150;
        pos[i + 1] = -10 + Math.random() * 80;
        pos[i + 2] = (Math.random() - 0.5) * 250;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0x4488ff,
        size: 0.15,
        transparent: true,
        opacity: 0.6,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ===================== NEW PROCEDURAL MODELS ===================== */
    // 1. Cybernetic Brain
    const cyberBrain = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({color: 0xff1744, emissive: 0xff0000, emissiveIntensity: 1.5, wireframe: true});
    const nodes = [];
    for(let i=0; i<25; i++) {
        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        mesh.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*12, (Math.random()-0.5)*12);
        cyberBrain.add(mesh);
        nodes.push(mesh.position);
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const linesGroup = new THREE.LineSegments(lineGeo, lineMat);
    cyberBrain.add(linesGroup);
    cyberBrain.position.set(0, -500, 0); // Hide initially
    scene.add(cyberBrain);

    // 2. Dimensional Portal
    const dimPortalGeo = new THREE.TorusKnotGeometry(4, 1.5, 128, 32);
    const dimPortalMat = new THREE.MeshStandardMaterial({color: 0x2979ff, emissive: 0xff00ff, emissiveIntensity: 1.2, wireframe: true});
    const dimPortal = new THREE.Mesh(dimPortalGeo, dimPortalMat);
    dimPortal.position.set(0, -500, 0);
    scene.add(dimPortal);

    // 3. Holographic DNA
    const dnaGroup = new THREE.Group();
    const dnaMat = new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0});
    for(let i=0; i<30; i++) {
        const y = (i - 15) * 0.5;
        const angle = i * 0.4;
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.3), dnaMat);
        s1.position.set(Math.cos(angle)*2, y, Math.sin(angle)*2);
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.3), dnaMat);
        s2.position.set(-Math.cos(angle)*2, y, -Math.sin(angle)*2);
        const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
        const rod = new THREE.Mesh(rodGeo, new THREE.MeshBasicMaterial({color: 0x2979ff, transparent:true, opacity:0.5}));
        rod.position.set(0, y, 0);
        rod.rotation.x = Math.PI/2;
        rod.rotation.z = angle;
        dnaGroup.add(s1, s2, rod);
    }
    dnaGroup.position.set(0, -500, 0);
    scene.add(dnaGroup);

    /* MOUSE & SCROLL INTERACTIONS */
    let mouseX = 0, mouseY = 0;
    let targetCamZ = isMobile ? 30 : 9;
    let targetCamY = isMobile ? 40 : 0;
    let targetCamX = 0;
    let globalScrollPercent = 0;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollTop / (scrollHeight || 1);
        globalScrollPercent = scrollPercent;
        
        if (isMobile) {
            targetCamY = 40 - (scrollPercent * 60);
            targetCamZ = 30 - (scrollPercent * 15);
        } else {
            targetCamZ = 9 - (scrollPercent * 159);
        }
        
        // --- CINEMATIC SCROLL ANIMATIONS ---
        if (spiderEmblem) {
            spiderEmblem.position.y = scrollPercent * 20; 
            spiderEmblem.scale.setScalar((isMobile ? 0.01 : 1.2) * Math.max(0, 1 - scrollPercent*2));
        }

        if (scrollPercent > 0.1 && scrollPercent < 0.4) {
            const localP = (scrollPercent - 0.1) / 0.3;
            cyberBrain.position.set(0, 0, targetCamZ - 15);
            cyberBrain.scale.setScalar(localP * 2);
            cyberBrain.rotation.y = localP * Math.PI * 2;
        } else {
            cyberBrain.position.set(0, -500, 0);
        }

        if (scrollPercent > 0.4 && scrollPercent < 0.7) {
            const localP = (scrollPercent - 0.4) / 0.3;
            dimPortal.position.set(0, 0, targetCamZ - 20);
            dimPortal.scale.setScalar(localP * 1.5);
            dimPortal.rotation.z = localP * Math.PI * 4;
        } else {
            dimPortal.position.set(0, -500, 0);
        }

        if (scrollPercent > 0.7) {
            const localP = (scrollPercent - 0.7) / 0.3;
            dnaGroup.position.set(5, -5, targetCamZ - 10);
            dnaGroup.scale.setScalar(localP * 3);
            dnaGroup.rotation.y = localP * Math.PI * 4;
        } else {
            dnaGroup.position.set(0, -500, 0);
        }
    });

    /* MULTIVERSE PORTALS */
    const portals = [];
    const portalGeo = new THREE.TorusGeometry(1.5, 0.3, 16, 50);
    const portalMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.8 });
    
    for(let i=0; i<3; i++) {
        const portal = new THREE.Mesh(portalGeo, portalMat);
        portal.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 20,
            -20 - Math.random() * 80
        );
        portal.rotation.y = Math.random() * Math.PI;
        scene.add(portal);
        portals.push(portal);
    }
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, cam);
        const intersects = raycaster.intersectObjects(portals);
        if(intersects.length > 0) {
            if(typeof showEasterEgg === 'function') showEasterEgg();
        }
    });

    // Audio Visualizer sync
    let beatPulse = 0;
    window.addEventListener('beat-bump', () => {
        beatPulse = 1.0;
    });

    /* RESIZE */
    window.addEventListener("resize", () => {
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ANIMATION */
    const clock = new THREE.Clock();
    (function anim() {
        requestAnimationFrame(anim);
        const t = clock.getElapsedTime();
        
        spiderEmblem.position.y = Math.sin(t * 1.5) * 0.2;
        const targetRotX = mouseY * 0.3;
        const targetRotY = mouseX * 0.5 + Math.sin(t * 0.5) * 0.1;
        spiderEmblem.rotation.x += (targetRotX - spiderEmblem.rotation.x) * 0.1;
        spiderEmblem.rotation.y += (targetRotY - spiderEmblem.rotation.y) * 0.1;
        spiderEmblem.rotation.z += (mouseX * 0.1 - spiderEmblem.rotation.z) * 0.1;
        
        if (spiderEmblem.userData.rings) {
            spiderEmblem.userData.rings[0].rotation.x += 0.01;
            spiderEmblem.userData.rings[0].rotation.y += 0.015;
            spiderEmblem.userData.rings[1].rotation.x -= 0.012;
            spiderEmblem.userData.rings[1].rotation.z += 0.01;
            spiderEmblem.userData.rings[2].rotation.y -= 0.02;
            spiderEmblem.userData.rings[2].rotation.z -= 0.015;
        }

        if (cyberBrain) {
            cyberBrain.rotation.x += 0.005;
            cyberBrain.rotation.z -= 0.002;
        }
        if (dimPortal) {
            dimPortal.rotation.x += 0.01;
            dimPortal.rotation.y += 0.005;
        }
        if (dnaGroup) {
            dnaGroup.rotation.y -= 0.02;
        }
        
        beatPulse = Math.max(0, beatPulse - 0.05);
        glowMat.emissiveIntensity = 2.0 + 1.5 * Math.sin(t * 3) + beatPulse * 5.0;
        pMat.size = 0.15 + beatPulse * 0.2;
        
        portals.forEach((p, i) => {
            p.rotation.z += 0.05 + beatPulse * 0.1;
            p.rotation.x += 0.01;
            p.scale.setScalar(1 + Math.sin(t*2 + i)*0.1 + beatPulse*0.3);
        });
        
        particles.position.y = Math.sin(t * 0.5) * 2;
        
        // Swarm Spiders animation
        swarmSpiders.forEach(sp => {
            sp.mesh.position.y = sp.b.y + Math.sin(t * sp.speed * 10 + sp.offset) * 0.5;
            sp.mesh.rotation.x = Math.sin(t * sp.speed * 15) * 0.2;
        });
        
        cam.position.z += (targetCamZ - cam.position.z) * 0.05;
        
        if (isMobile) {
            targetCamX = Math.sin(t * 0.5) * 2;
            cam.position.x += (targetCamX - cam.position.x) * 0.05;
            cam.position.y += (targetCamY - cam.position.y) * 0.05;
            // Look down the wall
            cam.lookAt(cam.position.x, cam.position.y - 20, cam.position.z - 5);
        } else {
            targetCamX = mouseX * 2;
            const tcY = mouseY * 1.5;
            cam.position.x += (targetCamX - cam.position.x) * 0.05;
            cam.position.y += (tcY - cam.position.y) * 0.05;
            // Dynamic lookAt logic to ensure we always look down the street
            cam.lookAt(cam.position.x * 0.5, cam.position.y * 0.5, cam.position.z - 20);
        }
        
        renderer.render(scene, cam);
    })();
})();

/* ===================== ABOUT MINI-SCENE ===================== */
(function initAbout() {
    const canvas = document.getElementById("about-canvas");
    if(!canvas) return;
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const w = canvas.parentElement.offsetWidth,
        h = canvas.parentElement.offsetHeight || 400;
    renderer.setSize(w, h);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    cam.position.set(0, 0, 5);
    scene.add(new THREE.AmbientLight(0x001133, 1));
    const sl = new THREE.SpotLight(0x4488ff, 60, 12, 0.4);
    sl.position.set(3, 4, 4);
    scene.add(sl);
    
    // Create Hologram Spider-bot
    const spiderBot = new THREE.Group();
    const holoMat = new THREE.MeshStandardMaterial({
        color: 0x2196f3,
        emissive: 0x4488ff,
        emissiveIntensity: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    // Body
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 1), holoMat);
    body.scale.set(1, 0.8, 1.2);
    spiderBot.add(body);
    
    // Legs
    for (let i = 0; i < 8; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        const legGroup = new THREE.Group();
        legGroup.position.set(side * 0.5, 0, (Math.floor(i / 2) - 1.5) * 0.5);
        legGroup.rotation.y = (Math.floor(i / 2) - 1.5) * 0.2;
        
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 1.5, 4), holoMat);
        leg.position.set(side * 0.7, -0.5, 0);
        leg.rotation.z = side * Math.PI / 4;
        legGroup.add(leg);
        
        spiderBot.add(legGroup);
    }
    
    scene.add(spiderBot);
    
    const clock = new THREE.Clock();
    let hovered = false;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    canvas.addEventListener("mouseenter", () => (hovered = true));
    canvas.addEventListener("mouseleave", () => {
        hovered = false;
        targetRotationX = 0;
        targetRotationY = 0;
    });
    canvas.addEventListener("mousemove", (e) => {
        if(hovered) {
            const rect = canvas.getBoundingClientRect();
            targetRotationY = ((e.clientX - rect.left) / rect.width - 0.5) * Math.PI;
            targetRotationX = ((e.clientY - rect.top) / rect.height - 0.5) * Math.PI;
        }
    });
    
    (function a() {
        requestAnimationFrame(a);
        const t = clock.getElapsedTime();
        
        if (!hovered) {
            spiderBot.rotation.y += 0.01;
            spiderBot.position.y = Math.sin(t * 2) * 0.1;
        } else {
            spiderBot.rotation.y += (targetRotationY - spiderBot.rotation.y) * 0.1;
            spiderBot.rotation.x += (targetRotationX - spiderBot.rotation.x) * 0.1;
        }
        
        // Hologram pulse effect
        holoMat.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.3;
        
        renderer.render(scene, cam);
    })();
})();

/* ===================== COUNTDOWN ===================== */
function updateCountdown() {
    const target = new Date("2026-09-18T09:00:00+05:30").getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
        document
            .querySelectorAll(".count-num")
            .forEach((e) => (e.textContent = "00"));
        return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const cdDays = document.getElementById("cd-days");
    if (!cdDays) return;
    cdDays.textContent = String(d).padStart(2, "0");
    document.getElementById("cd-hours").textContent = String(h).padStart(2, "0");
    document.getElementById("cd-mins").textContent = String(m).padStart(2, "0");
    document.getElementById("cd-secs").textContent = String(s).padStart(2, "0");
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ===================== PRIZE PARTICLE RAIN ===================== */
(function initPrize() {
    const canvas = document.getElementById("prize-canvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    let W,
        H,
        particles = [];
    function resize() {
        W = canvas.width = canvas.parentElement.offsetWidth;
        H = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 80; i++)
        particles.push({
            x: Math.random() * 1400,
            y: Math.random() * 800,
            s: Math.random() * 2 + 0.5,
            speed: Math.random() * 1.5 + 0.5,
            o: Math.random() * 0.5 + 0.1,
        });
    (function a() {
        requestAnimationFrame(a);
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p) => {
            ctx.fillStyle = `rgba(204,0,0,${p.o})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.speed;
            if (p.y > H) {
                p.y = -5;
                p.x = Math.random() * W;
            }
        });
    })();
})();

/* ===================== COUNT-UP ===================== */
function countUp(el, target, prefix) {
    let start = 0;
    const dur = 2000,
        step = 16;
    const inc = target / (dur / step);
    const t = setInterval(() => {
        start += inc;
        if (start >= target) {
            start = target;
            clearInterval(t);
        }
        if (prefix === "₹") {
            el.textContent =
                prefix +
                (start >= 1000 ? Math.floor(start / 1000) + "K" : Math.floor(start));
        } else {
            el.textContent = Math.floor(start);
        }
    }, step);
}

/* ===================== PRIZE COUNT-UP ===================== */
let prizeTriggered = false;
const prizeEl = document.getElementById("prize-count");

/* ===================== SCROLL REVEAL ===================== */
const reveals = document.querySelectorAll(".reveal,.reveal-left,.reveal-right");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                /* stats count-up */
                e.target.querySelectorAll("[data-count]").forEach((el) => {
                    const cnt = parseInt(el.dataset.count);
                    const pre = el.dataset.prefix || "";
                    countUp(el, cnt, pre);
                });
                /* prize count-up */
                if (
                    !prizeTriggered &&
                    e.target.contains &&
                    e.target.contains(prizeEl)
                ) {
                    prizeTriggered = true;
                    countUp(prizeEl, 20000, "");
                }
            }
        });
    },
    { threshold: 0.15 },
);
reveals.forEach((r) => observer.observe(r));

/* Prize section separately */
const prizeSection = document.getElementById("prize");
const prizeObs = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting && !prizeTriggered) {
            prizeTriggered = true;
            countUp(prizeEl, 20000, "");
        }
    },
    { threshold: 0.3 },
);
if (prizeSection) prizeObs.observe(prizeSection);

/* ===================== MULTI-STEP FORM ===================== */
let currentStep = 1;
let uploadedFile = null;

function goStep(n) {
    if (n > currentStep && !validateStep(currentStep)) return;
    document
        .getElementById("form-step-" + currentStep)
        .classList.remove("active");
    document.getElementById("step-ind-" + currentStep).classList.remove("active");
    document.getElementById("step-ind-" + currentStep).classList.add("done");
    currentStep = n;
    document.getElementById("form-step-" + n).classList.add("active");
    document.getElementById("step-ind-" + n).classList.add("active");
    document.getElementById("step-ind-" + n).classList.remove("done");
    if (n < 4) {
        for (let i = n + 1; i <= 4; i++) {
            const el = document.getElementById("step-ind-" + i);
            if (el) {
                el.classList.remove("active", "done");
            }
        }
    }
    document
        .querySelector(".register-wrap")
        .scrollIntoView({ behavior: "smooth", block: "start" });
}

function showErr(id, show) {
    const e = document.getElementById(id);
    if (e) e.classList.toggle("show", show);
}
function setFieldErr(id, err) {
    const f = document.getElementById(id);
    if (f) f.classList.toggle("error", err);
}

function validateStep(step) {
    let ok = true;
    const check = (id, condition) => {
        showErr("e-" + id, !condition);
        setFieldErr("f-" + id, !condition);
        if (!condition) ok = false;
    };

    if (step === 1) {
        const name = document.getElementById("f-name").value.trim();
        const dob = document.getElementById("f-dob").value;
        const gender = document.getElementById("f-gender").value;
        const email = document.getElementById("f-email").value.trim();
        const phone = document.getElementById("f-phone").value.trim();
        const emerg = document.getElementById("f-emergency").value.trim();
        
        check("name", name.length >= 3);
        check("dob", !!dob);
        check("gender", !!gender);
        check("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        check("phone", /^[6-9]\d{9}$/.test(phone));
        check("emergency", /^[6-9]\d{9}$/.test(emerg));
        
        return ok;
    }
    if (step === 2) {
        const col = document.getElementById("f-college").value.trim();
        const dept = document.getElementById("f-dept").value.trim();
        const year = document.getElementById("f-year").value;
        const roll = document.getElementById("f-roll").value.trim();
        
        check("college", col.length >= 3);
        check("dept", dept.length >= 2);
        check("year", !!year);
        check("roll", roll.length >= 3);
        return ok;
    }
    if (step === 3) {
        const evt = document.getElementById("f-event").value;
        check("event", !!evt);
        
        const teamSize = document.querySelector('input[name="teamsize"]:checked').value;
        if (teamSize === "2") {
            const tm = document.getElementById("f-teammate").value.trim();
            check("teammate", tm.length >= 2);
        }
        
        const accom = document.getElementById("f-accom").value;
        check("accom", !!accom);
        
        return ok;
    }
    return true;
}

function toggleTeammate(show) {
    const w = document.getElementById("teammate-wrap");
    w.classList.toggle("visible", show);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    processFile(file);
}
function handleDragOver(e) {
    e.preventDefault();
    document.getElementById("upload-zone").classList.add("dragover");
}
function handleDragLeave() {
    document.getElementById("upload-zone").classList.remove("dragover");
}
function handleDrop(e) {
    e.preventDefault();
    document.getElementById("upload-zone").classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    processFile(file);
}
function processFile(file) {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
        showErr("e-file", true);
        document.getElementById("e-file").textContent =
            "Please upload a JPG, PNG, or WEBP image";
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showErr("e-file", true);
        document.getElementById("e-file").textContent =
            "File size must be under 5MB";
        return;
    }
    uploadedFile = file;
    showErr("e-file", false);
    document.getElementById("preview-name").textContent =
        file.name + " (" + Math.round(file.size / 1024) + "KB)";
    document.getElementById("file-preview").style.display = "flex";
}
function removeFile() {
    uploadedFile = null;
    document.getElementById("file-input").value = "";
    document.getElementById("file-preview").style.display = "none";
}

function submitForm() {
    if (!validateStep(3)) {
        goStep(3);
        return;
    }
    const terms = document.getElementById("f-terms").checked;
    showErr("e-terms", !terms);
    
    if (!uploadedFile) {
        showErr("e-file", true);
        return;
    }
    if (!terms) return;

    const btn = document.getElementById("submit-btn");
    btn.disabled = true;
    btn.textContent = "PROCESSING...";

    const data = {
        name: document.getElementById("f-name").value.trim(),
        dob: document.getElementById("f-dob").value,
        gender: document.getElementById("f-gender").value,
        email: document.getElementById("f-email").value.trim(),
        phone: document.getElementById("f-phone").value.trim(),
        emergency: document.getElementById("f-emergency").value.trim(),
        college: document.getElementById("f-college").value.trim(),
        department: document.getElementById("f-dept").value.trim(),
        year: document.getElementById("f-year").value,
        roll: document.getElementById("f-roll").value.trim(),
        link: document.getElementById("f-link").value.trim() || "—",
        event: document.getElementById("f-event").value,
        teamSize: document.querySelector('input[name="teamsize"]:checked').value,
        teammateName: document.getElementById("f-teammate").value.trim() || "—",
        accommodation: document.getElementById("f-accom").value,
        dietary: document.getElementById("f-diet").value,
        paymentFile: uploadedFile.name,
    };

    setTimeout(() => {
        btn.textContent = "REGISTRATION SUCCESSFUL!";
        btn.style.background = "#28a745";
        btn.style.borderColor = "#28a745";
        btn.style.color = "#fff";
        btn.style.boxShadow = "0 0 20px rgba(40,167,69,0.6)";
        console.log("Registration Data:", data);
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }, 2000);
}

/* ===================== CONFETTI ===================== */
function fireConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#CC0000", "#FF1A1A", "#FFFFFF", "#FFD700", "#FF4444"];
    const pieces = [];
    for (let i = 0; i < 200; i++) {
        pieces.push({
            x: Math.random() * window.innerWidth,
            y: -10,
            w: Math.random() * 12 + 4,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 4 + 2,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            opacity: 1,
        });
    }
    let frame = 0;
    (function a() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            if (frame > 80) p.opacity -= 0.015;
            if (p.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        frame++;
        if (frame < 150) requestAnimationFrame(a);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })();
}

/* ===================== STEP INDICATOR FIX ===================== */
function updateStepIndicators(current) {
    for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById("step-ind-" + i);
        ind.classList.remove("active", "done");
        if (i < current) ind.classList.add("done");
        else if (i === current) ind.classList.add("active");
    }
}
const origGoStep = goStep;
window.goStep = function (n) {
    if (n > currentStep && !validateStep(currentStep)) return;
    document
        .getElementById("form-step-" + currentStep)
        .classList.remove("active");
    currentStep = n;
    document.getElementById("form-step-" + n).classList.add("active");
    updateStepIndicators(n);
    document
        .querySelector(".register-wrap")
        .scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ===================== INPUT LIVE VALIDATION ===================== */
["f-name", "f-dept", "f-college", "f-email", "f-phone"].forEach((id) => {
    const el = document.getElementById(id);
    if (el)
        el.addEventListener("input", () => {
            el.classList.remove("error");
        });
});

/* ===================== EVENTS UI ENHANCEMENTS ===================== */
// Wire up "Register for this" buttons on event cards to pre-fill the form dropdown
document.querySelectorAll(".event-register-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const card = e.target.closest(".event-card") || e.target.closest(".nontech-card");
        if (!card) return;
        const title = card.querySelector(".event-title").textContent.trim();
        const select = document.getElementById("f-event");
        if (select) {
            for (let opt of select.options) {
                if (opt.text.toUpperCase() === title.toUpperCase()) {
                    select.value = opt.value;
                    break;
                }
            }
        }
    });
});

// Enable drag-to-scroll on the horizontal events track for better desktop UX
const scrollTrack = document.querySelector(".events-scroll-track");
if (scrollTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollTrack.addEventListener("mousedown", (e) => {
        isDown = true;
        scrollTrack.style.cursor = "grabbing";
        startX = e.pageX - scrollTrack.offsetLeft;
        scrollLeft = scrollTrack.scrollLeft;
    });
    scrollTrack.addEventListener("mouseleave", () => {
        isDown = false;
        scrollTrack.style.cursor = "";
    });
    scrollTrack.addEventListener("mouseup", () => {
        isDown = false;
        scrollTrack.style.cursor = "";
    });
    scrollTrack.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollTrack.offsetLeft;
        const walk = (x - startX) * 2; // scroll speed multiplier
        scrollTrack.scrollLeft = scrollLeft - walk;
    });
}


/* ===================== SPIDER EVENTS ===================== */
const eventsData = [
  {
    title: "PAPER PRESENTATION",
    logo: "📄",
    tagline: "Ink Meets Innovation",
    desc: "Showcase your research and innovative ideas before a panel of expert judges. Present a technical paper on any topic in Electronics, Communication, or Emerging Technologies. Defend your data, impress the jury.",
    rules: ["Team size: 1–2 members", "IEEE-format report + PPT required", "10 min presentation + 5 min Q&A", "Plagiarism must be below 20%"]
  },
  {
    title: "PROJECT EXPO",
    logo: "⚙️",
    tagline: "Build It. Show It. Own It.",
    desc: "Bring your hardware or software masterpiece to the expo floor. Connect your circuits, boot your code, and let your prototype speak louder than any slide deck.",
    rules: ["Team size: 1–2 members", "Working prototype strongly preferred", "Judged: Innovation, Execution, Impact", "Abstract submission 3 days prior"]
  },
  {
    title: "CIRCUIT BREAKERS",
    logo: "⚡",
    tagline: "Fault Found. Victory Claimed.",
    desc: "You have a broken circuit. A ticking clock. And your bare hands. Identify faults, rewire connections, and build working circuits from scratch under tournament pressure.",
    rules: ["Team size: 1–2 members", "Components and tools provided on-spot", "3 rounds: Fault ID → Circuit Build → Speed", "No phones or external datasheets"]
  },
  {
    title: "TECHNICAL QUIZ",
    logo: "🧠",
    tagline: "Fast Buzzers. Sharp Minds.",
    desc: "From Maxwells equations to modern microcontrollers — how deep does your ECE knowledge run? A multi-round elimination battle covering core electronics and communication.",
    rules: ["Team size: 1–2 members", "4 rounds: Written → Rapid fire → Visual → Buzzer", "Elimination after each round", "Topics: Analog, Digital, EDC, Signals"]
  },
  {
    title: "MINUTE TO WIN IT",
    logo: "⏱️",
    tagline: "60 Seconds of Chaos",
    desc: "Stack, balance, spin, and scramble — complete wild, prop-based challenges in under 60 seconds each. Simple rules. Impossible under pressure.",
    rules: ["Team size: 1–2 members", "Multiple knockout rounds", "All props provided on-site"]
  },
  {
    title: "DETECTIVE",
    logo: "🔍",
    tagline: "The Clues Dont Lie. Can You?",
    desc: "A crime scene awaits. Evidence is scattered. Time is running out. Observe the scene, decode the clues, connect the dots, and name the culprit before other teams beat you to it.",
    rules: ["Team size: 1–2 members", "Points for correct culprit + fastest solve", "Red herrings included — trust nothing"]
  },
  {
    title: "BOX HUNT",
    logo: "📦",
    tagline: "Find the Box. Claim the Points.",
    desc: "Numbered boxes are hidden across the campus. A full-campus scavenger race where your speed, observation, and navigation skills determine your destiny.",
    rules: ["Team size: 1–2 members", "45-minute time limit", "Each box contains a code to submit"]
  },
  {
    title: "START MUSIC",
    logo: "🎵",
    tagline: "Name It Before the Drop",
    desc: "The song starts. You have 5 seconds. A buzzer-based rapid-fire showdown where your playlist knowledge becomes your competitive edge.",
    rules: ["Team size: 1–2 members", "Buzzer system — first buzz answers", "Wrong answer = negative points"]
  }
];

function showEvent(idx) {
    const center = document.getElementById("spider-center");
    if (!center) return;
    
    // Highlight active node
    document.querySelectorAll(".spider-node").forEach((node, i) => {
        if(i === idx) node.classList.add("active");
        else node.classList.remove("active");
    });
    
    const ev = eventsData[idx];
    let rulesHtml = "<ul class=\"event-rules\" style=\"text-align: left; margin: 0 auto; display: inline-block;\">";
    ev.rules.forEach(r => rulesHtml += "<li>" + r + "</li>");
    rulesHtml += "</ul>";
    
    center.innerHTML = `
        <div class="comic-panel-container" style="animation: sv-chromatic-shift 0.3s forwards;">
            <div class="comic-panel">
                <div class="comic-bubble">THWIP!</div>
                <div class="center-logo" style="font-size: 3rem; margin-bottom: 10px;">${ev.logo}</div>
                <div class="comic-panel-title">${ev.title}</div>
                <div class="event-tagline" style="font-family: 'Permanent Marker', cursive; color: #e81123; margin-bottom: 15px; font-size: 1.2rem; display:block;">${ev.tagline}</div>
                <div class="comic-panel-desc" style="margin-bottom: 15px;">${ev.desc}</div>
                ${rulesHtml}
                <div style="margin-top: 24px; text-align: center;">
                    <button class="btn-primary" onclick="window.location.href='register.html'" style="transform: rotate(2deg); box-shadow: 4px 4px 0 #0ff;">REGISTER NOW</button>
                </div>
            </div>
        </div>
    `;
}


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

// FAQ Accordion
document.addEventListener("DOMContentLoaded", () => {
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const item = question.parentElement;
            const isActive = item.classList.contains("active");
            
            // Close all other items
            document.querySelectorAll(".faq-item").forEach(otherItem => {
                otherItem.classList.remove("active");
                otherItem.querySelector(".faq-answer").style.maxHeight = null;
            });
            
            // Open the clicked item if it wasn't active
            if (!isActive) {
                item.classList.add("active");
                const answer = item.querySelector(".faq-answer");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});
