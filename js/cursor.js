// cursor.js — TechnoKings 2K26 custom cursor — desktop only
(function() {
  if (typeof IS_MOBILE !== 'undefined' && IS_MOBILE) return;
  if (window.SKIP_3D) return;

  var cursor = document.getElementById('cursor');
  var ring = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var rx = mx, ry = my;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = 'translate(' + (mx - 5) + 'px, ' + (my - 5) + 'px)';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = 'translate(' + (rx - 18) + 'px, ' + (ry - 18) + 'px)';
    requestAnimationFrame(animateRing);
  })();

  // Hover enlargement
  var hoverTargets = 'a, button, .spider-node, .holo-card, .event-card, .stat-card, .faq-question, .nav-cta, .tier-card';
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
})();
