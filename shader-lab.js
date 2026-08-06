/**
 * ============================================================================
 * TECHNOKINGS 2K26 - WEBGL SHADER LAB (3.0.0)
 * Massive Custom Vanilla JS WebGL Generative Art Engine
 * ============================================================================
 * Compiles raw GLSL shaders at runtime to render a fluid, glowing spider-sense 
 * fractal background that reacts to time and mouse coordinates.
 */

class ShaderLab {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'shader-lab-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.zIndex = '-2'; // Behind everything
        this.canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(this.canvas);
        
        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) {
            console.warn("WebGL not supported. ShaderLab aborted.");
            return;
        }

        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        this.fragmentShaderSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;

            // Fractal noise generator
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                           mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
            }
            
            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                for(int i = 0; i < 6; i++) {
                    value += amplitude * noise(p);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                uv.x *= u_resolution.x / u_resolution.y;

                // Mouse interaction distance
                vec2 m = u_mouse.xy / u_resolution.xy;
                m.x *= u_resolution.x / u_resolution.y;
                float dist = distance(uv, m);

                // Spider-sense fluid distortion
                vec2 q = vec2(0.);
                q.x = fbm(uv + 0.00 * u_time);
                q.y = fbm(uv + vec2(1.0));
                
                vec2 r = vec2(0.);
                r.x = fbm(uv + 1.0 * q + vec2(1.7,9.2) + 0.15 * u_time);
                r.y = fbm(uv + 1.0 * q + vec2(8.3,2.8) + 0.126 * u_time);
                
                float f = fbm(uv + r);
                
                // Colors - Dark blacks and glowing Spider-Man reds
                vec3 color = mix(
                    vec3(0.02, 0.02, 0.03),
                    vec3(0.6, 0.0, 0.0),
                    clamp((f*f)*4.0, 0.0, 1.0)
                );
                
                color = mix(
                    color,
                    vec3(0.9, 0.1, 0.1),
                    clamp(length(q), 0.0, 1.0)
                );
                
                // Add mouse interaction glow
                float mouseGlow = smoothstep(0.4, 0.0, dist) * 0.5;
                color += vec3(0.8, 0.0, 0.0) * mouseGlow;
                
                // Vignette
                float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
                vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
                color *= vignette;

                gl_FragColor = vec4(color * 0.4, 1.0); // Keep it dim
            }
        `;

        this.initGL();
        this.initEventListeners();
        this.render();
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("Shader compile error: ", this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    initGL() {
        const vs = this.compileShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
        const fs = this.compileShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vs);
        this.gl.attachShader(this.program, fs);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error("Program link error: ", this.gl.getProgramInfoLog(this.program));
            return;
        }

        this.gl.useProgram(this.program);

        // Quad spanning screen
        const vertices = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0
        ]);

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const posAttr = this.gl.getAttribLocation(this.program, "position");
        this.gl.enableVertexAttribArray(posAttr);
        this.gl.vertexAttribPointer(posAttr, 2, this.gl.FLOAT, false, 0, 0);

        this.resUniform = this.gl.getUniformLocation(this.program, "u_resolution");
        this.timeUniform = this.gl.getUniformLocation(this.program, "u_time");
        this.mouseUniform = this.gl.getUniformLocation(this.program, "u_mouse");

        this.resize();
    }

    resize() {
        const isMobile = window.innerWidth < 768;
        const scale = isMobile ? 0.5 : 1;
        this.canvas.width = window.innerWidth * scale;
        this.canvas.height = window.innerHeight * scale;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.resUniform, this.canvas.width, this.canvas.height);
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            // Y is inverted in WebGL coords
            this.mouse.x = e.clientX;
            this.mouse.y = this.canvas.height - e.clientY;
        });
    }

    render() {
        this.time += 0.01;
        this.gl.uniform1f(this.timeUniform, this.time);
        this.gl.uniform2f(this.mouseUniform, this.mouse.x, this.mouse.y);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        requestAnimationFrame(() => this.render());
    }
}

// Inject on load
window.addEventListener('load', () => {
    window.SymposiumShaderLab = new ShaderLab();
});
