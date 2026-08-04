/**
 * ============================================================================
 * TECHNOKINGS 2K26 - SYMPOSIUM CORE (4.0.0)
 * Massive Custom Vanilla JS State Manager & Virtual DOM
 * ============================================================================
 * A Redux-like global state container for tracking user behavior, 
 * managing complex UI states, and intelligent DOM updates.
 */

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
                highPerformance: false // Disables shaders if false
            },
            registry: {
                isRegistered: false,
                ticketID: null
            }
        };

        this.listeners = [];
        this.vDOM = new Map(); // Virtual DOM reference map
        
        this.init();
    }

    generateVisitorID() {
        return 'TK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    init() {
        console.log(`[SYMPOSIUM CORE] Initialized. Visitor ID: ${this.state.visitorID}`);
        this.trackNavigation();
        this.interceptClicks();
        
        // Restore state from LocalStorage if exists
        const saved = localStorage.getItem('symposium_state');
        if(saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
            } catch(e) { console.error("Corrupt state in LocalStorage"); }
        }
        
        // Save state periodically
        setInterval(() => this.persistState(), 5000);
    }

    // REDUX-LIKE DISPATCH
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

    // VIRTUAL DOM RECONCILIATION
    registerVDOMElement(id, renderFn) {
        this.vDOM.set(id, renderFn);
    }

    reconcileVDOM() {
        // Find elements marked with data-vdom and re-render if needed
        document.querySelectorAll('[data-vdom]').forEach(el => {
            const id = el.getAttribute('data-vdom');
            if(this.vDOM.has(id)) {
                const renderFn = this.vDOM.get(id);
                const newHTML = renderFn(this.state);
                if(el.innerHTML !== newHTML) {
                    el.innerHTML = newHTML;
                    // Trigger reflow/animation
                    el.classList.remove('vdom-update');
                    void el.offsetWidth;
                    el.classList.add('vdom-update');
                }
            }
        });
    }

    // ANALYTICS & INTERCEPTORS
    trackNavigation() {
        this.dispatch({ type: 'NAVIGATE', payload: window.location.pathname });
    }

    interceptClicks() {
        document.addEventListener('click', (e) => {
            this.dispatch({ type: 'RECORD_INTERACTION' });
            
            // Check if clicking a link to intercept for smooth transition
            const link = e.target.closest('a');
            if(link && link.hostname === window.location.hostname && !link.hash) {
                // E.g. Single Page App transition logic could go here
            }
        });
    }

    persistState() {
        localStorage.setItem('symposium_state', JSON.stringify(this.state));
    }
}

// Inject Global Store
window.SymposiumStore = new SymposiumCore();
