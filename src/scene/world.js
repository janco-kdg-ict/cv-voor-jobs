import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Bouwt de basis-3D-wereld: renderer, scene, camera, licht en controls.
export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0e0b09');
  scene.fog = new THREE.FogExp2('#0e0b09', 0.028);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 9, 17);

  // --- Verlichting: warme, gezellige sfeer -------------------------------
  const ambient = new THREE.AmbientLight('#ffcaa0', 0.45);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight('#ffd9b0', '#1a0f08', 0.35);
  scene.add(hemi);

  // Hoofdlamp (hangt boven het bureau)
  const lamp = new THREE.PointLight('#ffa85c', 55, 30, 1.8);
  lamp.position.set(1.5, 6, 0);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.bias = -0.0008;
  scene.add(lamp);

  // Zacht invullicht van voren
  const fill = new THREE.DirectionalLight('#ffd9b0', 0.5);
  fill.position.set(-6, 8, 10);
  scene.add(fill);

  // --- Controls: rondkijken/draaien --------------------------------------
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, 2.6, 0);
  controls.minDistance = 4;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI * 0.52; // niet onder de vloer kijken
  controls.minPolarAngle = Math.PI * 0.12;
  controls.enablePan = false;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.6;
  controls.enabled = false; // wordt aangezet na de intro

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  return { renderer, scene, camera, controls, lamp };
}
