/* ================================================================
   TECHNOKINGS 2K26 — world.js
   Desktop-only 3D engine. Immersive 3D Universe.
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
  // Add a very dark background color instead of true transparent for depth
  renderer.setClearColor(0x050508, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // ─── SCENE & CAMERA ──────────────────────────────────────────
  const scene  = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.03); // Deep universe fog
  
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 5, 25);

  // ─── CAMERA PATH (Drone Flight) ──────────────────────────────
  const cameraPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0,  5, 30),   // hero
    new THREE.Vector3( 5,  0, 15),   // about
    new THREE.Vector3(-2, -5,  5),   // countdown
    new THREE.Vector3( 0, -2, -10),  // schedule / prizes
    new THREE.Vector3(-5,  3, -25),  // register
  ]);

  const lookAtPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0,  0,  0),
    new THREE.Vector3( 2, -2, -5),
    new THREE.Vector3(-4, -2, -15),
    new THREE.Vector3( 2,  2, -30),
    new THREE.Vector3( 0,  0, -40),
  ]);

  let cameraT = 0;
  let targetT = 0;

  // ─── LIGHTS (Crimson + Neon Purple/Blue) ─────────────────────
  scene.add(new THREE.AmbientLight(0x0a0515, 1)); // Very faint purple ambient

  // Crimson Core Light
  const redLight = new THREE.PointLight(0xCC0000, 4, 100);
  redLight.position.set(0, 0, 0);
  scene.add(redLight);

  // Neon Blue/Purple Rim Light
  const blueLight = new THREE.DirectionalLight(0x4400ff, 2);
  blueLight.position.set(-10, 10, 10);
  scene.add(blueLight);

  const purpleLight = new THREE.DirectionalLight(0xaa00ff, 1.5);
  purpleLight.position.set(10, -10, -10);
  scene.add(purpleLight);

  // ─── UNIVERSE: Starfield & Nebula ────────────────────────────
  // Stars
  const starCount = 3000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i*3]   = (Math.random() - 0.5) * 100;
    starPos[i*3+1] = (Math.random() - 0.5) * 100;
    starPos[i*3+2] = (Math.random() - 0.5) * 100;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const starfield = new THREE.Points(starGeo, starMat);
  scene.add(starfield);

  // Nebula dust
  const dustCount = 800;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);
  
  const col1 = new THREE.Color(0xCC0000); // Red
  const col2 = new THREE.Color(0x4400ff); // Blue/Purple

  for (let i = 0; i < dustCount; i++) {
    dustPos[i*3]   = (Math.random() - 0.5) * 80;
    dustPos[i*3+1] = (Math.random() - 0.5) * 80;
    dustPos[i*3+2] = (Math.random() - 0.5) * 80;

    // Mix colors randomly
    const c = Math.random() > 0.5 ? col1 : col2;
    dustColors[i*3] = c.r;
    dustColors[i*3+1] = c.g;
    dustColors[i*3+2] = c.b;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ─── ABSTRACT GEOMETRY ───────────────────────────────────────
  const objects = [];

  // Giant glowing ring
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    emissive: 0xCC0000,
    emissiveIntensity: 0.5,
    roughness: 0.1,
    metalness: 0.8
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(12, 0.2, 16, 100), ringMat);
  ring.position.set(0, 0, -5);
  scene.add(ring);
  objects.push(ring);

  // Massive Torus Knot (The Tech Core)
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0x111122,
    emissive: 0x220044,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(4, 1, 100, 16), knotMat);
  knot.position.set(5, -2, -15);
  scene.add(knot);
  objects.push(knot);

  // Floating Octahedrons
  const octaMat = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: 1,
    roughness: 0,
    transmission: 0.9,
    ior: 1.5,
    thickness: 2
  });
  
  for (let i = 0; i < 5; i++) {
    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(2), octaMat);
    octa.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 40 - 10
    );
    octa.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    // Add custom rotation speeds
    octa.userData = {
      rx: (Math.random() - 0.5) * 0.02,
      ry: (Math.random() - 0.5) * 0.02
    };
    scene.add(octa);
    objects.push(octa);
  }

  // ─── SCROLL INTERACTION ──────────────────────────────────────
  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  const maxScroll = Math.max(
    document.body.scrollHeight - window.innerHeight,
    1 // fallback to avoid NaN
  );

  // ─── ANIMATION LOOP ──────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    // Smooth scroll interpolation
    scrollY += (targetScrollY - scrollY) * 0.05;
    targetT = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    cameraT += (targetT - cameraT) * 0.05; // extra smoothing for camera path

    // Update camera position along the path
    camera.position.copy(cameraPath.getPointAt(cameraT));
    const lookTarget = lookAtPath.getPointAt(cameraT);
    camera.lookAt(lookTarget);

    // Rotate abstract geometry
    ring.rotation.x += 0.001;
    ring.rotation.y += 0.002;
    
    knot.rotation.y += 0.003;
    knot.rotation.z += 0.001;

    // Rotate Octahedrons
    objects.forEach((obj, idx) => {
      if (idx > 1) { // skip ring and knot
        obj.rotation.x += obj.userData.rx;
        obj.rotation.y += obj.userData.ry;
      }
    });

    // Slowly rotate starfield and dust for life
    starfield.rotation.y -= 0.0005;
    dust.rotation.y += 0.0008;
    dust.rotation.x += 0.0002;

    renderer.render(scene, camera);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) return; // ignore if they resized to mobile
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}
}
