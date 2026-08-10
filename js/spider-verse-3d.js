

(function initAdvanced3D() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) {
        console.error("Canvas #bg-canvas not found.");
        return;
    }

const isMobile = window.innerWidth < 768;

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
    scene.fog = new THREE.FogExp2(0x0a0505, 0.015); 

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);

camera.position.set(0, 5, 20);

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

if (!isMobile) {
            targetCamZ = 20 - (scrollPercent * 180); 
            targetCamY = 5 + (scrollPercent * 10);
        } else {
            targetCamZ = 30 - (scrollPercent * 100);
            targetCamY = 10 + (scrollPercent * 5);
        }
    }, { passive: true });

const cursorVector = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

const buildingCount = isMobile ? 300 : 3000;
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    buildingGeo.translate(0, 0.5, 0); 

const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.8,
        metalness: 0.6,
    });

const city = new THREE.InstancedMesh(buildingGeo, buildingMat, buildingCount);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

const buildingData = [];

for (let i = 0; i < buildingCount; i++) {

let x = (Math.random() - 0.5) * 200;
        if (x > -15 && x < 15) {
            x = x > 0 ? x + 15 : x - 15;
        }

const z = (Math.random() * -300) + 20; 
        const distance = Math.abs(x);

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

const shade = 0.2 + Math.random() * 0.8;
        if (Math.random() > 0.85) {
            color.setHex(0xcc0000); 
        } else if (Math.random() > 0.95) {
            color.setHex(0xffd700); 
        } else {
            color.setRGB(0.1 * shade, 0.02 * shade, 0.02 * shade); 
        }
        city.setColorAt(i, color);
    }
    scene.add(city);

const gridHelper = new THREE.GridHelper(400, 80, 0xcc0000, 0x330000);
    gridHelper.position.y = -9.9;
    scene.add(gridHelper);

const particleCount = isMobile ? 500 : 4000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pVel = []; 

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

const pMat = new THREE.PointsMaterial({
        color: 0xff0033,
        size: 0.3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

const quantumParticles = new THREE.Points(pGeo, pMat);
    scene.add(quantumParticles);

const coreGroup = new THREE.Group();

const webGeo = new THREE.IcosahedronGeometry(7, 2);
    const webMat = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.4
    });
    const webSphere = new THREE.LineSegments(new THREE.EdgesGeometry(webGeo), webMat);
    coreGroup.add(webSphere);

const logoShape = new THREE.Shape();

logoShape.moveTo(0, -3.5);

logoShape.lineTo(-1.2, -1.0);

logoShape.lineTo(-3.5, -2.5);
    logoShape.lineTo(-3.6, -2.2);
    logoShape.lineTo(-1.6, -0.4); 

logoShape.lineTo(-4.0, -0.8);
    logoShape.lineTo(-4.1, -0.5);
    logoShape.lineTo(-1.8, 0.4); 

logoShape.lineTo(-4.2, 1.5);
    logoShape.lineTo(-4.0, 1.8);
    logoShape.lineTo(-1.6, 1.2); 

logoShape.lineTo(-0.8, 2.5);
    logoShape.lineTo(0, 2.8); 

logoShape.lineTo(0.8, 2.5);
    logoShape.lineTo(1.6, 1.2);

logoShape.lineTo(4.0, 1.8);
    logoShape.lineTo(4.2, 1.5);
    logoShape.lineTo(1.8, 0.4);

logoShape.lineTo(4.1, -0.5);
    logoShape.lineTo(4.0, -0.8);
    logoShape.lineTo(1.6, -0.4);

logoShape.lineTo(3.6, -2.2);
    logoShape.lineTo(3.5, -2.5);
    logoShape.lineTo(1.2, -1.0);

logoShape.lineTo(0, -3.5);

const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.15, bevelThickness: 0.15 };
    const logoGeo = new THREE.ExtrudeGeometry(logoShape, extrudeSettings);
    logoGeo.center();

const logoMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0xaa0000,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8,
    });

const emblem = new THREE.Mesh(logoGeo, logoMat);
    emblem.scale.setScalar(0.8);
    coreGroup.add(emblem);

coreGroup.position.set(0, -500, 0); 

const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    if (isHomePage) {
        scene.add(coreGroup);
    }

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

const clock = new THREE.Clock();

function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        const dt = 0.016; 

targetCamX = mouseX * (isMobile ? 1 : 3);
        const tcY = targetCamY + mouseY * 1.5;

camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (tcY - camera.position.y) * 0.05;
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;

camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.8, camera.position.z - 20);

const positions = quantumParticles.geometry.attributes.position.array;

cursorVector.set(mouseX, mouseY, 0.5);
        cursorVector.unproject(camera);
        cursorVector.sub(camera.position).normalize();
        const cursorPoint = camera.position.clone().add(cursorVector.multiplyScalar(20)); 

for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const px = positions[idx];
            const py = positions[idx+1];
            const pz = positions[idx+2];
            const v = pVel[i];

v.x += Math.sin(time + v.baseY) * 0.001;
            v.y += Math.cos(time + v.baseX) * 0.001;

const dx = px - cursorPoint.x;
            const dy = py - cursorPoint.y;
            const dz = pz - cursorPoint.z;
            const distSq = dx*dx + dy*dy + dz*dz;

if (distSq < 100) { 
                const force = (100 - distSq) * 0.005;
                v.x += (dx / Math.sqrt(distSq)) * force;
                v.y += (dy / Math.sqrt(distSq)) * force;
                v.z += (dz / Math.sqrt(distSq)) * force;
            }

positions[idx] += v.x;
            positions[idx+1] += v.y;
            positions[idx+2] += v.z;

v.x += (v.baseX - px) * 0.001;
            v.y += (v.baseY - py) * 0.001;
            v.z += (v.baseZ - pz) * 0.001;

v.x *= 0.95;
            v.y *= 0.95;
            v.z *= 0.95;
        }
        quantumParticles.geometry.attributes.position.needsUpdate = true;

if (isHomePage) {
            if (scrollPercent < 0.3) {
                coreGroup.position.set(0, 5, targetCamZ - 15);
                coreGroup.scale.setScalar(1 + scrollPercent * 2);

coreGroup.position.set(0, 5 + Math.sin(time * 1.5) * 0.5, targetCamZ - 15);
                coreGroup.scale.setScalar(1 + scrollPercent * 2);

coreGroup.rotation.y = time * 0.2 + mouseX * 0.3;
                coreGroup.rotation.x = mouseY * 0.3;

emblem.rotation.y = time * 0.1;

const webScale = 1 + Math.sin(time * 2) * 0.03;
                webSphere.scale.setScalar(webScale);
            } else {
                coreGroup.position.y = -500;
            }
        }

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

if (scrollPercent > 0.5 && scrollPercent < 0.9) {
            dnaGroup.position.set(8, -5, targetCamZ - 15);
            dnaGroup.rotation.y = time * 0.5;
        } else {
            dnaGroup.position.y = -500;
        }

renderer.render(scene, camera);
    }

animate();

window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

})();
