import * as THREE from 'three';

// Beheert hover (gloed + zweven + tooltip) en klik op interactieve objecten.
export function createInteraction({ camera, interactives, canvas, onSelect }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const tooltip = document.getElementById('tooltip');

  let hovered = null;
  let enabled = false;
  let pointerInside = false;
  // onthoud beginwaarden voor zachte terugkeer
  for (const obj of interactives) {
    obj.userData._emi = obj.userData.glow ? obj.userData.glow.emissiveIntensity : 0;
    obj.userData._t = 0; // hover-progressie 0..1
  }

  function setPointer(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    pointer.x = (x / window.innerWidth) * 2 - 1;
    pointer.y = -(y / window.innerHeight) * 2 + 1;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    pointerInside = true;
  }

  window.addEventListener('pointermove', setPointer);

  // Klik = selecteren (maar niet na het slepen van de camera).
  let downPos = null;
  canvas.addEventListener('pointerdown', (e) => {
    downPos = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('pointerup', (e) => {
    if (!enabled || !downPos) return;
    const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
    downPos = null;
    if (moved > 6) return; // het was slepen, geen klik
    if (hovered) onSelect(hovered.userData);
  });

  function setEnabled(v) {
    enabled = v;
  }

  // Per frame aangeroepen.
  function update(dt) {
    if (!enabled) return;

    let nowHover = null;
    if (pointerInside) {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactives, true);
      if (hits.length) {
        // klim omhoog tot het geregistreerde interactive-object
        let o = hits[0].object;
        while (o && !o.userData.interactive) o = o.parent;
        nowHover = o || null;
      }
    }

    if (nowHover !== hovered) {
      hovered = nowHover;
      if (hovered) {
        tooltip.textContent = hovered.userData.label;
        tooltip.classList.add('is-visible');
        canvas.style.cursor = 'pointer';
      } else {
        tooltip.classList.remove('is-visible');
        canvas.style.cursor = 'grab';
      }
    }

    // zachte animatie van alle objecten richting hun doel
    for (const obj of interactives) {
      const target = obj === hovered ? 1 : 0;
      obj.userData._t += (target - obj.userData._t) * Math.min(1, dt * 10);
      const t = obj.userData._t;
      const s = obj.userData.base.scale * (1 + t * 0.12);
      obj.scale.setScalar(s);
      obj.position.y = obj.userData.base.y + t * 0.12 + Math.sin(performance.now() * 0.002 + obj.id) * 0.015 * t;
      if (obj.userData.glow) {
        obj.userData.glow.emissiveIntensity = obj.userData._emi + t * 1.4;
      }
    }
  }

  return { update, setEnabled };
}
