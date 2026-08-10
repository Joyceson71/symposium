

if (window.SKIP_3D) {  } else {

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

renderer.setClearColor(0x050508, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

const scene  = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.03); 

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 5, 25);

const cameraPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0,  5, 30),   
    new THREE.Vector3( 5,  0, 15),   
    new THREE.Vector3(-2, -5,  5),   
    new THREE.Vector3( 0, -2, -10),  
    new THREE.Vector3(-5,  3, -25),  
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

scene.add(new THREE.AmbientLight(0x0a0515, 1)); 

const redLight = new THREE.PointLight(0xCC0000, 4, 100);
  redLight.position.set(0, 0, 0);
  scene.add(redLight);

const blueLight = new THREE.DirectionalLight(0x4400ff, 2);
  blueLight.position.set(-10, 10, 10);
  scene.add(blueLight);

const purpleLight = new THREE.DirectionalLight(0xaa00ff, 1.5);
  purpleLight.position.set(10, -10, -10);
  scene.add(purpleLight);

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

const dustCount = 800;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);

const col1 = new THREE.Color(0xCC0000); 
  const col2 = new THREE.Color(0x4400ff); 

for (let i = 0; i < dustCount; i++) {
    dustPos[i*3]   = (Math.random() - 0.5) * 80;
    dustPos[i*3+1] = (Math.random() - 0.5) * 80;
    dustPos[i*3+2] = (Math.random() - 0.5) * 80;

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

const objects = [];

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

octa.userData = {
      rx: (Math.random() - 0.5) * 0.02,
      ry: (Math.random() - 0.5) * 0.02
    };
    scene.add(octa);
    objects.push(octa);
  }

let scrollY = 0;
  let targetScrollY = 0;

window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

const maxScroll = Math.max(
    document.body.scrollHeight - window.innerHeight,
    1 
  );

function animate() {
    requestAnimationFrame(animate);

scrollY += (targetScrollY - scrollY) * 0.05;
    targetT = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    cameraT += (targetT - cameraT) * 0.05; 

camera.position.copy(cameraPath.getPointAt(cameraT));
    const lookTarget = lookAtPath.getPointAt(cameraT);
    camera.lookAt(lookTarget);

ring.rotation.x += 0.001;
    ring.rotation.y += 0.002;

knot.rotation.y += 0.003;
    knot.rotation.z += 0.001;

objects.forEach((obj, idx) => {
      if (idx > 1) { 
        obj.rotation.x += obj.userData.rx;
        obj.rotation.y += obj.userData.ry;
      }
    });

starfield.rotation.y -= 0.0005;
    dust.rotation.y += 0.0008;
    dust.rotation.x += 0.0002;

renderer.render(scene, camera);
  }

window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) return; 
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

animate();
}
}
