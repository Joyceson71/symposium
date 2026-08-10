// events-data.js — TechnoKings 2K26 centralised event data
// Must be loaded BEFORE any script that calls showEvent() or references EVENTS

const EVENTS = [
  {
    id: 'paper-presentation',
    name: 'PAPER PRESENTATION',
    icon: '📄',
    badge: 'TECHNICAL',
    category: 'technical',
    desc: 'Present your research paper on cutting-edge ECE topics. Selected papers will be published in the symposium proceedings.',
    teamSize: '1-2 members',
    prize: 'Cash + Trophy',
    venue: 'Seminar Hall - Block A',
    registerLink: 'register.html?event=paper-presentation',
    rules: [
      'Abstract must be submitted 3 days prior',
      'Presentation: 10 min + 5 min Q&A',
      'IEEE format mandatory',
      'Topics: VLSI, Signal Processing, Embedded Systems, IoT, Wireless Comm'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  },
  {
    id: 'project-expo',
    name: 'PROJECT EXPO',
    icon: '⚙️',
    badge: 'TECHNICAL',
    category: 'technical',
    desc: 'Showcase your hardware or software project. Live demo required. Judges evaluate innovation, implementation, and presentation.',
    teamSize: '2-4 members',
    prize: 'Cash + Certificate',
    venue: 'Main Lab - Block B',
    registerLink: 'register.html?event=project-expo',
    rules: [
      'Working prototype mandatory',
      'Project report to be submitted before demo',
      'Power supply provided - bring other components',
      'Judging criteria: Innovation 40%, Implementation 40%, Presentation 20%'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  },
  {
    id: 'circuit-breakers',
    name: 'CIRCUIT BREAKERS',
    icon: '⚡',
    badge: 'TECHNICAL',
    category: 'technical',
    desc: 'Debug, build and race. Multi-round circuit challenge testing your hardware instincts under time pressure.',
    teamSize: '2 members',
    prize: 'Cash + Trophy',
    venue: 'Electronics Lab - Block B',
    registerLink: 'register.html?event=circuit-breakers',
    rules: [
      'Round 1: Identify & fix faults in a given circuit (20 min)',
      'Round 2: Build a circuit from scratch using given components (30 min)',
      'No smartphones allowed in the lab',
      'Components provided - no personal equipment'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  },
  {
    id: 'technical-quiz',
    name: 'TECHNICAL QUIZ',
    icon: '🧠',
    badge: 'TECHNICAL',
    category: 'technical',
    desc: 'Battle of brains. 3 rounds covering electronics, communications, microprocessors, and current tech trends.',
    teamSize: '2 members',
    prize: 'Cash + Certificate',
    venue: 'Lecture Hall - Block A',
    registerLink: 'register.html?event=technical-quiz',
    rules: [
      'Round 1: Written MCQ (elimination)',
      'Round 2: Buzzer round for top 6 teams',
      'Round 3: Rapid-fire final',
      'Syllabus: ECE core + general aptitude + current affairs in tech'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  },
  {
    id: 'minute-to-win-it',
    name: 'MINUTE TO WIN IT',
    icon: '⏱️',
    badge: 'NON-TECHNICAL',
    category: 'non-technical',
    desc: 'Series of hilarious one-minute challenges testing speed, skill, and nerve. Most completions wins.',
    teamSize: '1 member',
    prize: 'Cash + Certificate',
    venue: 'Open Area - Ground Floor',
    registerLink: 'register.html?event=minute-to-win-it',
    rules: [
      '5 challenges per participant',
      'Each challenge: exactly 60 seconds',
      'Elimination format - top 10 advance to finals',
      'Props provided by organizers'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  },
  {
    id: 'detective',
    name: 'DETECTIVE',
    icon: '🔍',
    badge: 'NON-TECHNICAL',
    category: 'non-technical',
    desc: 'Crack the case using clues hidden across the venue. Fastest team to solve the mystery wins.',
    teamSize: '3 members',
    prize: 'Cash + Certificate',
    venue: 'Campus-wide',
    registerLink: 'register.html?event=detective',
    rules: [
      'Clues hidden across 5 locations on campus',
      'Use of internet strictly prohibited',
      'One member must remain at base at all times',
      'First team to hand over the final answer wins'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  },
  {
    id: 'box-hunt',
    name: 'BOX HUNT',
    icon: '📦',
    badge: 'NON-TECHNICAL',
    category: 'non-technical',
    desc: 'Find the hidden box. Clue-based treasure hunt around the college - the ultimate team puzzle.',
    teamSize: '2 members',
    prize: 'Cash + Certificate',
    venue: 'Campus-wide',
    registerLink: 'register.html?event=box-hunt',
    rules: [
      '10 clues per team, progressive unlock',
      'No running inside buildings',
      'All clues solved in sequence - skipping not allowed',
      'Coordinate with your partner - split to cover more ground'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  },
  {
    id: 'start-music',
    name: 'START MUSIC',
    icon: '🎵',
    badge: 'NON-TECHNICAL',
    category: 'non-technical',
    desc: 'Musical elimination game - but with a technical twist. Last one standing wins.',
    teamSize: '1 member',
    prize: 'Cash + Certificate',
    venue: 'Open Auditorium',
    registerLink: 'register.html?event=start-music',
    rules: [
      'Chairs reduced each round',
      'Twist: participants solve a quick ECE question each round to stay in',
      'Audience participation in early rounds',
      'Final round: sudden death buzzer'
    ],
    coordinators: [
      { name: '[Name]', phone: '+91 XXXXXXXXXX' },
      { name: '[Name]', phone: '+91 XXXXXXXXXX' }
    ]
  }
];

function showEvent(idx) {
  const e = EVENTS[idx];
  if (!e) return;
  const center = document.getElementById('spider-center');
  if (!center) return;
  center.innerHTML =
    '<div class="center-content active">' +
    '<div class="center-logo">' + e.icon + '</div>' +
    '<div class="center-title">' + e.name + '</div>' +
    '<div class="center-desc">' + e.desc + '</div>' +
    '<div class="center-meta">' +
    '<span>Team: ' + e.teamSize + '</span>' +
    '<span>Prize: ' + e.prize + '</span>' +
    '<span>Venue: ' + e.venue + '</span>' +
    '</div>' +
    '<div class="center-coordinators">' +
    e.coordinators.map(function(c) {
      return '<div class="coord-chip"><span class="coord-name">' + c.name + '</span><a href="tel:' + c.phone + '" class="coord-phone">' + c.phone + '</a></div>';
    }).join('') +
    '</div>' +
    '<a href="register.html?event=' + e.id + '" class="center-cta">REGISTER FOR THIS EVENT</a>' +
    '</div>';
}

document.addEventListener('DOMContentLoaded', function() {
  var mobileList = document.getElementById('events-mobile-list');
  if (!mobileList) return;
  EVENTS.forEach(function(e, i) {
    var item = document.createElement('div');
    item.className = 'mobile-event-item';
    var cat = e.category === 'technical' ? 'TECH' : 'NON-TECH';
    item.innerHTML =
      '<button class="mobile-event-header" aria-expanded="false">' +
      '<span class="mobile-event-icon">' + e.icon + '</span>' +
      '<span class="mobile-event-name">' + e.name + '</span>' +
      '<span class="mobile-event-cat">' + cat + '</span>' +
      '<span class="mobile-event-toggle">+</span>' +
      '</button>' +
      '<div class="mobile-event-body">' +
      '<p class="mobile-event-desc">' + e.desc + '</p>' +
      '<div class="mobile-event-meta">' +
      '<span>👥 ' + e.teamSize + '</span><span>🏆 ' + e.prize + '</span><span>📍 ' + e.venue + '</span>' +
      '</div>' +
      '<ul class="mobile-event-rules">' +
      e.rules.map(function(r){ return '<li>' + r + '</li>'; }).join('') +
      '</ul>' +
      '<div class="mobile-event-coords">' +
      e.coordinators.map(function(c){
        return '<div class="coord-chip"><span class="coord-name">' + c.name + '</span><a href="tel:' + c.phone + '" class="coord-phone">' + c.phone + '</a></div>';
      }).join('') +
      '</div>' +
      '<a href="register.html?event=' + e.id + '" class="btn-primary" style="display:inline-block;margin-top:16px;">REGISTER</a>' +
      '</div>';
    var btn = item.querySelector('.mobile-event-header');
    var body = item.querySelector('.mobile-event-body');
    btn.addEventListener('click', function() {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      mobileList.querySelectorAll('.mobile-event-header').forEach(function(b) {
        b.setAttribute('aria-expanded', 'false');
        b.querySelector('.mobile-event-toggle').textContent = '+';
        b.nextElementSibling.style.maxHeight = null;
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.mobile-event-toggle').textContent = '-';
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
    mobileList.appendChild(item);
  });
});
