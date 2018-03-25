// http://jsfiddle.net/w67tzfhx/1082/

import * as THREE from 'three';
window.THREE = THREE;
require('./TrackballControls');
const Stats = require('./stats');

import {
  default as dat
} from 'dat.gui';
const gui = new dat.GUI();

const config = {
  pointsPerFrame: 1,
  pointsCount: 0
};
window.onload = function() {
  gui.add(config, 'pointsPerFrame', 1, 32);
  gui.add(config, 'pointsCount').listen();
};

const MAX_POINTS = 100000;

let container, stats;
let renderer, scene, camera, controls;
let lines = [];
let drawCount;

const colors = [
  0xb92699,
  0xfe802c,
  0xa6ce3a,
  0xff5253,
  0xffdd58,
  0xcbbcb9
];

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({
    devicePixelRatio: window.devicePixelRatio,
    antialias: true
  });
  renderer.setSize(window.innerWidth, innerHeight);
  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x19194f);

  // camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 0);
  camera.position.set(0, 0, 1000);

  controls = new THREE.TrackballControls(camera);

  controls.rotateSpeed = 1.2;
  controls.zoomSpeed = 1.4;
  controls.panSpeed = 1.0;

  controls.noRotate = false;
  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [65, 83, 68];

  controls.addEventListener('change', render);

  // geometry
  drawCount = 2;
  for (let i = 0; i < 6; i++) {
    const geometry = new THREE.BufferGeometry();
    const position = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
    geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
    geometry.setDrawRange(0, drawCount);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(colors[i]),
      linewidth: 3
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line);
  }

  updatePositions();
}

function updatePositions() {
  lines.forEach((line, i) => {
    const positions = line.geometry.attributes.position.array;
    let index = 0;
    for (let j = 0; j < MAX_POINTS; j++) {
      const radians = (j % 360) * (Math.PI / 180);
      const y = Math.sin(radians);
      positions[index++] = j + (i * 50);
      positions[index++] = y * 200;
      positions[index++] = 0;
    }
  });
}

function render() {
  renderer.render(scene, camera);
  stats.update();
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  drawCount = (drawCount + config.pointsPerFrame) % MAX_POINTS;
  config.pointsCount = drawCount * lines.length;

  lines.forEach(line => {
    line.geometry.setDrawRange(0, drawCount);
    if (drawCount === 0) {
      // periodically, generate new data
      updatePositions();
      line.geometry.attributes.position.needsUpdate = true;
    }
  });

  render();
}

init();
animate();
