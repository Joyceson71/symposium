/* ================================================================
   TECHNOKINGS 2K26 — world.js
   Desktop-only 3D engine. Scroll-driven camera through 5 scenes.
   Only loaded when window.SKIP_3D is not set.
   ================================================================ */

if (window.SKIP_3D) { /* noop */ } else {

// ─── RENDERER ────────────────────────────────────────────────
const canvas = document.getElementById('world-canvas');
if (canvas && typeof THREE !== 'undefined') {

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ─── SCENE & CAMERA ──────────────────────────────────────────
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 8, 14);

// ─── CAMERA PATH ─────────────────────────────────────────────
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3( 0,  8, 14),   // hero
  new THREE.Vector3(-2,  4, 10),   // about
  new THREE.Vector3( 1,  0, 12),   // countdown
  new THREE.Vector3( 2, -4, 10),   // prize
  new THREE.Vector3( 0, -8, 14),   // register
]);

const lookAtPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3( 4,  0,  0),
  new THREE.Vector3(-1,  1,  0),
  new THREE.Vector3( 0,  0,  0),
  new THREE.Vector3( 0, -2,  0),
  new THREE.Vector3( 0, -6,  0),
]);

let cameraT = 0;
let targetT = 0;

// ─── LIGHTS ──────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x1a0000, 1.5));

const keyLight = new THREE.DirectionalLight(0xff1a1a, 3);
keyLight.position.set(3, 5, 3);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x000022, 0.5);
fillLight.position.set(-4, 2, 2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xff0033, 1.5);
rimLight.position.set(0, -3, -4);
scene.add(rimLight);

// ─── HERO: Wireframe Icosphere ────────────────────────────────
const icoGeo = new THREE.IcosahedronGeometry(3, 2);
const icoMat = new THREE.MeshBasicMaterial({
  color: 0xCC0000, wireframe: true,
  transparent: true, opacity: 0.22
});
const ico = new THREE.Mesh(icoGeo, icoMat);
ico.position.set(4, 0, 0);
scene.add(ico);

// ─── HERO: Particle field ─────────────────────────────────────
const PART_COUNT = 300;
const partGeo = new THREE.BufferGeometry();
const pPositions = new Float32Array(PART_COUNT * 3);
for (let i = 0; i < PART_COUNT; i++) {
  pPositions[i*3]   = (Math.random() - 0.5) * 20;
  pPositions[i*3+1] = (Math.random() - 0.5) * 12;
  pPositions[i*3+2] = (Math.random() - 1)   * 8;
}
partGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
const partMat = new THREE.PointsMaterial({ color: 0xCC0000, size: 0.04, transparent: true, opacity: 0.6 });
const particles = new THREE.Points(partGeo, partMat);
scene.add(particles);

// ─── ABOUT: PCB Plane ─────────────────────────────────────────
const pcb = new THREE.Mesh(
  new THREE.BoxGeometry(8, 0.1, 6),
  new THREE.MeshPhongMaterial({ color: 0x060f06, shininess: 80 })
);
pcb.position.set(-2, 4, -2);
pcb.rotation.x = -0.2;
scene.add(pcb);

// PCB traces as LineSegments
const tracePoints = [];
for (let i = 0; i < 20; i++) {
  const x1 = (Math.random() - 0.5) * 7, x2 = x1 + (Math.random() - 0.5) * 2;
  const z1 = (Math.random() - 0.5) * 5, z2 = z1 + (Math.random() - 0.5) * 2;
  tracePoints.push(x1, 0.06, z1, x2, 0.06, z2);
}
const traceGeo = new THREE.BufferGeometry();
traceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tracePoints), 3));
const traces = new THREE.LineSegments(traceGeo,
  new THREE.LineBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.5 }));
pcb.add(traces);

// ─── COUNTDOWN: Torus Knot ────────────────────────────────────
const torusGeo = new THREE.TorusKnotGeometry(2, 0.28, 120, 16);
const torus    = new THREE.Mesh(torusGeo, new THREE.MeshPhongMaterial({
  color: 0x1A0000, emissive: 0x220000, shininess: 200,
  transparent: true, opacity: 0.9
}));
const torusWire = new THREE.Mesh(torusGeo, new THREE.MeshBasicMaterial({
  color: 0xCC0000, wireframe: true, transparent: true, opacity: 0.25
}));
torus.position.set(0, 0, 0);
torusWire.position.copy(torus.position);
scene.add(torus);
scene.add(torusWire);

const orbitLight = new THREE.PointLight(0xFF0033, 4, 8);
scene.add(orbitLight);

// ─── PRIZE: Trophy (Octahedron) ───────────────────────────────
const octGeo  = new THREE.OctahedronGeometry(1.4);
const trophy  = new THREE.Mesh(octGeo, new THREE.MeshPhongMaterial({
  color: 0xFFD700, emissive: 0x442200, shininess: 200
}));
const trophyWire = new THREE.Mesh(octGeo, new THREE.MeshBasicMaterial({
  color: 0xFFD700, wireframe: true, transparent: true, opacity: 0.4
}));
trophy.position.set(0, -4, 0);
trophyWire.position.copy(trophy.position);
scene.add(trophy);
scene.add(trophyWire);

const crown = new THREE.Mesh(
  new THREE.TorusGeometry(1.0, 0.12, 8, 12),
  new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0x332200 })
);
crown.position.set(0, -2.8, 0);
scene.add(crown);

const goldLight = new THREE.PointLight(0xFFAA00, 3, 10);
goldLight.position.set(0, -1, 4);
scene.add(goldLight);

// ─── GOLD PARTICLE FOUNTAIN ───────────────────────────────────
const GOLD_COUNT = 200;
const goldGeo       = new THREE.BufferGeometry();
const goldPos       = new Float32Array(GOLD_COUNT * 3);
const goldVel       = new Float32Array(GOLD_COUNT * 3);
for (let i = 0; i < GOLD_COUNT; i++) {
  goldPos[i*3]   = (Math.random() - 0.5) * 10;
  goldPos[i*3+1] = -8 + Math.random() * 4;
  goldPos[i*3+2] = (Math.random() - 0.5) * 6;
  goldVel[i*3]   = (Math.random() - 0.5) * 0.02;
  goldVel[i*3+1] = Math.random() * 0.04 + 0.02;
  goldVel[i*3+2] = (Math.random() - 0.5) * 0.01;
}
goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPos, 3));
const goldParticles = new THREE.Points(goldGeo,
  new THREE.PointsMaterial({ color: 0xFFD700, size: 0.06, transparent: true, opacity: 0.7 }));
scene.add(goldParticles);

// ─── MOUSE PARALLAX ──────────────────────────────────────────
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

// ─── RESIZE ──────────────────────────────────────────────────
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}, { passive: true });

// ─── ANIMATE ─────────────────────────────────────────────────
let frameCount = 0;
function lerp(a, b, t) { return a + (b - a) * t; }

function animate() {
  requestAnimationFrame(animate);
  frameCount++;
  const t = frameCount * 0.01;

  // Scroll-driven camera
  const scrollPct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
  targetT = scrollPct;
  cameraT = lerp(cameraT, targetT, 0.06);

  const clampedT = Math.min(cameraT, 0.999);
  const camPos  = cameraPath.getPoint(clampedT);
  const lookAt  = lookAtPath.getPoint(clampedT);

  camera.position.lerp(camPos, 0.08);
  camera.lookAt(lookAt);

  // Mouse parallax — subtle scene tilt
  scene.rotation.y = lerp(scene.rotation.y, mouseX * 0.02, 0.04);
  scene.rotation.x = lerp(scene.rotation.x, -mouseY * 0.01, 0.04);

  // Icosphere rotation
  ico.rotation.y += 0.002;
  ico.rotation.x += 0.001;

  // Particle drift upward
  particles.rotation.y += 0.001;
  const pPos = particles.geometry.attributes.position;
  for (let i = 0; i < PART_COUNT; i++) {
    pPos.array[i*3+1] += 0.008;
    if (pPos.array[i*3+1] > 8) pPos.array[i*3+1] = -8;
  }
  pPos.needsUpdate = true;

  // Torus knot
  torus.rotation.x += 0.003;
  torus.rotation.y += 0.005;
  torusWire.rotation.copy(torus.rotation);

  // Orbiting light around torus
  orbitLight.position.x = Math.cos(t * 0.8) * 3;
  orbitLight.position.y = Math.sin(t * 0.5) * 2;
  orbitLight.position.z = Math.sin(t * 0.8) * 3;

  // Trophy rotation
  trophy.rotation.y    += 0.005;
  trophyWire.rotation.copy(trophy.rotation);
  crown.rotation.y     -= 0.008;

  // Gold particles rise
  const gPos = goldParticles.geometry.attributes.position;
  for (let i = 0; i < GOLD_COUNT; i++) {
    gPos.array[i*3+1] += goldVel[i*3+1];
    if (gPos.array[i*3+1] > -1) gPos.array[i*3+1] = -10;
  }
  gPos.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

} // end canvas/THREE check
} // end SKIP_3D check
