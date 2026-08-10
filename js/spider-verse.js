

document.addEventListener('DOMContentLoaded', () => {
  initCategoryTabs();

if (IS_MOBILE) {
    buildMobileAccordion('technical');
  } else {
    buildDesktopCards('technical');
    initDesktopEvents();
  }
});

function initCategoryTabs() {
  const tabs = document.querySelectorAll('.etab');
  if (!tabs.length) return;

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.filter;
      if (IS_MOBILE) {
        buildMobileAccordion(category);
      } else {
        buildDesktopCards(category);
      }
    });
  });
}

function buildMobileAccordion(category) {
  const container = document.getElementById('event-accordion');
  if (!container) return;
  container.innerHTML = '';

const filtered = (typeof EVENTS !== 'undefined' ? EVENTS : [])
    .filter(e => e.category === category);

filtered.forEach(event => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.dataset.id = event.id;

item.innerHTML = `
      <div class="accordion-header" onclick="toggleAccordion('${event.id}')">
        <div class="accordion-left">
          <span class="acc-icon">${event.icon}</span>
          <span class="acc-name">${event.name}</span>
        </div>
        <div class="accordion-right">
          <span class="acc-prize">${event.prize}</span>
          <span class="acc-chevron">›</span>
        </div>
      </div>
      <div class="accordion-body" id="body-${event.id}">
        <span class="event-badge">${event.badge || event.category.toUpperCase()}</span>
        <p class="event-desc">${event.desc}</p>
        <div class="event-details">
          <div class="detail-row">
            <span>PRIZE</span>
            <span>${event.prize}</span>
          </div>
          <div class="detail-row">
            <span>TEAM</span>
            <span>${event.teamSize}</span>
          </div>
          <div class="detail-row">
            <span>VENUE</span>
            <span>${event.venue}</span>
          </div>
        </div>
        <ul class="event-rules">
          ${event.rules.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <a href="${event.registerLink || 'register.html?event=' + event.id}"
           class="acc-register">REGISTER NOW →</a>
      </div>
    `;

container.appendChild(item);
  });
}

function toggleAccordion(id) {
  const body = document.getElementById('body-' + id);
  if (!body) return;
  const item = body.closest('.accordion-item');
  const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';

document.querySelectorAll('.accordion-body').forEach(b => {
    b.style.maxHeight = '0';
    b.style.opacity   = '0';
    b.closest('.accordion-item')?.classList.remove('open');
  });

if (!isOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
    body.style.opacity   = '1';
    item.classList.add('open');
  }
}

function buildDesktopCards(category) {
  const container = document.getElementById('desktop-event-list');
  if (!container) return;
  container.innerHTML = '';

const filtered = (typeof EVENTS !== 'undefined' ? EVENTS : [])
    .filter(e => e.category === category);

filtered.forEach((event, i) => {
    const card = document.createElement('div');
    card.className = 'event-card-desktop tiltable reveal';
    card.dataset.index = i;
    card.innerHTML = `
      <div class="ecd-row1">
        <span class="event-badge">${event.badge || event.category.toUpperCase()}</span>
        <span class="ecd-prize">${event.prize}</span>
      </div>
      <div class="ecd-row2">
        <span class="ecd-icon">${event.icon}</span>
        <span class="ecd-name">${event.name}</span>
      </div>
      <p class="ecd-desc">${event.desc}</p>
      <div class="ecd-row4">
        <span class="ecd-team">👥 ${event.teamSize}</span>
        <a href="${event.registerLink || 'register.html?event=' + event.id}"
           class="ecd-register">REGISTER →</a>
      </div>
    `;
    container.appendChild(card);
  });

if (typeof initCardTilt === 'function') initCardTilt();
  if (typeof initReveal   === 'function') initReveal();
}

function initDesktopEvents() {

document.addEventListener('nodeHover', e => {
    const idx = e.detail.index;
    document.querySelectorAll('.event-card-desktop').forEach((card, i) => {
      card.style.borderLeftColor = (i === idx) ? 'var(--red)' : 'transparent';
    });
  });

document.querySelectorAll('.event-card-desktop').forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      document.dispatchEvent(new CustomEvent('cardHover', { detail: { index: i } }));
    });
    card.addEventListener('mouseleave', () => {
      document.dispatchEvent(new CustomEvent('cardHover', { detail: { index: -1 } }));
    });
  });
}

function showEvent(idx) {
  const e = (typeof EVENTS !== 'undefined') ? EVENTS[idx] : null;
  if (!e) return;
  const center = document.getElementById('spider-center');
  if (!center) return;
  center.innerHTML =
    '<div class="center-content active">' +
    '<div class="center-logo">' + e.icon + '</div>' +
    '<div class="center-title">' + e.name + '</div>' +
    '<div class="center-desc">'  + e.desc + '</div>' +
    '<div class="center-meta">'  +
    '<span>Team: '  + e.teamSize + '</span>' +
    '<span>Prize: ' + e.prize    + '</span>' +
    '<span>Venue: ' + e.venue    + '</span>' +
    '</div>' +
    '<a href="' + (e.registerLink || 'register.html?event=' + e.id) +
    '" class="center-cta">REGISTER FOR THIS EVENT</a>' +
    '</div>';
}
