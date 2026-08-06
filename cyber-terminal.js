/**
 * ============================================================================
 * TECHNOKINGS 2K26 - CYBERPUNK TERMINAL OS
 * Pure JavaScript implementation with inline CSS styling engine
 * ============================================================================
 */

class FileSystem {
    constructor() {
        this.root = {
            'sys': {
                'core.log': 'SYSTEM BOOT: OK\nMEMORY: 64TB\nAI: ACTIVE',
                'glitch.exe': 'EXECUTABLE: Run to initiate system overload.',
                'security.cfg': 'ACCESS LEVEL: OMNI\nFIREWALL: DISABLED'
            },
            'events': {
                'hackathon.txt': 'Date: Sep 18\nPrize: 10,000\nStatus: Registering',
                'robowars.txt': 'Status: Arena prep complete. Awaiting combatants.'
            },
            'secret': {
                'message.txt': 'You found the hidden terminal. Welcome to the underground.',
                'spider.dat': 'CLASSIFIED: Prowler tech detected in sector 4.'
            }
        };
        this.cwd = ['root'];
    }

    getDir(pathArray) {
        let current = this;
        for (let i = 1; i < pathArray.length; i++) { // Skip 'root'
            if (current[pathArray[i]]) {
                current = current[pathArray[i]];
            } else {
                return null;
            }
        }
        return current;
    }

    getCurrentDir() {
        let current = this.root;
        for (let i = 1; i < this.cwd.length; i++) {
            current = current[this.cwd[i]];
        }
        return current;
    }
}

class TerminalUI {
    constructor() {
        this.isVisible = false;
        this.history = [];
        this.historyIndex = -1;
        this.fs = new FileSystem();
        
        this.buildDOM();
        this.bindEvents();
        this.printLine("TECHNOKINGS 2K26 // OMNI-OS v1.0", "#FFD700");
        this.printLine("Type 'help' for a list of commands.", "#aaaaaa");
    }

    buildDOM() {
        // Container
        this.container = document.createElement('div');
        this.applyStyles(this.container, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 5, 5, 0.95)',
            zIndex: '9999',
            fontFamily: '"Courier New", Courier, monospace',
            color: '#cc0000',
            padding: '20px',
            boxSizing: 'border-box',
            display: 'none',
            flexDirection: 'column',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        // Scanline effect
        this.scanline = document.createElement('div');
        this.applyStyles(this.scanline, {
            position: 'absolute',
            top: '0', left: '0', width: '100%', height: '100%',
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 4px, 3px 100%',
            pointerEvents: 'none',
            zIndex: '10000'
        });
        this.container.appendChild(this.scanline);

        // Output Area
        this.outputDiv = document.createElement('div');
        this.applyStyles(this.outputDiv, {
            flexGrow: '1',
            overflowY: 'auto',
            marginBottom: '10px',
            textShadow: '0 0 5px rgba(204, 0, 0, 0.5)',
            fontSize: '16px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
        });
        this.container.appendChild(this.outputDiv);

        // Input Line
        this.inputWrapper = document.createElement('div');
        this.applyStyles(this.inputWrapper, {
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            color: '#cc0000'
        });

        this.promptSpan = document.createElement('span');
        this.promptSpan.innerText = 'user@tk26:~$ ';
        this.applyStyles(this.promptSpan, {
            marginRight: '10px',
            fontWeight: 'bold',
            textShadow: '0 0 5px rgba(204, 0, 0, 0.5)'
        });
        this.inputWrapper.appendChild(this.promptSpan);

        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.applyStyles(this.inputField, {
            flexGrow: '1',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#cc0000',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '16px',
            textShadow: '0 0 5px rgba(204, 0, 0, 0.5)'
        });
        this.inputWrapper.appendChild(this.inputField);

        this.container.appendChild(this.inputWrapper);
        document.body.appendChild(this.container);
    }

    applyStyles(element, styles) {
        for (const [key, value] of Object.entries(styles)) {
            element.style[key] = value;
        }
    }

    toggle() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.container.style.display = 'flex';
            setTimeout(() => {
                this.container.style.opacity = '1';
                this.inputField.focus();
            }, 10);
            document.body.style.overflow = 'hidden';
        } else {
            this.container.style.opacity = '0';
            setTimeout(() => {
                this.container.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        }
    }

    printLine(text, color = '#cc0000') {
        const line = document.createElement('div');
        line.innerText = text;
        this.applyStyles(line, { color: color });
        this.outputDiv.appendChild(line);
        this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '`' || e.key === '~') {
                e.preventDefault();
                this.toggle();
            }
        });

        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.inputField.value.trim();
                if (cmd) {
                    this.printLine(`user@tk26:~$ ${cmd}`, '#ffffff');
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.executeCommand(cmd);
                }
                this.inputField.value = '';
            } else if (e.key === 'ArrowUp') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputField.value = this.history[this.historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputField.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.inputField.value = '';
                }
                e.preventDefault();
            }
        });

        // Keep focus
        this.container.addEventListener('click', () => {
            this.inputField.focus();
        });
    }

    executeCommand(cmdString) {
        const args = cmdString.split(' ').filter(Boolean);
        const cmd = args[0].toLowerCase();

        switch(cmd) {
            case 'help':
                this.printLine('Available commands:');
                this.printLine('  help    - Show this message');
                this.printLine('  ls      - List directory contents');
                this.printLine('  cd      - Change directory');
                this.printLine('  cat     - Read a file');
                this.printLine('  clear   - Clear terminal');
                this.printLine('  glitch  - Initiate system overload');
                this.printLine('  exit    - Close terminal');
                break;
            case 'clear':
                this.outputDiv.innerHTML = '';
                break;
            case 'exit':
                this.toggle();
                break;
            case 'ls':
                const dir = this.fs.getCurrentDir();
                if (typeof dir === 'object') {
                    Object.keys(dir).forEach(k => {
                        const isDir = typeof dir[k] === 'object';
                        this.printLine(`  ${isDir ? '['+k+']' : k}`, isDir ? '#FFD700' : '#cc0000');
                    });
                }
                break;
            case 'cd':
                if (!args[1]) {
                    this.fs.cwd = ['root'];
                    this.updatePrompt();
                } else if (args[1] === '..') {
                    if (this.fs.cwd.length > 1) {
                        this.fs.cwd.pop();
                        this.updatePrompt();
                    }
                } else {
                    const current = this.fs.getCurrentDir();
                    if (current[args[1]] && typeof current[args[1]] === 'object') {
                        this.fs.cwd.push(args[1]);
                        this.updatePrompt();
                    } else {
                        this.printLine(`cd: ${args[1]}: No such directory`, '#aaaaaa');
                    }
                }
                break;
            case 'cat':
                if (!args[1]) {
                    this.printLine('Usage: cat <filename>', '#aaaaaa');
                } else {
                    const current = this.fs.getCurrentDir();
                    if (current[args[1]] && typeof current[args[1]] === 'string') {
                        this.printLine(current[args[1]], '#ffffff');
                        if (args[1] === 'glitch.exe') {
                            setTimeout(() => this.executeCommand('glitch'), 1000);
                        }
                    } else {
                        this.printLine(`cat: ${args[1]}: No such file`, '#aaaaaa');
                    }
                }
                break;
            case 'glitch':
                this.printLine('INITIATING OVERLOAD...', '#FFD700');
                this.triggerGlitch();
                break;
            default:
                this.printLine(`Command not found: ${cmd}`, '#aaaaaa');
        }
    }

    updatePrompt() {
        let path = this.fs.cwd.join('/').replace('root', '');
        if (path === '') path = '/';
        this.promptSpan.innerText = `user@tk26:${path}$ `;
    }

    triggerGlitch() {
        const glitchColors = ['#cc0000', '#ffffff', '#000000', '#FFD700'];
        let count = 0;
        const interval = setInterval(() => {
            document.body.style.transform = `translate(${Math.random()*20-10}px, ${Math.random()*20-10}px)`;
            document.body.style.filter = `hue-rotate(${Math.random()*90}deg) contrast(200%)`;
            this.container.style.backgroundColor = glitchColors[Math.floor(Math.random() * glitchColors.length)];
            count++;
            if (count > 20) {
                clearInterval(interval);
                document.body.style.transform = '';
                document.body.style.filter = '';
                this.container.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
                this.printLine('SYSTEM RESTORED.', '#00ff00');
            }
        }, 50);
    }
}

// Initialize on load
window.addEventListener('load', () => {
    window.SymposiumTerminal = new TerminalUI();
});
