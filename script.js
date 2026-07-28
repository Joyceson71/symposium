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
        document.getElementById("loader").style.opacity = "0";
        setTimeout(
            () => (document.getElementById("loader").style.display = "none"),
            800,
        );
    }, 2800);
});

/* ===================== NAVBAR ===================== */
window.addEventListener("scroll", () => {
    document
        .getElementById("navbar")
        .classList.toggle("scrolled", window.scrollY > 80);
});
function scrollToReg() {
    document.getElementById("register").scrollIntoView({ behavior: "smooth" });
}
function toggleMenu() {
    const m = document.getElementById("mobile-menu");
    m.classList.toggle("open");
}

/* ===================== HERO 3D CANVAS ===================== */
(function initHero() {
    const canvas = document.getElementById("hero-canvas");
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 8, 22);
    const cam = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
    );
    cam.position.set(0, 0, 9);

    /* LIGHTS */
    scene.add(new THREE.AmbientLight(0x110000, 0.5));
    const spot1 = new THREE.SpotLight(0xff1a1a, 80, 20, 0.3, 1);
    spot1.position.set(5, 8, 5);
    scene.add(spot1);
    const spot2 = new THREE.SpotLight(0xcc0000, 30, 15);
    spot2.position.set(-5, -4, 3);
    scene.add(spot2);

    /* SPIDER WEB */
    const webGroup = new THREE.Group();
    const radials = 12,
        rings = 7,
        radius = 6;
    const mat = new THREE.LineBasicMaterial({
        color: 0xcc0000,
        transparent: true,
        opacity: 0.6,
    });
    for (let i = 0; i < radials; i++) {
        const a = ((Math.PI * 2) / radials) * i;
        const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0),
        ]);
        webGroup.add(new THREE.Line(geo, mat));
    }
    for (let r = 1; r <= rings; r++) {
        const pts = [];
        for (let i = 0; i <= radials; i++) {
            const a = ((Math.PI * 2) / radials) * i;
            const rr = (radius / rings) * r;
            pts.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, 0));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        webGroup.add(new THREE.Line(geo, mat));
    }
    webGroup.position.z = -3;
    scene.add(webGroup);

    /* CENTRAL ORB */
    const orbGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({
        color: 0xcc0000,
        emissive: 0xff1a1a,
        emissiveIntensity: 1.2,
        roughness: 0,
        metalness: 0.9,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orb);
    const orbLight = new THREE.PointLight(0xff1a1a, 6, 8);
    orb.add(orbLight);

    /* PARTICLES */
    const count = window.innerWidth < 768 ? 600 : 2500;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2,
            phi = Math.acos(2 * Math.random() - 1),
            r = 2 + Math.random() * 10;
        pos[i] = r * Math.sin(phi) * Math.cos(theta);
        pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i + 2] = r * Math.cos(phi);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0xcc0000,
        size: 0.04,
        transparent: true,
        opacity: 0.7,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* RINGS */
    const r1Mat = new THREE.MeshStandardMaterial({
        color: 0xcc0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.012, 16, 100),
        r1Mat,
    );
    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(4.8, 0.008, 16, 100),
        r1Mat,
    );
    scene.add(ring1, ring2);

    /* MOUSE */
    let mouseX = 0,
        mouseY = 0;
    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
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
        webGroup.rotation.y = t * 0.05;
        webGroup.rotation.z = t * 0.02;
        orb.scale.setScalar(0.95 + 0.07 * Math.sin(t * 1.5));
        orbMat.emissiveIntensity = 1.0 + 0.4 * Math.sin(t * 2);
        r1Mat.emissiveIntensity = 0.4 + 0.3 * Math.sin(t * 1.2);
        ring1.rotation.x = t * 0.3;
        ring1.rotation.y = t * 0.2;
        ring2.rotation.x = -t * 0.2;
        ring2.rotation.z = t * 0.15;
        particles.rotation.y += 0.0005;
        particles.rotation.x = mouseY * 0.05;
        particles.rotation.z = mouseX * 0.03;
        cam.position.x += (mouseX * 0.5 - cam.position.x) * 0.03;
        cam.position.y += (mouseY * 0.3 - cam.position.y) * 0.03;
        cam.lookAt(scene.position);
        renderer.render(scene, cam);
    })();
})();

/* ===================== ABOUT MINI-SCENE ===================== */
(function initAbout() {
    const canvas = document.getElementById("about-canvas");
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
    scene.add(new THREE.AmbientLight(0x220000, 1));
    const sl = new THREE.SpotLight(0xff1a1a, 40, 12, 0.4);
    sl.position.set(3, 4, 4);
    scene.add(sl);
    const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.4, 0),
        new THREE.MeshStandardMaterial({
            color: 0xcc0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.6,
            roughness: 0.1,
            metalness: 0.9,
            wireframe: false,
        }),
    );
    const icoWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.42, 0),
        new THREE.MeshBasicMaterial({
            color: 0xff4444,
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
    document.getElementById("cd-days").textContent = String(d).padStart(2, "0");
    document.getElementById("cd-hours").textContent = String(h).padStart(2, "0");
    document.getElementById("cd-mins").textContent = String(m).padStart(2, "0");
    document.getElementById("cd-secs").textContent = String(s).padStart(2, "0");
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ===================== PRIZE PARTICLE RAIN ===================== */
(function initPrize() {
    const canvas = document.getElementById("prize-canvas");
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
prizeObs.observe(prizeSection);

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
    if (n < 3) {
        ["step-ind-" + 3, "step-ind-" + 2].slice(3 - n - 1).forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove("active", "done");
            }
        });
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
    if (step === 1) {
        let ok = true;
        const name = document.getElementById("f-name").value.trim();
        const dept = document.getElementById("f-dept").value.trim();
        const col = document.getElementById("f-college").value.trim();
        const email = document.getElementById("f-email").value.trim();
        const phone = document.getElementById("f-phone").value.trim();
        if (name.length < 3) {
            showErr("e-name", true);
            setFieldErr("f-name", true);
            ok = false;
        } else {
            showErr("e-name", false);
            setFieldErr("f-name", false);
        }
        if (dept.length < 2) {
            showErr("e-dept", true);
            setFieldErr("f-dept", true);
            ok = false;
        } else {
            showErr("e-dept", false);
            setFieldErr("f-dept", false);
        }
        if (col.length < 3) {
            showErr("e-college", true);
            setFieldErr("f-college", true);
            ok = false;
        } else {
            showErr("e-college", false);
            setFieldErr("f-college", false);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showErr("e-email", true);
            setFieldErr("f-email", true);
            ok = false;
        } else {
            showErr("e-email", false);
            setFieldErr("f-email", false);
        }
        if (!/^[6-9]\d{9}$/.test(phone)) {
            showErr("e-phone", true);
            setFieldErr("f-phone", true);
            ok = false;
        } else {
            showErr("e-phone", false);
            setFieldErr("f-phone", false);
        }
        return ok;
    }
    if (step === 2) {
        let ok = true;
        const evt = document.getElementById("f-event").value;
        if (!evt) {
            showErr("e-event", true);
            setFieldErr("f-event", true);
            ok = false;
        } else {
            showErr("e-event", false);
            setFieldErr("f-event", false);
        }
        const teamSize = document.querySelector(
            'input[name="teamsize"]:checked',
        ).value;
        if (teamSize === "2") {
            const tm = document.getElementById("f-teammate").value.trim();
            if (tm.length < 2) {
                showErr("e-teammate", true);
                setFieldErr("f-teammate", true);
                ok = false;
            } else {
                showErr("e-teammate", false);
                setFieldErr("f-teammate", false);
            }
        }
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
    if (!uploadedFile) {
        showErr("e-file", true);
        document.getElementById("e-file").textContent =
            "Please upload your payment screenshot";
        return;
    }
    showErr("e-file", false);
    const btn = document.getElementById("submit-btn");
    btn.textContent = "SUBMITTING...";
    btn.disabled = true;
    const formData = {
        name: document.getElementById("f-name").value.trim(),
        department: document.getElementById("f-dept").value.trim(),
        college: document.getElementById("f-college").value.trim(),
        email: document.getElementById("f-email").value.trim(),
        phone: document.getElementById("f-phone").value.trim(),
        event: document.getElementById("f-event").value,
        teamSize: document.querySelector('input[name="teamsize"]:checked').value,
        teammateName: document.getElementById("f-teammate").value.trim() || "—",
        paymentScreenshotName: uploadedFile.name,
    };
    /* Simulate API call - replace with actual fetch to /api/register */
    setTimeout(() => {
        btn.textContent = "SUBMIT REGISTRATION";
        btn.disabled = false;
        document.getElementById("success-name").textContent = formData.name
            .split(" ")[0]
            .toUpperCase();
        document.getElementById("success-event").textContent =
            formData.event.toUpperCase();
        document.getElementById("success-modal").classList.add("show");
        fireConfetti();
    }, 1800);
}

function closeSuccess() {
    document.getElementById("success-modal").classList.remove("show");
    document.getElementById("events").scrollIntoView({ behavior: "smooth" });
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
