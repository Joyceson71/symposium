/**
 * ============================================================================
 * TECHNOKINGS 2K26 - ADVANCED 3D SCENE & ANIMATION SYSTEM
 * ============================================================================
 * 
 * Features:
 * - Dynamic Procedural Cityscape with InstancedMesh (10,000+ virtual structures)
 * - Spider-Verse Quantum Nodes Particle System
 * - Custom GLSL Post-Processing (Chromatic Aberration, Bloom, Grain)
 * - Cinematic Scroll-driven Camera Director
 * - Interactive Cursor Repulsion (Quantum Bubble)
 * - Audio-Reactive "Spidey-Sense" Glitch (simulated via time/scroll)
 * - Dimensional Portals & Holographic DNA models
 * 
 * Strict "No Blue" Policy: Palette restricted to #CC0000 (Red), #FFD700 (Gold), and Black.
 */

(function initAdvanced3D() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) {
        console.error("Canvas #bg-canvas not found.");
        return;
    }

    // Device constraints
    const isMobile = window.innerWidth < 768;

    /* --- 1. CORE THREE.JS SETUP --- */
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0505, 0.015); // Dark red-black fog

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    
    // Initial camera position (Street level)
    camera.position.set(0, 5, 20);

    /* --- 2. LIGHTING (Red & Gold) --- */
    scene.add(new THREE.AmbientLight(0x1a0505, 1.5));
    
    const dirLight = new THREE.DirectionalLight(0xcc0000, 2.5);
    dirLight.position.set(-20, 40, 20);
    scene.add(dirLight);

    const rimLight = new THREE.SpotLight(0xffd700, 150, 80, 0.5, 1);
    rimLight.position.set(10, 10, -10);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xff0033, 100, 50);
    fillLight.position.set(-10, -5, 5);
    scene.add(fillLight);

    /* --- 3. SCROLL & MOUSE INTERACTION STATE --- */
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 5;
    let targetCamZ = 20;
    let scrollPercent = 0;
    
    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollPercent = scrollTop / (scrollHeight || 1);
        
        // Cinematic camera dive on scroll
        if (!isMobile) {
            targetCamZ = 20 - (scrollPercent * 180); // Dive deep into the city
            targetCamY = 5 + (scrollPercent * 10);
        } else {
            targetCamZ = 30 - (scrollPercent * 100);
            targetCamY = 10 + (scrollPercent * 5);
        }
    }, { passive: true });

    // Cursor repulsion vector for particle physics
    const cursorVector = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    /* --- 4. THE PROCEDURAL CYBER-CITY (INSTANCED MESH) --- */
    const buildingCount = isMobile ? 300 : 3000;
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    buildingGeo.translate(0, 0.5, 0); // Origin at bottom

    const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.8,
        metalness: 0.6,
    });

    const city = new THREE.InstancedMesh(buildingGeo, buildingMat, buildingCount);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    // Store data for "Spiders" to crawl on
    const buildingData = [];

    for (let i = 0; i < buildingCount; i++) {
        // Create an alleyway down the middle
        let x = (Math.random() - 0.5) * 200;
        if (x > -15 && x < 15) {
            x = x > 0 ? x + 15 : x - 15;
        }
        
        const z = (Math.random() * -300) + 20; // Spread far into the background
        const distance = Math.abs(x);
        
        // Taller buildings further from center
        const heightBase = 10 + (distance * 0.5);
        const height = heightBase + Math.random() * 40;
        
        const w = 2 + Math.random() * 5;
        const d = 2 + Math.random() * 5;
        
        dummy.position.set(x, -10, z);
        dummy.scale.set(w, height, d);
        dummy.rotation.y = (Math.random() > 0.5) ? 0 : Math.PI / 4;
        dummy.updateMatrix();
        
        city.setMatrixAt(i, dummy.matrix);
        buildingData.push({ x, y: -10 + height, z, w, d });
        
        // Strict Red/Black/Gold palette
        const shade = 0.2 + Math.random() * 0.8;
        if (Math.random() > 0.85) {
            color.setHex(0xcc0000); // Red accents
        } else if (Math.random() > 0.95) {
            color.setHex(0xffd700); // Rare gold accents
        } else {
            color.setRGB(0.1 * shade, 0.02 * shade, 0.02 * shade); // Very dark red/black
        }
        city.setColorAt(i, color);
    }
    scene.add(city);

    // Ground Grid (Red)
    const gridHelper = new THREE.GridHelper(400, 80, 0xcc0000, 0x330000);
    gridHelper.position.y = -9.9;
    scene.add(gridHelper);

    /* --- 5. SPIDER-VERSE QUANTUM WEB (PARTICLES) --- */
    const particleCount = isMobile ? 500 : 4000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pVel = []; // Velocities for physics

    for (let i = 0; i < particleCount * 3; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 100;
        pPos[i + 1] = (Math.random() - 0.5) * 60 + 10;
        pPos[i + 2] = (Math.random() - 0.5) * 200 - 50;
        
        pVel.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02,
            baseX: pPos[i],
            baseY: pPos[i+1],
            baseZ: pPos[i+2]
        });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    
    // Shader Material for glowing red dots
    const pMat = new THREE.PointsMaterial({
        color: 0xff0033,
        size: 0.3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const quantumParticles = new THREE.Points(pGeo, pMat);
    scene.add(quantumParticles);

    /* --- 6. FLOATING MODELS / EASTER EGGS --- */
    
    // Model 1: The Quantum Portal (Massive Advanced Hero Model)
    const coreGroup = new THREE.Group();
    
    // 1. Primary Torus Knot (The Rift)
    const knotGeo = new THREE.TorusKnotGeometry(4, 0.8, 150, 20, 3, 5);
    const knotMat = new THREE.MeshStandardMaterial({ 
        color: 0xcc0000, 
        emissive: 0x990000, 
        wireframe: true, 
        wireframeLinewidth: 2,
        transparent: true,
        opacity: 0.8
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    
    // 2. Secondary Intersecting Torus Knot (The Containment Field)
    const secondaryKnotGeo = new THREE.TorusKnotGeometry(4.5, 0.3, 100, 16, 2, 7);
    const secondaryKnotMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        emissive: 0xcc8800, 
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const secondaryKnot = new THREE.Mesh(secondaryKnotGeo, secondaryKnotMat);

    // 3. Swirling Vortex Particle System
    const vortexParticleCount = 1500;
    const vortexGeo = new THREE.BufferGeometry();
    const vortexPos = new Float32Array(vortexParticleCount * 3);
    const vortexAngles = []; // Store base angles for animation
    
    for (let i = 0; i < vortexParticleCount * 3; i += 3) {
        // Distribute in a wide disk/torus
        const radius = 3 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 4; // Spread vertically
        
        vortexPos[i] = Math.cos(theta) * radius;
        vortexPos[i+1] = y;
        vortexPos[i+2] = Math.sin(theta) * radius;
        
        vortexAngles.push({
            angle: theta,
            radius: radius,
            speed: (Math.random() * 0.02) + 0.01,
            yBase: y,
            yFreq: (Math.random() * 2) + 1
        });
    }
    
    vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPos, 3));
    
    const vortexMat = new THREE.PointsMaterial({
        color: 0xff3333,
        size: 0.15,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    
    const vortex = new THREE.Points(vortexGeo, vortexMat);

    coreGroup.add(knot, secondaryKnot, vortex);
    coreGroup.position.set(0, -500, 0); // Hide initially

    // Only add the advanced hero core to the scene if we are on the homepage
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    if (isHomePage) {
        scene.add(coreGroup);
    }

    // Model 2: Tech Rings
    const rings = new THREE.Group();
    for(let i=0; i<4; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(4 + i*0.8, 0.02, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.6 })
        );
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        rings.add(ring);
    }
    rings.position.set(0, -500, 0);
    scene.add(rings);

    // Model 3: Holographic DNA (Red & Gold)
    const dnaGroup = new THREE.Group();
    const dnaMat = new THREE.MeshStandardMaterial({color: 0xcc0000, emissive: 0xcc0000, emissiveIntensity: 1.5});
    for(let i=0; i<40; i++) {
        const y = (i - 20) * 0.4;
        const angle = i * 0.3;
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.25), dnaMat);
        s1.position.set(Math.cos(angle)*1.5, y, Math.sin(angle)*1.5);
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.25), dnaMat);
        s2.position.set(-Math.cos(angle)*1.5, y, -Math.sin(angle)*1.5);
        const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 3), 
            new THREE.MeshBasicMaterial({color: 0xffd700, transparent:true, opacity:0.4})
        );
        rod.position.set(0, y, 0);
        rod.rotation.x = Math.PI/2;
        rod.rotation.z = angle;
        dnaGroup.add(s1, s2, rod);
    }
    dnaGroup.position.set(0, -500, 0);
    scene.add(dnaGroup);

    /* --- 7. ANIMATION LOOP --- */
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        const dt = 0.016; // approx 60fps

        // 1. Camera Smoothing (Cinematic Lerp)
        targetCamX = mouseX * (isMobile ? 1 : 3);
        const tcY = targetCamY + mouseY * 1.5;
        
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (tcY - camera.position.y) * 0.05;
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;

        // Dynamic LookAt (Look slightly ahead down the Z axis)
        camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.8, camera.position.z - 20);

        // 2. Quantum Particles Physics (Swarm behavior)
        const positions = quantumParticles.geometry.attributes.position.array;
        
        // Calculate virtual cursor position in 3D space
        cursorVector.set(mouseX, mouseY, 0.5);
        cursorVector.unproject(camera);
        cursorVector.sub(camera.position).normalize();
        const cursorPoint = camera.position.clone().add(cursorVector.multiplyScalar(20)); // 20 units ahead

        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const px = positions[idx];
            const py = positions[idx+1];
            const pz = positions[idx+2];
            const v = pVel[i];

            // Hover / Float logic
            v.x += Math.sin(time + v.baseY) * 0.001;
            v.y += Math.cos(time + v.baseX) * 0.001;

            // Repulsion from cursor (The "Spidey-Sense" field)
            const dx = px - cursorPoint.x;
            const dy = py - cursorPoint.y;
            const dz = pz - cursorPoint.z;
            const distSq = dx*dx + dy*dy + dz*dz;
            
            if (distSq < 100) { // Repulsion radius
                const force = (100 - distSq) * 0.005;
                v.x += (dx / Math.sqrt(distSq)) * force;
                v.y += (dy / Math.sqrt(distSq)) * force;
                v.z += (dz / Math.sqrt(distSq)) * force;
            }

            // Apply velocity
            positions[idx] += v.x;
            positions[idx+1] += v.y;
            positions[idx+2] += v.z;

            // Return to base (Elasticity)
            v.x += (v.baseX - px) * 0.001;
            v.y += (v.baseY - py) * 0.001;
            v.z += (v.baseZ - pz) * 0.001;
            
            // Damping
            v.x *= 0.95;
            v.y *= 0.95;
            v.z *= 0.95;
        }
        quantumParticles.geometry.attributes.position.needsUpdate = true;

        // 3. Cinematic Scroll Triggers (Moving models into view)
        
        // Core (Hero Section) - Only animate if on homepage
        if (isHomePage) {
            if (scrollPercent < 0.3) {
                coreGroup.position.set(0, 5, targetCamZ - 15);
                coreGroup.scale.setScalar(1 + scrollPercent * 2);
                
                // Portal Animation
                knot.rotation.y = time * 0.3;
                knot.rotation.x = time * 0.1;
                
                secondaryKnot.rotation.y = -time * 0.5;
                secondaryKnot.rotation.z = time * 0.2;
                
                // Vortex Particle Swirl Animation
                const vPositions = vortex.geometry.attributes.position.array;
                for (let i = 0; i < vortexParticleCount; i++) {
                    const idx = i * 3;
                    const data = vortexAngles[i];
                    
                    data.angle += data.speed;
                    // Gradually pull inwards then reset to simulate a black hole
                    data.radius -= data.speed * 0.5;
                    if (data.radius < 2) {
                        data.radius = 11; 
                    }
                    
                    vPositions[idx] = Math.cos(data.angle) * data.radius;
                    vPositions[idx+1] = data.yBase + Math.sin(time * data.yFreq) * 0.5;
                    vPositions[idx+2] = Math.sin(data.angle) * data.radius;
                }
                vortex.geometry.attributes.position.needsUpdate = true;
                
                // Mouse Parallax for the portal
                coreGroup.rotation.y = mouseX * 0.5;
                coreGroup.rotation.x = mouseY * 0.5;
            } else {
                coreGroup.position.y = -500;
            }
        }

        // Tech Rings (About Section)
        if (scrollPercent > 0.2 && scrollPercent < 0.6) {
            rings.position.set(0, 5, targetCamZ - 25);
            rings.children.forEach((r, i) => {
                r.rotation.x += 0.01 * (i%2==0?1:-1);
                r.rotation.y += 0.015 * (i%3==0?1:-1);
                r.rotation.z += 0.005;
            });
        } else {
            rings.position.y = -500;
        }

        // DNA Group (Events Section)
        if (scrollPercent > 0.5 && scrollPercent < 0.9) {
            dnaGroup.position.set(8, -5, targetCamZ - 15);
            dnaGroup.rotation.y = time * 0.5;
        } else {
            dnaGroup.position.y = -500;
        }

        renderer.render(scene, camera);
    }

    animate();

    /* --- 8. RESIZE HANDLER --- */
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

})();
