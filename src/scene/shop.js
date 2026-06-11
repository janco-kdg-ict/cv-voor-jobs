import * as THREE from 'three';
import { content } from '../data/content.js';
import { woodTexture, wallTexture, textTexture } from './textures.js';

// Bouwt de "cozy dev workshop": kamer, meubels, decor en alle klikbare
// voorwerpen. Geeft { group, interactives } terug.
export function buildShop() {
  const group = new THREE.Group();
  const interactives = [];

  // --- Materialen --------------------------------------------------------
  const floorTex = woodTexture({ base: '#6b4423', hue: 22 });
  floorTex.repeat.set(4, 4);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.85 });

  const wallTex = wallTexture({ base: '#2a2018' });
  wallTex.repeat.set(3, 2);
  // Elke muur krijgt een eigen materiaal-instantie zodat ze los kunnen vervagen.
  const makeWallMat = () => new THREE.MeshStandardMaterial({ map: wallTex, roughness: 1 });

  const shelfTex = woodTexture({ base: '#7a4e28', hue: 26, plank: 6 });
  const shelfMat = new THREE.MeshStandardMaterial({ map: shelfTex, roughness: 0.7 });
  const darkWood = new THREE.MeshStandardMaterial({ color: '#3a2415', roughness: 0.8 });
  const metalMat = new THREE.MeshStandardMaterial({ color: '#2b2b30', roughness: 0.4, metalness: 0.7 });

  // --- Kamer -------------------------------------------------------------
  const W = 16, D = 16, H = 8;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({ color: '#1a120c', roughness: 1 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  group.add(ceiling);

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), makeWallMat());
  backWall.position.set(0, H / 2, -D / 2);
  backWall.receiveShadow = true;
  group.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), makeWallMat());
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-W / 2, H / 2, 0);
  leftWall.receiveShadow = true;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), makeWallMat());
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(W / 2, H / 2, 0);
  rightWall.receiveShadow = true;
  group.add(rightWall);

  // --- Vervagende objecten ----------------------------------------------
  // Alles wat tússen de camera en het midden van de kamer staat, wordt
  // doorzichtig (via een raycast in main.js). Zo zie je de kamer ook als je
  // áchter een prikbord of de kast draait — maar enkel dán.
  const occluders = [];
  function addOccluder(object, cloneMats = false) {
    const raycastMeshes = [];
    const items = [];
    object.traverse((o) => {
      if (!o.isMesh) return;
      raycastMeshes.push(o);
      // Gedeelde materialen klonen, anders vervaagt ook ander meubilair mee.
      if (cloneMats) {
        o.material = Array.isArray(o.material)
          ? o.material.map((m) => m.clone())
          : o.material.clone();
      }
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
        m.transparent = true;
        items.push({ mat: m, base: m.opacity });
      }
    });
    occluders.push({ raycastMeshes, items });
  }
  addOccluder(backWall);
  addOccluder(leftWall);
  addOccluder(rightWall);
  addOccluder(ceiling);

  // Vloerkleed
  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(4.2, 48),
    new THREE.MeshStandardMaterial({ color: '#7a2f24', roughness: 1 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.01, 1.5);
  rug.receiveShadow = true;
  group.add(rug);
  const rugRing = new THREE.Mesh(
    new THREE.RingGeometry(3.4, 3.7, 48),
    new THREE.MeshStandardMaterial({ color: '#a8543f', roughness: 1, side: THREE.DoubleSide })
  );
  rugRing.rotation.x = -Math.PI / 2;
  rugRing.position.set(0, 0.02, 1.5);
  group.add(rugRing);

  // --- Hanglamp (bij het licht uit world.js, rond x=1.5, y=6) ------------
  const lampGroup = new THREE.Group();
  lampGroup.position.set(1.5, 0, 0);
  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 2, 6),
    new THREE.MeshStandardMaterial({ color: '#111' })
  );
  cord.position.y = 7;
  lampGroup.add(cord);
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 0.8, 24, 1, true),
    new THREE.MeshStandardMaterial({
      color: '#3a2418', side: THREE.DoubleSide, roughness: 0.6,
      emissive: '#ff8a3c', emissiveIntensity: 0.25,
    })
  );
  shade.position.y = 5.9;
  lampGroup.add(shade);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffb060', emissiveIntensity: 3 })
  );
  bulb.position.y = 5.7;
  lampGroup.add(bulb);
  group.add(lampGroup);

  // --- Naam-neon op de achterwand ---------------------------------------
  const sign = makeNeonSign(content.name.toUpperCase());
  sign.position.set(0, 6.4, -D / 2 + 0.12);
  group.add(sign);
  const role = makeTextPlane(content.role, { color: '#ffd9b0', font: 'italic 30px "Space Grotesk", sans-serif', w: 600, h: 90, bg: 'transparent' });
  role.position.set(0, 5.5, -D / 2 + 0.12);
  group.add(role);

  // =======================================================================
  //  INTERACTIEVE BOEKENKAST (projecten)
  // =======================================================================
  const shelf = buildBookshelf(shelfMat, darkWood);
  shelf.position.set(0, 0, -7.1);
  group.add(shelf);
  addOccluder(shelf, true); // kast vervaagt als je erachter draait

  const shelfYs = [1.5, 3.0, 4.5]; // hoogtes van de planken
  content.projects.forEach((proj, i) => {
    const shelfY = shelfYs[Math.floor(i / 3) % shelfYs.length];
    const col = i % 3;
    const x = -2 + col * 2;
    const box = makeProjectBox(proj);
    box.position.set(x, shelfY + 0.5, -6.7);
    box.userData = {
      interactive: true,
      kind: 'project',
      payload: proj,
      label: proj.title,
      base: { y: box.position.y, scale: 1 },
      glow: box.userData.glowMat,
    };
    group.add(box);
    interactives.push(box);
    addOccluder(box); // projectdoos vervaagt als je erachter draait
  });

  // =======================================================================
  //  BUREAU + MONITOR (over mij)
  // =======================================================================
  const desk = buildDesk(darkWood, metalMat);
  desk.position.set(5, 0, -3.5);
  desk.rotation.y = -Math.PI / 2.6;
  group.add(desk);

  const monitor = makeMonitor(content.about);
  monitor.position.set(5, 0, -3.5);
  monitor.rotation.y = -Math.PI / 2.6;
  monitor.userData = {
    interactive: true,
    kind: 'about',
    label: 'Over mij',
    payload: content.about,
    base: { y: monitor.position.y, scale: 1 },
    glow: monitor.userData.glowMat,
  };
  group.add(monitor);
  interactives.push(monitor);

  // Mok op het bureau (klein decor + klikbaar -> contact)
  const mug = makeMug();
  mug.position.set(6.2, 1.55, -2.4);
  mug.userData = {
    interactive: true,
    kind: 'contact',
    label: 'Contacteer mij',
    payload: null,
    base: { y: mug.position.y, scale: 1 },
    glow: mug.userData.glowMat,
  };
  group.add(mug);
  interactives.push(mug);

  // =======================================================================
  //  GEREEDSCHAPSBORD (skills) — linkerwand
  // =======================================================================
  const peg = makePegboard(content.skills.categories);
  peg.position.set(-7.7, 3.6, 0);
  peg.rotation.y = Math.PI / 2;
  peg.userData = {
    interactive: true,
    kind: 'skills',
    label: 'Mijn skills',
    payload: content.skills,
    base: { y: peg.position.y, scale: 1 },
    glow: peg.userData.glowMat,
  };
  group.add(peg);
  interactives.push(peg);

  // =======================================================================
  //  PRIKBORD (ervaring) — linkerwand, naast pegboard
  // =======================================================================
  const board = makeCorkboard();
  board.position.set(-7.7, 3.4, 4.5);
  board.rotation.y = Math.PI / 2;
  board.userData = {
    interactive: true,
    kind: 'experience',
    label: 'Mijn parcours',
    payload: content.experience,
    base: { y: board.position.y, scale: 1 },
    glow: board.userData.glowMat,
  };
  group.add(board);
  interactives.push(board);

  // De prikborden meenemen: draai je erachter, dan vervagen ze zodat je niet
  // vastloopt achter het skills- of ervaringsbord.
  addOccluder(peg);
  addOccluder(board);

  // --- Decor: planten in de hoeken --------------------------------------
  const plant = makePlant();
  plant.position.set(-6, 0, -5.5);
  group.add(plant);
  const plant2 = makePlant();
  plant2.position.set(6.5, 0, 4);
  plant2.scale.setScalar(0.8);
  group.add(plant2);

  // Stapel boeken op de vloer
  const books = makeBookStack();
  books.position.set(-5.5, 0, 3);
  group.add(books);

  // Krukje
  const stool = buildStool(darkWood);
  stool.position.set(2.5, 0, 2.5);
  group.add(stool);

  return { group, interactives, occluders };
}

/* ------------------------------------------------------------------ helpers */

function makeTextPlane(text, opts = {}) {
  const tex = textTexture([text], { align: 'center', ...opts });
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const geo = new THREE.PlaneGeometry((opts.w || 600) / 150, (opts.h || 90) / 150);
  return new THREE.Mesh(geo, mat);
}

function makeNeonSign(text) {
  const g = new THREE.Group();
  const tex = textTexture([text], {
    align: 'center', w: 900, h: 200, bg: 'transparent',
    color: '#ff8a5b', font: '700 90px "Space Grotesk", sans-serif',
  });
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.33), mat);
  g.add(mesh);
  return g;
}

function buildBookshelf(woodMat, darkWood) {
  const g = new THREE.Group();
  const w = 7, h = 5.2, d = 0.7, t = 0.12;
  const sideGeo = new THREE.BoxGeometry(t, h, d);
  const left = new THREE.Mesh(sideGeo, woodMat);
  left.position.set(-w / 2, h / 2, 0);
  const right = left.clone();
  right.position.x = w / 2;
  g.add(left, right);

  const shelfYs = [0.05, 1.4, 2.9, 4.4, h - 0.05];
  for (const y of shelfYs) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), woodMat);
    s.position.set(0, y, 0);
    s.castShadow = s.receiveShadow = true;
    g.add(s);
  }
  const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), darkWood);
  back.position.set(0, h / 2, -d / 2);
  g.add(back);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function makeProjectBox(proj) {
  const g = new THREE.Group();
  const color = new THREE.Color(proj.color || '#ff8a5b');
  const glowMat = new THREE.MeshStandardMaterial({
    color: '#1a1410', emissive: color, emissiveIntensity: 0.6, roughness: 0.4,
  });
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.95, 0.7), glowMat);
  box.castShadow = true;
  g.add(box);

  // titel-label op de voorkant
  const tex = textTexture([proj.short || proj.title], {
    align: 'center', w: 320, h: 256, bg: 'transparent',
    color: '#ffffff', font: '600 30px "Space Grotesk", sans-serif',
  });
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 0.8),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  label.position.z = 0.36;
  g.add(label);

  // gloeiende randlijn onderaan
  const edge = new THREE.Mesh(
    new THREE.BoxGeometry(1.12, 0.06, 0.72),
    new THREE.MeshBasicMaterial({ color })
  );
  edge.position.y = -0.5;
  g.add(edge);

  g.userData.glowMat = glowMat;
  return g;
}

function buildDesk(woodMat, metalMat) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 1.6), woodMat);
  top.position.y = 1.4;
  top.castShadow = top.receiveShadow = true;
  g.add(top);
  const legGeo = new THREE.BoxGeometry(0.1, 1.4, 0.1);
  [[-1.5, -0.6], [1.5, -0.6], [-1.5, 0.6], [1.5, 0.6]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, metalMat);
    leg.position.set(x, 0.7, z);
    leg.castShadow = true;
    g.add(leg);
  });
  return g;
}

function makeMonitor(about) {
  const g = new THREE.Group();
  const screenTex = textTexture(
    ['> whoami', ...about.lines.slice(0, 6).map((l) => (l ? '  ' + l.slice(0, 34) : ''))],
    { w: 640, h: 360, bg: '#0c1a16', color: '#9affc8', accent: '#ff8a5b', font: '20px "JetBrains Mono", monospace' }
  );
  const glowMat = new THREE.MeshStandardMaterial({
    map: screenTex, emissive: '#1bffa0', emissiveIntensity: 0.35, emissiveMap: screenTex,
  });
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.1, 0.08), glowMat);
  screen.position.y = 2.25;
  g.add(screen);
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.2, 0.06),
    new THREE.MeshStandardMaterial({ color: '#15110d', roughness: 0.5 })
  );
  frame.position.set(0, 2.25, -0.05);
  g.add(frame);
  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.5),
    new THREE.MeshStandardMaterial({ color: '#222' })
  );
  stand.position.y = 1.65;
  g.add(stand);
  const foot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.05),
    new THREE.MeshStandardMaterial({ color: '#222' })
  );
  foot.position.y = 1.46;
  g.add(foot);
  // toetsenbord
  const kb = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.05, 0.4),
    new THREE.MeshStandardMaterial({ color: '#1a1a1f', roughness: 0.6 })
  );
  kb.position.set(0, 1.49, 0.6);
  g.add(kb);
  g.userData.glowMat = glowMat;
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function makeMug() {
  const g = new THREE.Group();
  const glowMat = new THREE.MeshStandardMaterial({ color: '#e8552e', roughness: 0.5, emissive: '#000' });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.32, 24), glowMat);
  g.add(body);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.025, 12, 24, Math.PI * 1.3),
    glowMat
  );
  handle.position.set(0.16, 0, 0);
  handle.rotation.z = -0.4;
  g.add(handle);
  const coffee = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.02, 20),
    new THREE.MeshStandardMaterial({ color: '#1c0f08' })
  );
  coffee.position.y = 0.15;
  g.add(coffee);
  // dampje
  const steam = new THREE.Mesh(
    new THREE.PlaneGeometry(0.2, 0.4),
    new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0.08 })
  );
  steam.position.y = 0.4;
  g.add(steam);
  g.userData.glowMat = glowMat;
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function makePegboard(skills) {
  const g = new THREE.Group();
  const glowMat = new THREE.MeshStandardMaterial({ color: '#caa06a', roughness: 0.8, emissive: '#000' });
  const board = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.6, 0.1), glowMat);
  g.add(board);
  // gaatjespatroon-suggestie + "tools"
  const toolColors = ['#ff8a5b', '#5bd1ff', '#b18aff', '#7CFFB2', '#ffd95b', '#ff6f91'];
  const n = Math.min(skills.length, 8);
  for (let i = 0; i < n; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    const x = -1.1 + col * 0.75;
    const y = 0.5 - row * 1.0;
    const tool = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.12),
      new THREE.MeshStandardMaterial({
        color: '#1a1410', emissive: toolColors[i % toolColors.length], emissiveIntensity: 0.5,
      })
    );
    tool.position.set(x, y, 0.12);
    g.add(tool);
  }
  const title = makeTextPlane('SKILLS', {
    color: '#3a2415', w: 400, h: 100, bg: 'transparent',
    font: '700 56px "Space Grotesk", sans-serif',
  });
  title.position.set(0, 1.55, 0.08);
  g.add(title);
  g.userData.glowMat = glowMat;
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function makeCorkboard() {
  const g = new THREE.Group();
  const glowMat = new THREE.MeshStandardMaterial({ color: '#9c6b3f', roughness: 0.95, emissive: '#000' });
  const board = new THREE.Mesh(new THREE.BoxGeometry(3, 2.4, 0.08), glowMat);
  g.add(board);
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.6, 0.06),
    new THREE.MeshStandardMaterial({ color: '#3a2415' })
  );
  frame.position.z = -0.03;
  g.add(frame);
  // post-its
  const noteCols = ['#ffe27a', '#ff9eb5', '#9affc8'];
  for (let i = 0; i < 4; i++) {
    const note = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshStandardMaterial({ color: noteCols[i % 3], roughness: 1 })
    );
    note.position.set(-0.9 + (i % 2) * 1.0, 0.5 - Math.floor(i / 2) * 1.0, 0.06);
    note.rotation.z = (Math.random() - 0.5) * 0.2;
    g.add(note);
  }
  g.userData.glowMat = glowMat;
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function makePlant() {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.3, 0.6, 16),
    new THREE.MeshStandardMaterial({ color: '#8a4a2f', roughness: 0.9 })
  );
  pot.position.y = 0.3;
  pot.castShadow = true;
  g.add(pot);
  const leafMat = new THREE.MeshStandardMaterial({ color: '#3f7a3a', roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.4, 6), leafMat);
    const a = (i / 9) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 0.15, 1.1, Math.sin(a) * 0.15);
    leaf.rotation.set((Math.random() - 0.5) * 0.6, a, (Math.random() - 0.5) * 0.6);
    leaf.castShadow = true;
    g.add(leaf);
  }
  return g;
}

function makeBookStack() {
  const g = new THREE.Group();
  const cols = ['#c4452f', '#2f6cc4', '#2f9c5a', '#c49a2f'];
  let y = 0.1;
  for (let i = 0; i < 4; i++) {
    const h = 0.18;
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(1.1 - i * 0.05, h, 0.8),
      new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.7 })
    );
    book.position.y = y + h / 2;
    book.rotation.y = (Math.random() - 0.5) * 0.3;
    book.castShadow = true;
    g.add(book);
    y += h;
  }
  return g;
}

function buildStool(woodMat) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 20), woodMat);
  seat.position.y = 1.1;
  seat.castShadow = true;
  g.add(seat);
  const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const leg = new THREE.Mesh(legGeo, woodMat);
    leg.position.set(Math.cos(a) * 0.35, 0.55, Math.sin(a) * 0.35);
    leg.rotation.z = Math.cos(a) * 0.12;
    leg.rotation.x = -Math.sin(a) * 0.12;
    leg.castShadow = true;
    g.add(leg);
  }
  return g;
}
