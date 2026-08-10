/* ================================================================
   TECHNOKINGS 2K26 — world-events.js
   Desktop-only 3D node graph for events.html
   Requires: Three.js, world-canvas or events-3d-canvas already set up
   ================================================================ */

if (window.SKIP_3D) { /* noop */ } else {
(function() {

const canvas = document.getElementById('events-3d-canvas');
if (!canvas || typeof THREE === 'undefined') return;

// ─── RENDERER + SCENE + CAMERA ───────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50,
  canvas.parentElement.offsetWidth / canvas.parentElement.offsetHeight, 0.1, 100);
camera.position.set(0, 0, 10);

scene.add(new THREE.AmbientLight(0x111111, 2));
const keyLight = new THREE.PointLight(0xFF0033, 4, 20);
keyLight.position.set(3, 3, 5);
scene.add(keyLight);

// ─── NODE POSITIONS (8 events) ───────────────────────────────
const NODE_POS = [
  new THREE.Vector3(-3,  2, -1),  // Paper Presentation
  new THREE.Vector3( 2,  3,  1),  // Project Expo
  new THREE.Vector3(-2, -1,  2),  // Circuit Breakers
  new THREE.Vector3( 3, -2, -2),  // Technical Quiz
  new THREE.Vector3(-4,  0,  0),  // Minute to Win It
  new THREE.Vector3( 1, -3,  1),  // Detective
  new THREE.Vector3( 4,  1, -1),  // Box Hunt
  new THREE.Vector3(-1,  2, -3),  // Start Music
];

// ─── NODE SPHERES ────────────────────────────────────────────
const nodeMeshes = NODE_POS.map((pos, i) => {
  const geo  = new THREE.SphereGeometry(0.18, 16, 16);
  const mat  = new THREE.MeshPhongMaterial({ color: 0xCC0000, emissive: 0x220000 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(pos);
  mesh.userData.index = i;
  scene.add(mesh);
  return mesh;
});

// ─── CONNECTION LINES ────────────────────────────────────────
const CONNECTIONS = [[0,1],[1,2],[2,3],[3,0],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[7,4]];
const linePoints  = [];
CONNECTIONS.forEach(([a, b]) => {
  linePoints.push(
    NODE_POS[a].x, NODE_POS[a].y, NODE_POS[a].z,
    NODE_POS[b].x, NODE_POS[b].y, NODE_POS[b].z
  );
});
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePoints), 3));
const lines = new THREE.LineSegments(lineGeo,
  new THREE.LineBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.25 }));
scene.add(lines);

// ─── TOOLTIPS ────────────────────────────────────────────────
const tooltipContainer = canvas.parentElement;
const tooltipEls = (typeof EVENTS !== 'undefined' ? EVENTS : []).map((event, i) => {
  const div = document.createElement('div');
  div.className = 'node-tooltip';
  div.innerHTML = `
    <div class="node-tooltip-name">${event.name}</div>
    <div class="node-tooltip-prize">${event.prize}</div>
  `;
  tooltipContainer.appendChild(div);
  return div;
});

// ─── RAYCASTER ───────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2();
let hoveredNode = -1;
let graphRot    = 0;

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(nodeMeshes);
  const newHovered = hits.length ? hits[0].object.userData.index : -1;

  if (newHovered !== hoveredNode) {
    hoveredNode = newHovered;
    document.dispatchEvent(new CustomEvent('nodeHover', { detail: { index: hoveredNode } }));
  }
}, { passive: true });

// Card ↔ node bridge
document.addEventListener('cardHover', e => {
  hoveredNode = e.detail.index;
});

// ─── RESIZE ──────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}, { passive: true });

// ─── ANIMATE ─────────────────────────────────────────────────
const _tmpV3 = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  // Slow ambient rotation when not hovering a node
  if (hoveredNode < 0) graphRot += 0.002;

  // Update each node
  nodeMeshes.forEach((node, i) => {
    const target = i === hoveredNode
      ? new THREE.Vector3(1.8, 1.8, 1.8)
      : new THREE.Vector3(1, 1, 1);
    node.scale.lerp(target, 0.1);
    node.material.emissive.setHex(i === hoveredNode ? 0x660000 : 0x220000);
    node.rotation.y = graphRot;
  });

  lines.rotation.y = graphRot;

  // Update tooltips via screen projection
  if (typeof EVENTS !== 'undefined') {
    nodeMeshes.forEach((node, i) => {
      if (!tooltipEls[i]) return;
      _tmpV3.copy(node.position);
      _tmpV3.project(camera);

      const x = ( _tmpV3.x * 0.5 + 0.5) * canvas.parentElement.offsetWidth;
      const y = (-_tmpV3.y * 0.5 + 0.5) * canvas.parentElement.offsetHeight;

      tooltipEls[i].style.left = x + 'px';
      tooltipEls[i].style.top  = y + 'px';
      tooltipEls[i].classList.toggle('visible', i === hoveredNode);
    });
  }

  renderer.render(scene, camera);
}

animate();

})();
} // end SKIP_3D check
