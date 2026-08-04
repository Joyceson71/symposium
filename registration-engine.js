/**
 * ============================================================================
 * TECHNOKINGS 2K26 - REGISTRATION ENGINE (1.0.0)
 * Massive Custom Vanilla JS Form Validation & Dynamic Rendering Engine
 * ============================================================================
 */

class RegistrationEngine {
    constructor() {
        this.container = document.getElementById('registration-app');
        if(!this.container) return;
        
        this.state = {
            step: 1,
            maxSteps: 3,
            data: {
                teamName: '',
                leaderName: '',
                email: '',
                phone: '',
                college: '',
                selectedEvents: [],
                signature: null
            },
            errors: {}
        };
        
        this.events = [
            { id: 'paper-presentation', name: 'Paper Presentation', maxTeam: 2 },
            { id: 'project-expo', name: 'Project Expo', maxTeam: 4 },
            { id: 'circuit-breakers', name: 'Circuit Breakers', maxTeam: 2 },
            { id: 'technical-quiz', name: 'Technical Quiz', maxTeam: 2 },
            { id: 'minute-to-win-it', name: 'Minute to Win It', maxTeam: 1 },
            { id: 'detective', name: 'Detective', maxTeam: 3 },
            { id: 'box-hunt', name: 'Box Hunt', maxTeam: 2 },
            { id: 'start-music', name: 'Start Music', maxTeam: 1 }
        ];

        this.init();
    }

    init() {
        // Clear standard HTML
        this.container.innerHTML = '';
        this.container.classList.add('js-reg-engine');
        
        // Build structural DOM
        this.buildDOM();
        this.renderStep();
        this.bindEvents();
    }

    buildDOM() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'reg-wrapper';
        
        this.header = document.createElement('div');
        this.header.className = 'reg-header';
        
        this.progress = document.createElement('div');
        this.progress.className = 'reg-progress';
        
        this.body = document.createElement('div');
        this.body.className = 'reg-body';
        
        this.footer = document.createElement('div');
        this.footer.className = 'reg-footer';
        
        this.wrapper.appendChild(this.header);
        this.wrapper.appendChild(this.progress);
        this.wrapper.appendChild(this.body);
        this.wrapper.appendChild(this.footer);
        
        this.container.appendChild(this.wrapper);
    }

    renderStep() {
        // Animate out old content
        this.body.style.opacity = '0';
        this.body.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.body.innerHTML = '';
            
            if(this.state.step === 1) this.renderStep1();
            else if(this.state.step === 2) this.renderStep2();
            else if(this.state.step === 3) this.renderStep3();
            
            this.renderProgress();
            this.renderFooter();
            
            // Animate in new content
            requestAnimationFrame(() => {
                this.body.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                this.body.style.opacity = '1';
                this.body.style.transform = 'translateY(0)';
            });
        }, 300);
    }

    renderProgress() {
        this.progress.innerHTML = '';
        for(let i=1; i<=this.state.maxSteps; i++) {
            const dot = document.createElement('div');
            dot.className = `progress-dot ${i <= this.state.step ? 'active' : ''}`;
            this.progress.appendChild(dot);
        }
    }

    renderFooter() {
        this.footer.innerHTML = '';
        
        if (this.state.step > 1) {
            const backBtn = document.createElement('button');
            backBtn.className = 'btn-ghost';
            backBtn.innerText = 'BACK';
            backBtn.onclick = () => { this.state.step--; this.renderStep(); };
            this.footer.appendChild(backBtn);
        }
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-primary';
        nextBtn.innerText = this.state.step === this.state.maxSteps ? 'SUBMIT ALL' : 'NEXT PROTOCOL';
        nextBtn.onclick = () => this.handleNext();
        this.footer.appendChild(nextBtn);
    }

    handleNext() {
        if(this.validateCurrentStep()) {
            if(this.state.step < this.state.maxSteps) {
                this.state.step++;
                this.renderStep();
            } else {
                this.submitForm();
            }
        }
    }

    createInput(type, name, labelText, placeholder) {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        const label = document.createElement('label');
        label.innerText = labelText;
        
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.placeholder = placeholder;
        input.value = this.state.data[name] || '';
        
        const error = document.createElement('span');
        error.className = 'error-msg';
        error.id = `error-${name}`;
        
        // Real-time validation
        input.addEventListener('input', (e) => {
            this.state.data[name] = e.target.value;
            this.realTimeValidate(name, e.target.value);
        });
        
        group.appendChild(label);
        group.appendChild(input);
        group.appendChild(error);
        return group;
    }

    renderStep1() {
        this.header.innerHTML = '<h2>PHASE 1: IDENTIFICATION</h2><p>Initialize team parameters.</p>';
        this.body.appendChild(this.createInput('text', 'teamName', 'TEAM DESIGNATION', 'Enter unique team name'));
        this.body.appendChild(this.createInput('text', 'leaderName', 'LEADER ALIAS', 'Enter full name'));
        this.body.appendChild(this.createInput('email', 'email', 'COMM-LINK (EMAIL)', 'spider@web.com'));
        this.body.appendChild(this.createInput('tel', 'phone', 'SECURE FREQUENCY (PHONE)', '+91 XXXXX XXXXX'));
    }

    renderStep2() {
        this.header.innerHTML = '<h2>PHASE 2: MISSION SELECT</h2><p>Select your deployment zones.</p>';
        
        const grid = document.createElement('div');
        grid.className = 'event-select-grid';
        
        this.events.forEach(ev => {
            const card = document.createElement('div');
            card.className = `event-select-card ${this.state.data.selectedEvents.includes(ev.id) ? 'selected' : ''}`;
            card.innerHTML = `<h3>${ev.name}</h3><p>Max Squad: ${ev.maxTeam}</p>`;
            
            card.onclick = () => {
                if(this.state.data.selectedEvents.includes(ev.id)) {
                    this.state.data.selectedEvents = this.state.data.selectedEvents.filter(id => id !== ev.id);
                    card.classList.remove('selected');
                } else {
                    this.state.data.selectedEvents.push(ev.id);
                    card.classList.add('selected');
                }
            };
            grid.appendChild(card);
        });
        
        const error = document.createElement('div');
        error.id = 'error-events';
        error.className = 'error-msg';
        
        this.body.appendChild(grid);
        this.body.appendChild(error);
    }

    renderStep3() {
        this.header.innerHTML = '<h2>PHASE 3: AUTHORIZATION</h2><p>Digital signature required for deployment.</p>';
        
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'signature-container';
        
        const canvas = document.createElement('canvas');
        canvas.id = 'signature-pad';
        canvas.width = 400;
        canvas.height = 200;
        
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn-ghost signature-clear';
        clearBtn.innerText = 'CLEAR PAD';
        
        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(clearBtn);
        
        this.body.appendChild(canvasContainer);
        
        // Init signature drawing logic
        setTimeout(() => this.initSignaturePad(canvas, clearBtn), 100);
    }

    initSignaturePad(canvas, clearBtn) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        canvas.addEventListener('mousedown', e => {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });
        
        canvas.addEventListener('mousemove', e => {
            if(!isDrawing) return;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        });
        
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            this.state.data.signature = canvas.toDataURL();
        });
        
        clearBtn.onclick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.state.data.signature = null;
        };
    }

    realTimeValidate(field, value) {
        const errEl = document.getElementById(`error-${field}`);
        let msg = '';
        if(field === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) msg = 'Invalid email frequency detected.';
        if(field === 'phone' && value.length < 10) msg = 'Signal too weak (min 10 digits).';
        
        if(msg) errEl.innerText = msg;
        else errEl.innerText = '';
    }

    validateCurrentStep() {
        let valid = true;
        if(this.state.step === 1) {
            ['teamName', 'leaderName', 'email', 'phone'].forEach(f => {
                if(!this.state.data[f]) {
                    document.getElementById(`error-${f}`).innerText = 'Data missing.';
                    valid = false;
                }
            });
            if(document.getElementById('error-email').innerText) valid = false;
        }
        if(this.state.step === 2) {
            if(this.state.data.selectedEvents.length === 0) {
                document.getElementById('error-events').innerText = 'You must select at least one deployment zone.';
                valid = false;
            } else {
                document.getElementById('error-events').innerText = '';
            }
        }
        if(this.state.step === 3) {
            if(!this.state.data.signature) {
                alert("AUTHORIZATION DENIED: Signature Required.");
                valid = false;
            }
        }
        return valid;
    }

    submitForm() {
        this.container.innerHTML = `
            <div class="success-screen">
                <h2>DEPLOYMENT AUTHORIZED</h2>
                <div class="spider-logo-spin">🕷️</div>
                <p>Welcome to the Spider-Verse, ${this.state.data.leaderName}.</p>
                <button class="btn-primary" onclick="window.location.reload()">RETURN TO BASE</button>
            </div>
        `;
        // In a real app, send this.state.data to server here via fetch()
    }
}

// Bind to DOM
document.addEventListener("DOMContentLoaded", () => {
    new RegistrationEngine();
});
