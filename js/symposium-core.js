

class SymposiumCore {
    constructor() {
        this.state = {
            visitorID: this.generateVisitorID(),
            sessionStart: Date.now(),
            pagesVisited: [],
            interactions: 0,
            theme: 'dark-spider',
            preferences: {
                animationsEnabled: true,
                soundEnabled: false,
                highPerformance: false 
            },
            registry: {
                isRegistered: false,
                ticketID: null
            }
        };

this.listeners = [];
        this.vDOM = new Map(); 

this.init();
    }

generateVisitorID() {
        return 'TK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

init() {
        console.log(`[SYMPOSIUM CORE] Initialized. Visitor ID: ${this.state.visitorID}`);
        this.trackNavigation();
        this.interceptClicks();

const saved = localStorage.getItem('symposium_state');
        if(saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
            } catch(e) { console.error("Corrupt state in LocalStorage"); }
        }

setInterval(() => this.persistState(), 5000);
    }

dispatch(action) {
        let prevState = { ...this.state };

switch(action.type) {
            case 'RECORD_INTERACTION':
                this.state.interactions += 1;
                break;
            case 'TOGGLE_ANIMATIONS':
                this.state.preferences.animationsEnabled = !this.state.preferences.animationsEnabled;
                break;
            case 'REGISTRATION_SUCCESS':
                this.state.registry.isRegistered = true;
                this.state.registry.ticketID = action.payload;
                break;
            case 'NAVIGATE':
                if(!this.state.pagesVisited.includes(action.payload)) {
                    this.state.pagesVisited.push(action.payload);
                }
                break;
            default:
                console.warn(`[SYMPOSIUM CORE] Unknown action: ${action.type}`);
        }

this.notifyListeners(prevState, this.state);
    }

subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

notifyListeners(prevState, nextState) {
        this.listeners.forEach(listener => listener(prevState, nextState));
        this.reconcileVDOM();
    }

registerVDOMElement(id, renderFn) {
        this.vDOM.set(id, renderFn);
    }

reconcileVDOM() {

document.querySelectorAll('[data-vdom]').forEach(el => {
            const id = el.getAttribute('data-vdom');
            if(this.vDOM.has(id)) {
                const renderFn = this.vDOM.get(id);
                const newHTML = renderFn(this.state);
                if(el.innerHTML !== newHTML) {
                    el.innerHTML = newHTML;

el.classList.remove('vdom-update');
                    void el.offsetWidth;
                    el.classList.add('vdom-update');
                }
            }
        });
    }

trackNavigation() {
        this.dispatch({ type: 'NAVIGATE', payload: window.location.pathname });
    }

interceptClicks() {
        document.addEventListener('click', (e) => {
            this.dispatch({ type: 'RECORD_INTERACTION' });

const link = e.target.closest('a');
            if(link && link.hostname === window.location.hostname && !link.hash) {

}
        });
    }

persistState() {
        localStorage.setItem('symposium_state', JSON.stringify(this.state));
    }
}

window.SymposiumStore = new SymposiumCore();
