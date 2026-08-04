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
        if (prefix === "â‚¹") {
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
        link: document.getElementById("f-link").value.trim() || "â€”",
        event: document.getElementById("f-event").value,
        teamSize: document.querySelector('input[name="teamsize"]:checked').value,
        teammateName: document.getElementById("f-teammate").value.trim() || "â€”",
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
    logo: "ðŸ“„",
    tagline: "Ink Meets Innovation",
    desc: "Showcase your research and innovative ideas before a panel of expert judges. Present a technical paper on any topic in Electronics, Communication, or Emerging Technologies. Defend your data, impress the jury.",
    rules: ["Team size: 1â€“2 members", "IEEE-format report + PPT required", "10 min presentation + 5 min Q&A", "Plagiarism must be below 20%"]
  },
  {
    title: "PROJECT EXPO",
    logo: "âš™ï¸",
    tagline: "Build It. Show It. Own It.",
    desc: "Bring your hardware or software masterpiece to the expo floor. Connect your circuits, boot your code, and let your prototype speak louder than any slide deck.",
    rules: ["Team size: 1â€“2 members", "Working prototype strongly preferred", "Judged: Innovation, Execution, Impact", "Abstract submission 3 days prior"]
  },
  {
    title: "CIRCUIT BREAKERS",
    logo: "âš¡",
    tagline: "Fault Found. Victory Claimed.",
    desc: "You have a broken circuit. A ticking clock. And your bare hands. Identify faults, rewire connections, and build working circuits from scratch under tournament pressure.",
    rules: ["Team size: 1â€“2 members", "Components and tools provided on-spot", "3 rounds: Fault ID â†’ Circuit Build â†’ Speed", "No phones or external datasheets"]
  },
  {
    title: "TECHNICAL QUIZ",
    logo: "ðŸ§ ",
    tagline: "Fast Buzzers. Sharp Minds.",
    desc: "From Maxwells equations to modern microcontrollers â€” how deep does your ECE knowledge run? A multi-round elimination battle covering core electronics and communication.",
    rules: ["Team size: 1â€“2 members", "4 rounds: Written â†’ Rapid fire â†’ Visual â†’ Buzzer", "Elimination after each round", "Topics: Analog, Digital, EDC, Signals"]
  },
  {
    title: "MINUTE TO WIN IT",
    logo: "â±ï¸",
    tagline: "60 Seconds of Chaos",
    desc: "Stack, balance, spin, and scramble â€” complete wild, prop-based challenges in under 60 seconds each. Simple rules. Impossible under pressure.",
    rules: ["Team size: 1â€“2 members", "Multiple knockout rounds", "All props provided on-site"]
  },
  {
    title: "DETECTIVE",
    logo: "ðŸ”",
    tagline: "The Clues Dont Lie. Can You?",
    desc: "A crime scene awaits. Evidence is scattered. Time is running out. Observe the scene, decode the clues, connect the dots, and name the culprit before other teams beat you to it.",
    rules: ["Team size: 1â€“2 members", "Points for correct culprit + fastest solve", "Red herrings included â€” trust nothing"]
  },
  {
    title: "BOX HUNT",
    logo: "ðŸ“¦",
    tagline: "Find the Box. Claim the Points.",
    desc: "Numbered boxes are hidden across the campus. A full-campus scavenger race where your speed, observation, and navigation skills determine your destiny.",
    rules: ["Team size: 1â€“2 members", "45-minute time limit", "Each box contains a code to submit"]
  },
  {
    title: "START MUSIC",
    logo: "ðŸŽµ",
    tagline: "Name It Before the Drop",
    desc: "The song starts. You have 5 seconds. A buzzer-based rapid-fire showdown where your playlist knowledge becomes your competitive edge.",
    rules: ["Team size: 1â€“2 members", "Buzzer system â€” first buzz answers", "Wrong answer = negative points"]
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
                    <button class="btn-primary" onclick="window.location.href='register.html'" style="transform: rotate(2deg); box-shadow: 4px 4px 0 #CC0000;">REGISTER NOW</button>
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
    tagline: "The Clues Dont Lie. Can You?",
    desc: "A crime scene awaits. Evidence is scattered. Time is running out. Observe the scene, decode the clues, connect the dots, and name the culprit before other teams beat you to it.",
    rules: ["Team size: 1â€“2 members", "Points for correct culprit + fastest solve", "Red herrings included â€” trust nothing"]
  },
  {
    title: "BOX HUNT",
    logo: "ðŸ“¦",
    tagline: "Find the Box. Claim the Points.",
    desc: "Numbered boxes are hidden across the campus. A full-campus scavenger race where your speed, observation, and navigation skills determine your destiny.",
    rules: ["Team size: 1â€“2 members", "45-minute time limit", "Each box contains a code to submit"]
  },
  {
    title: "START MUSIC",
    logo: "ðŸŽµ",
    tagline: "Name It Before the Drop",
    desc: "The song starts. You have 5 seconds. A buzzer-based rapid-fire showdown where your playlist knowledge becomes your competitive edge.",
    rules: ["Team size: 1â€“2 members", "Buzzer system â€” first buzz answers", "Wrong answer = negative points"]
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
                    <button class="btn-primary" onclick="window.location.href='register.html'" style="transform: rotate(2deg); box-shadow: 4px 4px 0 #CC0000;">REGISTER NOW</button>
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
    faqQuestions.forEach(function(question) {
        question.addEventListener("click", function() {
            var item = question.parentElement;
            var isActive = item.classList.contains("active");
            document.querySelectorAll(".faq-item").forEach(function(otherItem) {
                otherItem.classList.remove("active");
                var ans = otherItem.querySelector(".faq-answer");
                if(ans) ans.style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add("active");
                var answer = item.querySelector(".faq-answer");
                if(answer) answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});

// ===================== COUNTDOWN TIMER =====================
(function initCountdown() {
    var countDownDate = new Date("Sep 18, 2026 09:00:00").getTime();
    var daysEl = document.getElementById("cd-days");
    var hoursEl = document.getElementById("cd-hours");
    var minsEl = document.getElementById("cd-mins");
    var secsEl = document.getElementById("cd-secs");
    if(!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function updateTimer() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        if (distance < 0) {
            clearInterval(timerInt);
            daysEl.innerHTML = "00"; hoursEl.innerHTML = "00";
            minsEl.innerHTML = "00"; secsEl.innerHTML = "00";
            return;
        }
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        daysEl.innerHTML = days < 10 ? "0" + days : days;
        hoursEl.innerHTML = hours < 10 ? "0" + hours : hours;
        minsEl.innerHTML = minutes < 10 ? "0" + minutes : minutes;
        secsEl.innerHTML = seconds < 10 ? "0" + seconds : seconds;
    }
    updateTimer();
    var timerInt = setInterval(updateTimer, 1000);
})();

// ===================== NUMBER COUNTERS (fixed) =====================
document.addEventListener('DOMContentLoaded', function() {
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = +(el.dataset.count || 0);
            if (el.id === 'prize-count') target = 20000;
            if (!target) return;
            var prefix = el.dataset.prefix || '';
            var duration = 1800;
            var start = performance.now();
            function step(now) {
                var progress = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = prefix + Math.floor(eased * target).toLocaleString('en-IN');
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.stat-num[data-count]').forEach(function(el) {
        el.textContent = '0';
        counterObserver.observe(el);
    });
    var prizeEl = document.getElementById('prize-count');
    if (prizeEl) {
        prizeEl.textContent = '0';
        counterObserver.observe(prizeEl);
    }
});

// ===================== PARTICLE CURSOR TRAIL =====================
(function initCursorTrail() {
    var tc = document.createElement("canvas");
    tc.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;";
    document.body.appendChild(tc);
    var tctx = tc.getContext("2d");
    var tw = tc.width = window.innerWidth;
    var th = tc.height = window.innerHeight;
    window.addEventListener("resize", function() { tw = tc.width = window.innerWidth; th = tc.height = window.innerHeight; });
    var tparts = [];
    var tcolors = ["#CC0000","#ff4d4d","#ffffff","#ff0033"];
    var tmouse = { x: tw/2, y: th/2 };
    window.addEventListener("mousemove", function(e) {
        tmouse.x = e.clientX; tmouse.y = e.clientY;
        for(var i=0;i<3;i++) {
            tparts.push({ x:tmouse.x, y:tmouse.y,
                vx:(Math.random()-0.5)*4, vy:(Math.random()-0.5)*4,
                size:Math.random()*3+1,
                color:tcolors[Math.floor(Math.random()*tcolors.length)], life:1 });
        }
    });
    function trender() {
        tctx.clearRect(0,0,tw,th);
        for(var i=0;i<tparts.length;i++) {
            var p=tparts[i];
            tctx.globalAlpha=p.life; tctx.fillStyle=p.color;
            tctx.beginPath(); tctx.arc(p.x,p.y,p.size,0,Math.PI*2); tctx.fill();
            p.x+=p.vx; p.y+=p.vy; p.life-=0.02;
            if(p.life<=0){tparts.splice(i,1);i--;}
        }
        requestAnimationFrame(trender);
    }
    trender();
})();

