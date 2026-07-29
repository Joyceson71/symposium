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
window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        if(loader) {
            loader.style.opacity = "0";
            setTimeout(() => (loader.style.display = "none"), 800);
        }
    }, 2800);
});

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
    
    // Deep fog for the endless city effect
    scene.fog = new THREE.FogExp2(0x0a1128, 0.015);
    
    const cam = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        300,
    );
    // Camera starts at z=9, flies towards -Z
    cam.position.set(0, 0, 9);

    /* LIGHTS */
    scene.add(new THREE.AmbientLight(0x0a1128, 2.0));
    const dirLight = new THREE.DirectionalLight(0x1976d2, 1.5);
    dirLight.position.set(-10, 20, 10);
    scene.add(dirLight);
    
    const spot1 = new THREE.SpotLight(0x4488ff, 80, 50, 0.5, 1);
    spot1.position.set(5, 8, 5);
    scene.add(spot1);
    
    const spot2 = new THREE.SpotLight(0xd32f2f, 40, 30);
    spot2.position.set(-5, -4, 3);
    scene.add(spot2);

    /* SPIDER EMBLEM (At z=0) */
    const spiderEmblem = new THREE.Group();
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.2, metalness: 0.9,
    });
    const glowMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0x4488ff, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.8,
    });
    // Abdomen
    const abdomenGeo = new THREE.SphereGeometry(1.2, 32, 32);
    abdomenGeo.scale(1, 1.5, 0.8);
    const abdomen = new THREE.Mesh(abdomenGeo, bodyMat);
    abdomen.position.y = -0.5;
    spiderEmblem.add(abdomen);
    // Core
    const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
    coreGeo.scale(1, 1.8, 0.4);
    const core = new THREE.Mesh(coreGeo, glowMat);
    core.position.set(0, -0.5, 0.7);
    spiderEmblem.add(core);
    // Head
    const headGeo = new THREE.SphereGeometry(0.7, 32, 32);
    headGeo.scale(1.2, 1, 0.8);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 1.2, 0.2);
    spiderEmblem.add(head);
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeR = new THREE.Mesh(eyeGeo, glowMat);
    eyeR.scale.set(1, 2.5, 1);
    eyeR.position.set(0.3, 1.4, 0.9);
    eyeR.rotation.set(Math.PI / 6, 0, -Math.PI / 4);
    spiderEmblem.add(eyeR);
    const eyeL = new THREE.Mesh(eyeGeo, glowMat);
    eyeL.scale.set(1, 2.5, 1);
    eyeL.position.set(-0.3, 1.4, 0.9);
    eyeL.rotation.set(Math.PI / 6, 0, Math.PI / 4);
    spiderEmblem.add(eyeL);
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.12, 0.06, 3.5, 16);
    const jointGeo = new THREE.SphereGeometry(0.25, 16, 16);
    function createLeg(side, angleY, angleZ, posY, posZ) {
        const legGroup = new THREE.Group();
        legGroup.position.set(side * 0.6, posY, posZ);
        legGroup.rotation.set(0, angleY, side * angleZ);
        const femur = new THREE.Mesh(legGeo, bodyMat);
        femur.position.y = 1.75;
        legGroup.add(femur);
        const knee = new THREE.Mesh(jointGeo, glowMat);
        knee.position.y = 3.5;
        legGroup.add(knee);
        const lowerLeg = new THREE.Group();
        lowerLeg.position.y = 3.5; 
        lowerLeg.rotation.z = side * (Math.PI / 1.5);
        const tibiaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.02, 4, 16), bodyMat);
        tibiaMesh.position.y = 2; 
        lowerLeg.add(tibiaMesh);
        legGroup.add(lowerLeg);
        return legGroup;
    }
    spiderEmblem.add(createLeg(1, -0.3, -0.8, 1.2, 0));
    spiderEmblem.add(createLeg(-1, 0.3, -0.8, 1.2, 0));
    spiderEmblem.add(createLeg(1, -0.1, -1.2, 1.0, 0));
    spiderEmblem.add(createLeg(-1, 0.1, -1.2, 1.0, 0));
    spiderEmblem.add(createLeg(1, 0.2, -1.8, 0.5, 0));
    spiderEmblem.add(createLeg(-1, -0.2, -1.8, 0.5, 0));
    spiderEmblem.add(createLeg(1, 0.4, -2.2, -0.2, 0));
    spiderEmblem.add(createLeg(-1, -0.4, -2.2, -0.2, 0));
    spiderEmblem.scale.setScalar(0.85);
    scene.add(spiderEmblem);

    /* CYBER CITY (INSTANCED MESH) */
    const isMobile = window.innerWidth < 768;
    const buildingCount = isMobile ? 400 : 2000;
    
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
    
    for (let i = 0; i < buildingCount; i++) {
        let x = (Math.random() - 0.5) * 160;
        if (x > -10 && x < 10) x = x > 0 ? x + 10 : x - 10;
        
        const z = (Math.random() * -200) + 10;
        const distance = Math.abs(x);
        const heightBase = 5 + (distance * 0.8);
        const height = heightBase + Math.random() * 25;
        
        const w = 2 + Math.random() * 4;
        const d = 2 + Math.random() * 4;
        
        dummy.position.set(x, -10, z);
        dummy.scale.set(w, height, d);
        dummy.rotation.y = (Math.random() > 0.5) ? 0 : Math.PI / 4;
        dummy.updateMatrix();
        
        city.setMatrixAt(i, dummy.matrix);
        
        const shade = 0.4 + Math.random() * 0.6;
        color.setRGB(0.02 * shade, 0.04 * shade, 0.12 * shade);
        city.setColorAt(i, color);
    }
    scene.add(city);
    
    // Ground plane with grid
    const gridHelper = new THREE.GridHelper(300, 60, 0x1976d2, 0x0a1128);
    gridHelper.position.y = -9.9;
    scene.add(gridHelper);

    /* PARTICLES */
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array((isMobile ? 500 : 2000) * 3);
    for (let i = 0; i < pos.length; i += 3) {
        pos[i] = (Math.random() - 0.5) * 150;
        pos[i + 1] = -10 + Math.random() * 60;
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

    /* MOUSE & SCROLL INTERACTIONS */
    let mouseX = 0, mouseY = 0;
    let targetCamZ = 9;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollTop / (scrollHeight || 1);
        
        // Fly through city: from z=9 to z=-150
        targetCamZ = 9 - (scrollPercent * 159);
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
        glowMat.emissiveIntensity = 1.5 + 1.0 * Math.sin(t * 3);
        
        particles.position.y = Math.sin(t * 0.5) * 2;
        
        cam.position.z += (targetCamZ - cam.position.z) * 0.05;
        
        const targetCamX = mouseX * 2;
        const targetCamY = mouseY * 1.5;
        cam.position.x += (targetCamX - cam.position.x) * 0.05;
        cam.position.y += (targetCamY - cam.position.y) * 0.05;
        
        // Dynamic lookAt logic to ensure we always look down the street
        cam.lookAt(cam.position.x * 0.5, cam.position.y * 0.5, cam.position.z - 20);
        
        renderer.render(scene, cam);
    })();
})();

/* ===================== ABOUT MINI-SCENE ===================== */
(function initAbout() {
    const canvas = document.getElementById("about-canvas");
    if(!canvas) return;
    if (!canvas) return;
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
    const sl = new THREE.SpotLight(0x4488ff, 40, 12, 0.4);
    sl.position.set(3, 4, 4);
    scene.add(sl);
    const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.4, 0),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x2196f3,
            emissiveIntensity: 0.6,
            roughness: 0.1,
            metalness: 0.9,
            wireframe: false,
        }),
    );
    const icoWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.42, 0),
        new THREE.MeshBasicMaterial({
            color: 0x90caf9,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        }),
    );
    scene.add(ico, icoWire);
    const clock = new THREE.Clock();
    let hovered = false;
    canvas.addEventListener("mouseenter", () => (hovered = true));
    canvas.addEventListener("mouseleave", () => (hovered = false));
    (function a() {
        requestAnimationFrame(a);
        const t = clock.getElapsedTime();
        ico.rotation.y = t * 0.4;
        ico.rotation.x = t * 0.2;
        icoWire.rotation.y = t * 0.4;
        icoWire.rotation.x = t * 0.2;
        ico.scale.setScalar(1 + 0.04 * Math.sin(t * 2));
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
        <div class="center-content">
            <div class="center-logo">${ev.logo}</div>
            <div class="center-title">${ev.title}</div>
            <div class="event-tagline" style="margin-bottom: 12px; display:block;">${ev.tagline}</div>
            <div class="center-desc">${ev.desc}</div>
            ${rulesHtml}
            <div style="margin-top: 24px;">
                <button class="btn-primary" onclick="window.location.href='register.html'">REGISTER FOR THIS</button>
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
