import './style.css';
import * as THREE from 'three';
import { animate } from 'animejs';

import { createWorld } from './scene/world.js';
import { buildShop } from './scene/shop.js';
import { createInteraction } from './scene/interaction.js';
import {
  animateLoaderIntro,
  flyIn,
  showHud as animateHud,
} from './ui/animations.js';
import { buildHud, openPanel, wirePanelClose } from './ui/overlay.js';

const canvas = document.getElementById('scene');
const { renderer, scene, camera, controls, lamp } = createWorld(canvas);

// Werkplaats opbouwen
const { group, interactives, occluders } = buildShop();
scene.add(group);

// Hergebruikte helpers voor de occluder-raycast (camera -> midden van de kamer).
const occluderRay = new THREE.Raycaster();
const camToTarget = new THREE.Vector3();

// Zwevende stofdeeltjes voor sfeer
scene.add(makeDust());

// Interactie
const interaction = createInteraction({
  camera,
  interactives,
  canvas,
  onSelect: openPanel,
});

// UI
buildHud((data) => openPanel(data));
wirePanelClose();

// ----------------------------------------------------------------- Render loop
const clock = new THREE.Clock();
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  controls.update();
  fadeOccluders();
  interaction.update(dt);
  // lampje flikkert subtiel
  lamp.intensity = 52 + Math.sin(performance.now() * 0.004) * 3;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

// Laat objecten die tússen de camera en het midden van de kamer staan
// doorzichtig worden (prikborden, kast, dozen, muren). Zo zie je de kamer
// ook als je erachter draait — maar enkel dan, want we raycasten elke frame
// van de camera naar het kijkpunt en vervagen alleen wat de straal raakt.
function fadeOccluders() {
  camToTarget.subVectors(controls.target, camera.position);
  const dist = camToTarget.length();
  occluderRay.far = dist;
  occluderRay.set(camera.position, camToTarget.normalize());
  for (const occ of occluders) {
    const blocking = occluderRay.intersectObjects(occ.raycastMeshes, false).length > 0;
    for (const it of occ.items) {
      const target = blocking ? it.base * 0.1 : it.base;
      it.mat.opacity += (target - it.mat.opacity) * 0.18;
      it.mat.depthWrite = it.mat.opacity > it.base * 0.95;
    }
  }
}

// ---------------------------------------------------------------------- Loader
const loader = document.getElementById('loader');
const fill = document.getElementById('loader-fill');
const pctEl = document.getElementById('loader-pct');
const enterBtn = document.getElementById('enter-btn');

animateLoaderIntro();

// Procedurele scene laadt direct -> we tonen een korte, vloeiende progress.
const progress = { v: 0 };
animate(progress, {
  v: 100,
  duration: 1600,
  delay: 500,
  ease: 'inOut(3)',
  onUpdate: () => {
    fill.style.width = progress.v + '%';
    pctEl.textContent = Math.round(progress.v);
  },
  onComplete: () => {
    enterBtn.disabled = false;
    enterBtn.textContent = 'Stap binnen';
  },
});

enterBtn.addEventListener('click', () => {
  if (enterBtn.disabled) return;
  loader.classList.add('is-hidden');
  flyIn({
    camera,
    controls,
    onDone: () => {
      interaction.setEnabled(true);
      animateHud();
      canvas.style.cursor = 'grab';
    },
  });
});

// ---------------------------------------------------------------- Stofdeeltjes
function makeDust() {
  const n = 220;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 1] = Math.random() * 7;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: '#ffcaa0',
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  points.onBeforeRender = () => {
    const t = performance.now() * 0.0002;
    points.rotation.y = t;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < n; i++) {
      arr[i * 3 + 1] += Math.sin(t * 10 + i) * 0.0006;
    }
    geo.attributes.position.needsUpdate = true;
  };
  return points;
}

// Touch-detectie voor de hint-tekst
if (window.matchMedia('(pointer: coarse)').matches) {
  document.body.classList.add('is-touch');
}
