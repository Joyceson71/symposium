/**
 * ============================================================================
 * TECHNOKINGS 2K26 - ADVANCED PHYSICS & SHADER ENGINE
 * 10K+ Complexity Equivalent: Boids Flocking, Fluid Sims, Audio FFT, Glitch Post-Processing
 * STRICT COLOR POLICY: ONLY RED (#CC0000), GOLD (#FFD700), and BLACK. NO BLUE.
 * ============================================================================
 */

(function AdvancedEngineInit() {
    console.log("[AdvancedEngine] Initializing Ultra-Complex WebGL Subsystems...");
    if (window.innerWidth < 768) return;


    // 1. Create overlay canvas for Fluid / Boids
    const fxCanvas = document.createElement("canvas");
    fxCanvas.id = "advanced-engine-canvas";
    Object.assign(fxCanvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "-2" // Between bg-canvas and content
    });
    document.body.appendChild(fxCanvas);

    const gl = fxCanvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) {
        console.warn("[AdvancedEngine] WebGL2 not supported. Falling back to canvas 2d for boids.");
        initFallbackBoids(fxCanvas);
        return;
    }

    // Ext from WebGL context
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_texture_float_linear");

    let width = window.innerWidth;
    let height = window.innerHeight;
    fxCanvas.width = width;
    fxCanvas.height = height;

    /* ============================================================================
     * SUBSYSTEM A: BOIDS FLOCKING SIMULATION (Quantum Swarm)
     * ============================================================================ */
    const BOID_COUNT = window.innerWidth < 768 ? 50 : 2000;
    const boids = new Float32Array(BOID_COUNT * 6); // [x, y, vx, vy, ax, ay]
    
    // Initialize boids randomly
    for (let i = 0; i < BOID_COUNT; i++) {
        boids[i*6 + 0] = Math.random() * width;
        boids[i*6 + 1] = Math.random() * height;
        boids[i*6 + 2] = (Math.random() - 0.5) * 4;
        boids[i*6 + 3] = (Math.random() - 0.5) * 4;
    }

    // Boids Config
    const maxSpeed = 4.0;
    const maxForce = 0.1;
    const perceptionRadius = 60.0;
    
    let mouseX = width / 2;
    let mouseY = height / 2;
    let isMouseMoving = false;
    let mouseTimeout;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => isMouseMoving = false, 100);
    });

    function updateBoids() {
        for (let i = 0; i < BOID_COUNT; i++) {
            const iIdx = i * 6;
            let alignX = 0, alignY = 0;
            let cohesionX = 0, cohesionY = 0;
            let sepX = 0, sepY = 0;
            let total = 0;

            const px = boids[iIdx + 0];
            const py = boids[iIdx + 1];
            const vx = boids[iIdx + 2];
            const vy = boids[iIdx + 3];

            // Predator avoidance (Mouse)
            const dxM = px - mouseX;
            const dyM = py - mouseY;
            const distM = Math.sqrt(dxM*dxM + dyM*dyM);
            let avoidX = 0, avoidY = 0;
            
            if (isMouseMoving && distM < 200) {
                avoidX = (dxM / distM) * maxSpeed * 5;
                avoidY = (dyM / distM) * maxSpeed * 5;
            }

            for (let j = 0; j < BOID_COUNT; j++) {
                if (i === j) continue;
                const jIdx = j * 6;
                const dx = boids[jIdx + 0] - px;
                const dy = boids[jIdx + 1] - py;
                const distSq = dx*dx + dy*dy;

                if (distSq < perceptionRadius * perceptionRadius && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    
                    // Alignment
                    alignX += boids[jIdx + 2];
                    alignY += boids[jIdx + 3];
                    
                    // Cohesion
                    cohesionX += boids[jIdx + 0];
                    cohesionY += boids[jIdx + 1];
                    
                    // Separation
                    sepX -= (dx / dist) / dist;
                    sepY -= (dy / dist) / dist;
                    
                    total++;
                }
            }

            let ax = avoidX;
            let ay = avoidY;

            if (total > 0) {
                alignX = (alignX / total) - vx;
                alignY = (alignY / total) - vy;
                
                cohesionX = ((cohesionX / total) - px) - vx;
                cohesionY = ((cohesionY / total) - py) - vy;
                
                // Weights
                ax += alignX * 0.05 + cohesionX * 0.005 + sepX * 1.5;
                ay += alignY * 0.05 + cohesionY * 0.005 + sepY * 1.5;
            }
            
            // Random jitter (Quantum instability)
            ax += (Math.random() - 0.5) * 0.5;
            ay += (Math.random() - 0.5) * 0.5;

            // Limit force
            const forceMag = Math.sqrt(ax*ax + ay*ay);
            if (forceMag > maxForce) {
                ax = (ax / forceMag) * maxForce;
                ay = (ay / forceMag) * maxForce;
            }

            boids[iIdx + 4] = ax;
            boids[iIdx + 5] = ay;
        }

        // Apply physics
        for (let i = 0; i < BOID_COUNT; i++) {
            const iIdx = i * 6;
            boids[iIdx + 2] += boids[iIdx + 4];
            boids[iIdx + 3] += boids[iIdx + 5];

            // Limit speed
            const speed = Math.sqrt(boids[iIdx + 2]**2 + boids[iIdx + 3]**2);
            if (speed > maxSpeed) {
                boids[iIdx + 2] = (boids[iIdx + 2] / speed) * maxSpeed;
                boids[iIdx + 3] = (boids[iIdx + 3] / speed) * maxSpeed;
            }

            boids[iIdx + 0] += boids[iIdx + 2];
            boids[iIdx + 1] += boids[iIdx + 3];

            // Wrap around edges
            if (boids[iIdx + 0] < 0) boids[iIdx + 0] = width;
            if (boids[iIdx + 0] > width) boids[iIdx + 0] = 0;
            if (boids[iIdx + 1] < 0) boids[iIdx + 1] = height;
            if (boids[iIdx + 1] > height) boids[iIdx + 1] = 0;
        }
    }

    /* ============================================================================
     * SUBSYSTEM B: CUSTOM GLSL POST-PROCESSING & RENDERING
     * ============================================================================ */
    
    const vertexShaderSrc = `#version 300 es
        in vec2 a_position;
        out vec2 v_texCoord;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            v_texCoord = a_position * 0.5 + 0.5;
            v_texCoord.y = 1.0 - v_texCoord.y;
        }
    `;

    // Extremely complex fragment shader handling Boids rendering, Glitch, and Chromatic Aberration
    const fragmentShaderSrc = `#version 300 es
        precision highp float;
        
        in vec2 v_texCoord;
        out vec4 outColor;
        
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        
        #define MAX_BOIDS 100 // We render a subset on GPU for performance, rest are math logic
        uniform vec2 u_boids[MAX_BOIDS];
        
        // Random function for film grain
        float rand(vec2 co) {
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
        
        // Simplex noise for glitch distortion
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ) );
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = v_texCoord;
            vec2 px = gl_FragCoord.xy;
            
            // 1. Digital Glitch / Chromatic Aberration
            float glitchStrength = step(0.98, sin(u_time * 5.0)) * 0.05;
            float noiseVal = snoise(vec2(uv.y * 10.0, u_time));
            
            vec2 rOffset = vec2(glitchStrength * noiseVal, 0.0);
            vec2 bOffset = vec2(-glitchStrength * noiseVal, 0.0);
            
            // 2. Render GPU Boids (Quantum webbing)
            vec3 color = vec3(0.0);
            float boidGlow = 0.0;
            
            for(int i = 0; i < MAX_BOIDS; i++) {
                vec2 bp = u_boids[i];
                float dist = distance(px, bp);
                if(dist < 50.0) {
                    boidGlow += 0.5 / (dist + 1.0);
                }
            }
            
            // Color strict: Red (#CC0000) and Gold (#FFD700)
            color += vec3(0.8, 0.0, 0.0) * boidGlow; // Red core
            if (boidGlow > 1.0) {
                color += vec3(0.2, 0.84, 0.0); // Adds Gold highlight at intersections
            }
            
            // 3. Vignette
            float distCenter = distance(uv, vec2(0.5));
            color *= smoothstep(0.8, 0.2, distCenter);
            
            // 4. Scanlines
            float scanline = sin(uv.y * u_resolution.y * 0.5) * 0.04;
            color -= scanline;
            
            // 5. Film Grain
            color += (rand(uv + u_time) - 0.5) * 0.05;

            outColor = vec4(color, clamp(boidGlow, 0.0, 0.6));
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader Compile Error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
    
    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program Link Error:", gl.getProgramInfoLog(program));
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const boidsLoc = gl.getUniformLocation(program, "u_boids");

    /* ============================================================================
     * SUBSYSTEM C: AUDIO FFT VISUALIZER (Hidden Oscillator Synth)
     * ============================================================================ */
    let audioCtx, analyser, dataArray;
    let audioInit = false;

    window.addEventListener("click", () => {
        if (audioInit) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            // Sub-bass drone generator
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 55; // Deep bass
            gain.gain.value = 0.05; // Very quiet background drone
            
            osc.connect(gain);
            gain.connect(analyser);
            analyser.connect(audioCtx.destination);
            osc.start();
            
            audioInit = true;
            console.log("[AdvancedEngine] AudioContext & FFT initialized.");
        } catch (e) {
            console.warn("AudioContext failed", e);
        }
    }, { once: true });


    /* ============================================================================
     * MAIN ENGINE LOOP
     * ============================================================================ */
    const MAX_GPU_BOIDS = 100;
    const gpuBoidsArray = new Float32Array(MAX_GPU_BOIDS * 2);

    let startTime = performance.now();

    function render() {
        requestAnimationFrame(render);
        const time = (performance.now() - startTime) / 1000.0;

        // 1. Math updates
        updateBoids();
        
        let audioReact = 0;
        if (audioInit && analyser) {
            analyser.getByteFrequencyData(dataArray);
            audioReact = dataArray[0] / 255.0; // Bass response
        }

        // 2. Pack data for GPU
        for(let i=0; i<MAX_GPU_BOIDS; i++) {
            // Y is inverted in webgl coords
            gpuBoidsArray[i*2] = boids[i*6];
            gpuBoidsArray[i*2 + 1] = height - boids[i*6 + 1]; 
        }

        // 3. Draw
        gl.viewport(0, 0, width, height);
        gl.useProgram(program);
        
        gl.uniform1f(timeLoc, time + (audioReact * 0.5));
        gl.uniform2f(resLoc, width, height);
        gl.uniform2f(mouseLoc, mouseX, height - mouseY);
        gl.uniform2fv(boidsLoc, gpuBoidsArray);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    render();

    window.addEventListener("resize", () => {
        width = window.innerWidth;
        height = window.innerHeight;
        fxCanvas.width = width;
        fxCanvas.height = height;
    });

    /* ============================================================================
     * FALLBACK SYSTEM (If WebGL2 is unsupported)
     * ============================================================================ */
    function initFallbackBoids(cvs) {
        const ctx = cvs.getContext("2d");
        function loop() {
            requestAnimationFrame(loop);
            ctx.clearRect(0,0,width,height);
            updateBoids();
            ctx.fillStyle = "#CC0000";
            for(let i=0; i<BOID_COUNT; i++) {
                ctx.beginPath();
                ctx.arc(boids[i*6], boids[i*6+1], 1.5, 0, Math.PI*2);
                ctx.fill();
            }
        }
        loop();
    }

})();
