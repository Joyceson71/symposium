/* ================================================================
   TECHNOKINGS 2K26 — script.js
   SYNCHRONOUS device detection runs before DOMContentLoaded
   ================================================================ */


// ─── DEVICE DETECTION (synchronous, line 1) ──────────────────
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches
  || ('ontouchstart' in window && window.innerWidth <= 768);
const IS_LOW_POWER = navigator.hardwareConcurrency <= 4
  || (navigator.deviceMemory && navigator.deviceMemory <= 2);

document.documentElement.classList.add(IS_MOBILE ? 'theme-mobile' : 'theme-desktop');

if (IS_MOBILE || IS_LOW_POWER) window.SKIP_3D = true;

// ─── DOM READY ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  initLoader();
  initNavScroll();
  initReveal();
  initCountdown();
  initStatCounters();
  initPrizeCounter();
  initFAQ();

  if (IS_MOBILE) {
    initMobileBottomNav();
  } else {
    initCustomCursor();
    initScrollProgressBar();
    initCardTilt();
    initTargetingReticle();
    initTextScramble();
    initTimelineDrag();
    wrapNavCta();
  }
});

// ─── LOADER ──────────────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Hide after animation completes
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);
}

// ─── NAV SCROLL ──────────────────────────────────────────────
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// ─── MOBILE BOTTOM NAV ───────────────────────────────────────
function initMobileBottomNav() {
  const tabs = document.querySelectorAll('.mob-nav-tab');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  tabs.forEach(tab => {
    const href = tab.getAttribute('href');
    if (!href) return;
    const tabPage = href.split('/').pop().split('?')[0] || 'index.html';
    const isActive = tabPage === currentPath
      || (currentPath === '' && tabPage === 'index.html');
    if (isActive) tab.classList.add('active');

    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// ─── SCROLL REVEALS ──────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

// ─── COUNTDOWN ───────────────────────────────────────────────
function initCountdown() {
  const TARGET = new Date('2026-09-18T09:00:00+05:30');
  const IDS = ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'];
  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor(diff % 86400000 / 3600000);
    const mins  = Math.floor(diff % 3600000  / 60000);
    const secs  = Math.floor(diff % 60000    / 1000);
    const vals  = [days, hours, mins, secs];

    IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(vals[i]);
    });
  }

  tick();
  setInterval(tick, 1000);
}

// ─── STAT COUNTERS ───────────────────────────────────────────
function initStatCounters() {
  const elements = document.querySelectorAll('[data-count]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      if (!target) return;
      const prefix = el.dataset.prefix || '';
      let current = 0;
      const step = Math.ceil(target / 50);
      const iv = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = prefix + current.toLocaleString('en-IN');
        if (current >= target) clearInterval(iv);
      }, 28);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  elements.forEach(el => observer.observe(el));
}

// ─── PRIZE COUNTER ───────────────────────────────────────────
function initPrizeCounter() {
  const el = document.getElementById('prize-count');
  if (!el) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      let current = 0;
      const target = 20000;
      const step = Math.ceil(target / 60);
      const iv = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString('en-IN');
        if (current >= target) clearInterval(iv);
      }, 28);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  observer.observe(el);
}

// ─── FAQ ─────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ─── CUSTOM CURSOR (desktop only) ────────────────────────────
function initCustomCursor() {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  }, { passive: true });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .event-card-desktop, .tiltable').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '40px';
      cur.style.height = '40px';
      ring.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '10px';
      cur.style.height = '10px';
      ring.style.opacity = '1';
    });
  });
}

// ─── SCROLL PROGRESS BAR (desktop) ───────────────────────────
function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100) + '%';
  }, { passive: true });
}

// ─── CARD TILT (desktop) ─────────────────────────────────────
function initCardTilt() {
  document.querySelectorAll('.tiltable, .event-card-desktop').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -5;
      const ry = ((e.clientX - cx) / (rect.width  / 2)) * 5;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── GLOBAL HELPERS ──────────────────────────────────────────
function toggleMenu() {
  const m = document.getElementById('mobile-menu');
  if (m) m.classList.toggle('open');
}

function scrollToReg() {
  window.location.href = 'register.html';
}

function openSuccess(name, eventName) {
  const modal = document.getElementById('success-modal');
  const nameEl = document.getElementById('success-name');
  const eventEl = document.getElementById('success-event');
  if (nameEl) nameEl.textContent = name || 'CHAMP';
  if (eventEl) eventEl.textContent = eventName || 'YOUR EVENT';
  if (modal) modal.classList.add('active');
}

function closeSuccess() {
  const modal = document.getElementById('success-modal');
  if (modal) modal.classList.remove('active');
}

function closeEasterEgg() {
  const m = document.getElementById('easter-egg-modal');
  if (m) m.classList.add('hidden');
}

// ─── TARGETING RETICLE (desktop) ─────────────────────────────
function initTargetingReticle() {
  const reticle = document.getElementById('targeting-reticle');
  if (!reticle) return;
  let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
  let tx = rx, ty = ry;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });

  (function animReticle() {
    rx += (tx - rx) * 0.1;
    ry += (ty - ry) * 0.1;
    reticle.style.left = rx + 'px';
    reticle.style.top  = ry + 'px';
    requestAnimationFrame(animReticle);
  })();
}

// ─── TEXT SCRAMBLE (hero title on load) ──────────────────────
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

function scrambleText(el, finalText, duration) {
  if (!el) return;
  const frames = Math.round(duration / 40);
  let frame = 0;

  const iv = setInterval(() => {
    const progress = frame / frames;
    const revealedLen = Math.floor(progress * finalText.length);
    let result = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ') { result += ' '; continue; }
      if (i < revealedLen) {
        result += finalText[i];
      } else {
        result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = result;
    frame++;
    if (frame > frames) {
      el.textContent = finalText;
      clearInterval(iv);
    }
  }, 40);
}

function initTextScramble() {
  // Scramble hero title lines with staggered delays
  setTimeout(() => {
    const t1 = document.querySelector('.hero-t1');
    const t2 = document.querySelector('.hero-t2');
    const t3 = document.querySelector('.hero-t3');
    if (t1) scrambleText(t1, 'TECHNO', 600);
    setTimeout(() => { if (t2) scrambleText(t2, 'KINGS', 700); }, 300);
    setTimeout(() => { if (t3) scrambleText(t3, '2K26', 400); }, 700);
  }, 400);
}

// ─── TIMELINE HORIZONTAL DRAG (desktop schedule) ─────────────
function initTimelineDrag() {
  const container = document.querySelector('.timeline-container');
  if (!container) return;

  let isDown = false;
  let startX, scrollLeft;

  container.addEventListener('mousedown', e => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });

  container.style.cursor = 'grab';
}

// ─── NAV CTA SPAN WRAP (for slide fill effect) ───────────────
function wrapNavCta() {
  const cta = document.querySelector('.nav-cta');
  if (!cta || cta.querySelector('span')) return;
  const text = cta.textContent;
  cta.innerHTML = `<span>${text}</span>`;
}

