

if (window.SKIP_3D) {  } else {
(function() {

const canvas = document.getElementById('events-3d-canvas');
if (!canvas || typeof THREE === 'undefined') return;

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

const NODE_POS = [
  new THREE.Vector3(-3,  2, -1),  
  new THREE.Vector3( 2,  3,  1),  
  new THREE.Vector3(-2, -1,  2),  
  new THREE.Vector3( 3, -2, -2),  
  new THREE.Vector3(-4,  0,  0),  
  new THREE.Vector3( 1, -3,  1),  
  new THREE.Vector3( 4,  1, -1),  
  new THREE.Vector3(-1,  2, -3),  
];

const nodeMeshes = NODE_POS.map((pos, i) => {
  const geo  = new THREE.SphereGeometry(0.18, 16, 16);
  const mat  = new THREE.MeshPhongMaterial({ color: 0xCC0000, emissive: 0x220000 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(pos);
  mesh.userData.index = i;
  scene.add(mesh);
  return mesh;
});

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

document.addEventListener('cardHover', e => {
  hoveredNode = e.detail.index;
});

window.addEventListener('resize', () => {
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}, { passive: true });

const _tmpV3 = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

if (hoveredNode < 0) graphRot += 0.002;

nodeMeshes.forEach((node, i) => {
    const target = i === hoveredNode
      ? new THREE.Vector3(1.8, 1.8, 1.8)
      : new THREE.Vector3(1, 1, 1);
    node.scale.lerp(target, 0.1);
    node.material.emissive.setHex(i === hoveredNode ? 0x660000 : 0x220000);
    node.rotation.y = graphRot;
  });

lines.rotation.y = graphRot;

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
} 
