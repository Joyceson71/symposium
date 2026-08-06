
document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth > 768) {
        const tiltScript = document.createElement("script");
        tiltScript.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js";
        tiltScript.onload = () => {
            VanillaTilt.init(document.querySelectorAll(".event-card, .stat-card, .register-wrap, .skewed-container, .comic-panel"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3,
                scale: 1.05
            });
        };
        document.head.appendChild(tiltScript);
    }

    // 2. Spidey-Sense Radar Trail
    let lastX = 0;
    let lastY = 0;
    // 1. Spidey-Sense Trail Logic
    if (window.innerWidth > 768) {
        document.addEventListener("mousemove", (e) => {
            if (document.body.classList.contains("spidey-sense-active")) {
                if (Math.random() > 0.8) {
                    const trail = document.createElement("div");
                    trail.className = "spidey-sense-trail";
                    trail.style.left = e.clientX + "px";
                    trail.style.top = e.clientY + "px";
                    // Randomize colors between red and blue
                    trail.style.color = "#cc0000";
                    document.body.appendChild(trail);
                    setTimeout(() => trail.remove(), 1000);
                }
            }
        });
    }

    // 2. Scroll Glitch Effect
    let scrollTimeout;
    window.addEventListener("scroll", () => {
        const textElements = document.querySelectorAll(".graffiti-text");
        textElements.forEach(el => el.classList.add("scroll-glitch-active"));
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            textElements.forEach(el => el.classList.remove("scroll-glitch-active"));
        }, 150);
    });

/* ===================== THE WALKMAN: AUDIO VISUALIZER ===================== */
let audioCtx;
let analyzer;
let audioEl;
let beatInterval;
let isPlaying = false;

const playBtn = document.getElementById('walkman-play');
const pauseBtn = document.getElementById('walkman-pause');
const audioCanvas = document.getElementById('audio-visualizer');
const aCtx = audioCanvas ? audioCanvas.getContext('2d') : null;

function resizeVisualizer() {
    if(audioCanvas) {
        audioCanvas.width = audioCanvas.parentElement.offsetWidth;
        audioCanvas.height = audioCanvas.parentElement.offsetHeight;
    }
}
window.addEventListener('resize', resizeVisualizer);
resizeVisualizer();

function startSynthBeat() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyzer = audioCtx.createAnalyser();
        analyzer.fftSize = 64;
        
        // Load a cool lo-fi hip-hop track
        audioEl = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3');
        audioEl.crossOrigin = "anonymous";
        audioEl.loop = true;
        
        const source = audioCtx.createMediaElementSource(audioEl);
        source.connect(analyzer);
        analyzer.connect(audioCtx.destination);
    }
    
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    audioEl.play();
    isPlaying = true;
    
    // Simulate beat bump event for 3D elements
    if(!beatInterval) {
        beatInterval = setInterval(() => {
            if(isPlaying) {
                window.dispatchEvent(new CustomEvent('beat-bump'));
            }
        }, 500); // 120 BPM
    }
}

function stopAudio() {
    if(audioEl) {
        audioEl.pause();
    }
    isPlaying = false;
}

if(playBtn && pauseBtn) {
    playBtn.addEventListener('click', () => {
        isPlaying = true;
        startSynthBeat();
        visualize();
        playBtn.style.color = '#0ff';
        pauseBtn.style.color = '#fff';
    });
    
    pauseBtn.addEventListener('click', () => {
        stopAudio();
        playBtn.style.color = '#fff';
        pauseBtn.style.color = '#f00';
    });
}

function visualize() {
    if (!isPlaying || !aCtx || !analyzer) return;
    requestAnimationFrame(visualize);
    
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);
    
    aCtx.fillStyle = '#000';
    aCtx.fillRect(0, 0, audioCanvas.width, audioCanvas.height);
    
    const barWidth = (audioCanvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        aCtx.fillStyle = `rgb(${barHeight + 100}, 0, 255)`;
        aCtx.fillRect(x, audioCanvas.height - barHeight/2, barWidth, barHeight/2);
        
        x += barWidth + 1;
    }
}

/* ===================== EASTER EGG UI LOGIC ===================== */
function showEasterEgg() {
    const modal = document.getElementById("easter-egg-modal");
    if(modal) {
        modal.classList.remove("hidden");
        // Trigger glitch effect on body
        document.body.classList.add("scroll-glitch-active");
        setTimeout(() => document.body.classList.remove("scroll-glitch-active"), 1000);
    }
}

function closeEasterEgg() {
    const modal = document.getElementById("easter-egg-modal");
    if(modal) {
        modal.classList.add("hidden");
    }
}

    // 4. Web-Sling Page Transition Overlay
    const overlay = document.createElement("div");
    overlay.id = "web-transition-overlay";
    overlay.innerHTML = '<div class="transition-spider-logo"></div>';
    document.body.appendChild(overlay);

    // Intercept links
    document.querySelectorAll("a").forEach(link => {
        if (link.href && link.href.includes(".html") && !link.target) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                overlay.classList.add("active");
                setTimeout(() => {
                    window.location.href = link.href;
                }, 600);
            });
        }
    });

    // Slide out overlay on page load
    setTimeout(() => {
        overlay.classList.remove("active");
    }, 100);
    
    // 5. Add random graffiti splatters
    const sections = document.querySelectorAll("section");
    sections.forEach(sec => {
        if(Math.random() > 0.3) {
            const splatter = document.createElement("div");
            splatter.className = "graffiti-splatter";
            splatter.style.left = (Math.random() * 80) + "%";
            splatter.style.top = (Math.random() * 80) + "%";
            // Randomize color between red and cyan
            if(Math.random() > 0.5) {
                splatter.style.background = "radial-gradient(circle, rgba(204,0,0,0.4) 0%, transparent 60%)";
            }
            sec.appendChild(splatter);
        }
    });
});
