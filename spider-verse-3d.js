// spider-verse-3d.js — TechnoKings 2K26 global 3D background
// DO NOT modify Three.js import — r128 is already loaded globally

(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0a, 1);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);

  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 30);

  var mouse = new THREE.Vector2(0, 0);
  var camTarget = new THREE.Vector2(0, 0);
  window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // NODE PARTICLES
  var NODE_COUNT = 120;
  var positions = new Float32Array(NODE_COUNT * 3);
  var nodeData = [];

  for (var i = 0; i < NODE_COUNT; i++) {
    var x = (Math.random() - 0.5) * 80;
    var y = (Math.random() - 0.5) * 60;
    var z = (Math.random() - 0.5) * 40;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    nodeData.push({
      ox: x, oy: y, oz: z,
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002
    });
  }

  var nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  var nodeMat = new THREE.PointsMaterial({
    color: 0xCC0000, size: 0.25, sizeAttenuation: true, transparent: true, opacity: 0.85
  });
  var nodeMesh = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodeMesh);

  // WEB LINES
  var LINE_THRESHOLD = 14;
  var lineMat = new THREE.LineBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.15 });
  var lineGroup = new THREE.Group();
  scene.add(lineGroup);

  function rebuildLines() {
    lineGroup.clear();
    var pos = nodeGeo.attributes.position.array;
    for (var i = 0; i < NODE_COUNT; i++) {
      for (var j = i + 1; j < NODE_COUNT; j++) {
        var dx = pos[i*3] - pos[j*3];
        var dy = pos[i*3+1] - pos[j*3+1];
        var dz = pos[i*3+2] - pos[j*3+2];
        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < LINE_THRESHOLD) {
          var geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(pos[i*3], pos[i*3+1], pos[i*3+2]),
            new THREE.Vector3(pos[j*3], pos[j*3+1], pos[j*3+2])
          ]);
          var mat = lineMat.clone();
          mat.opacity = (1 - dist / LINE_THRESHOLD) * 0.25;
          lineGroup.add(new THREE.Line(geo, mat));
        }
      }
    }
  }

  // CURSOR REPEL SPHERE
  var sphereGeo = new THREE.SphereGeometry(0.6, 16, 16);
  var sphereMat = new THREE.MeshBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.7 });
  var cursorSphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(cursorSphere);

  var ringGeo = new THREE.RingGeometry(0.8, 1.1, 32);
  var ringMat = new THREE.MeshBasicMaterial({ color: 0xCC0000, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
  var cursorRing = new THREE.Mesh(ringGeo, ringMat);
  scene.add(cursorRing);

  // SPIDER WEB GRID — distant backdrop
  var webGroup = new THREE.Group();
  scene.add(webGroup);
  var webMat = new THREE.LineBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.06 });

  for (var r = 5; r <= 40; r += 7) {
    var pts = [];
    for (var s = 0; s <= 8; s++) {
      var angle = (s / 8) * Math.PI * 2 + Math.PI / 8;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, -20));
    }
    webGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), webMat));
  }
  for (var s = 0; s < 8; s++) {
    var angle = (s / 8) * Math.PI * 2 + Math.PI / 8;
    var spokePts = [
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(Math.cos(angle) * 45, Math.sin(angle) * 45, -20)
    ];
    webGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(spokePts), webMat));
  }

  // ANIMATION LOOP
  var clock = new THREE.Clock();
  var frameCount = 0;

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    frameCount++;

    // Lerp camera toward mouse (parallax)
    camTarget.x += (mouse.x * 4 - camTarget.x) * 0.04;
    camTarget.y += (mouse.y * 3 - camTarget.y) * 0.04;
    camera.position.x = camTarget.x;
    camera.position.y = camTarget.y;
    camera.lookAt(scene.position);

    // Move cursor sphere
    var cx = mouse.x * 18;
    var cy = mouse.y * 14;
    cursorSphere.position.lerp(new THREE.Vector3(cx, cy, 10), 0.12);
    cursorRing.position.copy(cursorSphere.position);
    cursorRing.rotation.z = t;

    // Pulse cursor sphere
    var pulse = 1 + 0.15 * Math.sin(t * 4);
    cursorSphere.scale.setScalar(pulse);

    // Animate nodes
    var pos = nodeGeo.attributes.position.array;
    for (var i = 0; i < NODE_COUNT; i++) {
      var nd = nodeData[i];
      pos[i*3]   += nd.vx;
      pos[i*3+1] += nd.vy;
      if (Math.abs(pos[i*3]) > 40) nd.vx *= -1;
      if (Math.abs(pos[i*3+1]) > 30) nd.vy *= -1;
      var dx = pos[i*3] - cx;
      var dy = pos[i*3+1] - cy;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 6 && dist > 0) {
        pos[i*3]   += (dx / dist) * 0.08;
        pos[i*3+1] += (dy / dist) * 0.08;
      }
    }
    nodeGeo.attributes.position.needsUpdate = true;

    // Rebuild lines every 12 frames
    if (frameCount % 12 === 0) rebuildLines();

    // Rotate web backdrop
    webGroup.rotation.z = t * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
