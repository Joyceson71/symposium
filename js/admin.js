// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMockData();
  initCharts();
  renderRegistrations();
  renderEvents();
  initSettings();
});

// Navigation Logic
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.admin-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(sec => sec.classList.remove('active-section'));

      // Add active class to clicked
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active-section');
    });
  });
}

// Mock Data Setup
let mockRegistrations = [];

function initMockData() {
  // Check if data exists in localStorage
  const stored = localStorage.getItem('symposium_mock_regs');
  if (stored) {
    mockRegistrations = JSON.parse(stored);
  } else {
    // Generate some mock data
    const colleges = ['Kings Engineering College', 'MIT', 'SRM', 'VIT', 'Anna University'];
    const eventIds = EVENTS.map(e => e.name);
    const statuses = ['Confirmed', 'Pending', 'Payment Review'];
    
    for (let i = 1; i <= 25; i++) {
      mockRegistrations.push({
        id: `REG-${1000 + i}`,
        teamName: `Team ${String.fromCharCode(64 + (i % 26))}${i}`,
        leader: `Student ${i}`,
        college: colleges[Math.floor(Math.random() * colleges.length)],
        events: [eventIds[Math.floor(Math.random() * eventIds.length)]],
        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    // Sort by date descending (mock)
    mockRegistrations.sort((a,b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem('symposium_mock_regs', JSON.stringify(mockRegistrations));
  }
  
  // Update Overview Stats
  document.getElementById('stat-total').innerText = mockRegistrations.length;
  document.getElementById('stat-revenue').innerText = `₹${mockRegistrations.length * 500}`; // Mock calc
  
  // Find top event
  const eventCounts = {};
  mockRegistrations.forEach(reg => {
    reg.events.forEach(ev => {
      eventCounts[ev] = (eventCounts[ev] || 0) + 1;
    });
  });
  let topEvent = Object.keys(eventCounts).reduce((a, b) => eventCounts[a] > eventCounts[b] ? a : b, 'None');
  document.getElementById('stat-top-event').innerText = topEvent;
}

// Chart.js Initialization
function initCharts() {
  // Chart defaults for dark theme
  Chart.defaults.color = '#888';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';

  // 1. Line Chart (Registration Trends)
  const ctxLine = document.getElementById('registrationChart').getContext('2d');
  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
      datasets: [{
        label: 'Registrations',
        data: [5, 12, 19, 15, 25, 22, 30],
        borderColor: '#cc0000',
        backgroundColor: 'rgba(204, 0, 0, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // 2. Doughnut Chart (Event Distribution)
  const eventCounts = {};
  mockRegistrations.forEach(reg => {
    reg.events.forEach(ev => {
      eventCounts[ev] = (eventCounts[ev] || 0) + 1;
    });
  });
  
  const labels = Object.keys(eventCounts).slice(0, 5); // Top 5
  const data = Object.values(eventCounts).slice(0, 5);
  
  const ctxDoughnut = document.getElementById('eventChart').getContext('2d');
  new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#cc0000', '#ff4d4d', '#990000', '#ff1a1a', '#4d0000'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right', labels: { color: '#ccc' } }
      }
    }
  });
}

// Render Tables
function renderRegistrations() {
  const tbody = document.getElementById('registrations-tbody');
  tbody.innerHTML = '';
  
  mockRegistrations.forEach(reg => {
    const tr = document.createElement('tr');
    
    let statusClass = 'status-badge';
    if(reg.status === 'Confirmed') statusClass += ' confirmed';
    else if(reg.status === 'Pending') statusClass += ' pending';
    
    tr.innerHTML = `
      <td><strong>${reg.teamName}</strong></td>
      <td>${reg.leader}</td>
      <td>${reg.college}</td>
      <td>${reg.events.join(', ')}</td>
      <td>${reg.date}</td>
      <td><span class="${statusClass}">${reg.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Events from EVENTS data
function renderEvents() {
  const grid = document.getElementById('admin-events-grid');
  if(!grid) return;
  
  grid.innerHTML = '';
  
  // EVENTS comes from events-data.js
  EVENTS.forEach(event => {
    // calculate mock reg count
    const regCount = mockRegistrations.filter(r => r.events.includes(event.name)).length;
    
    const card = document.createElement('div');
    card.className = 'event-admin-card';
    card.innerHTML = `
      <h3>
        <span>${event.icon} ${event.name}</span>
        <span style="font-size: 0.8rem; color: #888;">${event.category}</span>
      </h3>
      <p style="color: #ccc; font-size: 0.9rem; margin-top: 10px;">
        Venue: ${event.venue} <br> Max Team: ${event.teamSize}
      </p>
      <div class="event-stats">
        <div class="event-stat">
          <span>Registrations</span>
          <strong>${regCount}</strong>
        </div>
        <div class="event-stat">
          <span>Status</span>
          <strong style="color: #00e676;">Active</strong>
        </div>
      </div>
      <div style="margin-top: 15px;">
        <button class="btn btn-outline" style="width: 100%; font-size: 0.75rem;">Edit Details</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Settings Handlers
function initSettings() {
  document.getElementById('clear-data')?.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear all mock data?')) {
      localStorage.removeItem('symposium_mock_regs');
      alert('Mock data cleared. Refreshing...');
      window.location.reload();
    }
  });
  
  document.getElementById('export-csv')?.addEventListener('click', () => {
    alert('Mock CSV Export triggered! (Check console for output)');
    console.log('CSV Data:', mockRegistrations);
  });
  
  document.getElementById('toggle-registration')?.addEventListener('click', (e) => {
    alert('Registrations closed state toggled.');
    e.target.innerText = e.target.innerText === 'Close Registrations' ? 'Open Registrations' : 'Close Registrations';
  });
}
