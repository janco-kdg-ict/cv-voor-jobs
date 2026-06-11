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

// Laat muren/plafond doorzichtig worden zodra de camera er áchter draait,
// zodat je altijd zicht houdt op de kamer (i.p.v. tegen een muur te kijken).
function fadeOccluders() {
  const p = camera.position;
  for (const o of occluders) {
    const target = o.userData.isBlocking(p) ? 0.12 : 1;
    o.material.opacity += (target - o.material.opacity) * 0.15;
    o.material.transparent = o.material.opacity < 0.985;
    o.material.depthWrite = !o.material.transparent;
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
