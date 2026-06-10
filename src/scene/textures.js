import * as THREE from 'three';

// Procedurele texturen via <canvas> — geen externe image-bestanden nodig,
// dus de site blijft licht en laadt snel.

function makeCanvas(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return { c, ctx: c.getContext('2d') };
}

// Houten vloer/plank met nerf-lijnen.
export function woodTexture({ base = '#6b4423', plank = 14, hue = 18 } = {}) {
  const { c, ctx } = makeCanvas(512);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 512 / plank;
  for (let i = 0; i < plank; i++) {
    const y = i * plankH;
    const shade = 18 + Math.random() * 22;
    ctx.fillStyle = `hsl(${hue + Math.random() * 8}, 45%, ${shade}%)`;
    ctx.fillRect(0, y, 512, plankH - 1);

    // nerven
    for (let n = 0; n < 22; n++) {
      ctx.strokeStyle = `hsla(${hue}, 40%, ${shade - 6}%, ${0.15 + Math.random() * 0.25})`;
      ctx.lineWidth = 0.5 + Math.random();
      ctx.beginPath();
      const yy = y + Math.random() * plankH;
      ctx.moveTo(0, yy);
      ctx.bezierCurveTo(170, yy + (Math.random() - 0.5) * 6, 340, yy + (Math.random() - 0.5) * 6, 512, yy);
      ctx.stroke();
    }
    // donkere voeg tussen planken
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, y, 512, 1.5);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Warme muur met subtiele vlekjes.
export function wallTexture({ base = '#2a2018' } = {}) {
  const { c, ctx } = makeCanvas(256);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(255,200,150,${Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Canvas-tekst op een mesh (bv. naam-bordje, scherm-tekst).
export function textTexture(lines, {
  w = 512, h = 256, bg = '#0c1a16', color = '#7CFFB2',
  font = '28px monospace', pad = 28, align = 'left', accent = '#ff8a5b',
} = {}) {
  const { c, ctx } = makeCanvas();
  c.width = w;
  c.height = h;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  // terminal-balk
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, 0, w, 34);
  [['#ff5f56', 26], ['#ffbd2e', 50], ['#27c93f', 74]].forEach(([col, x]) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, 17, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  const list = Array.isArray(lines) ? lines : [lines];
  let y = 54;
  for (const line of list) {
    ctx.fillStyle = line.startsWith('>') ? accent : color;
    ctx.fillText(line, align === 'center' ? w / 2 : pad, y);
    y += 34;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
