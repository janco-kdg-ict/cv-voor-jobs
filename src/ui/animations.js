import { animate, stagger, createTimeline } from 'animejs';

// Splits tekst in losse <span class="char"> voor staggered animaties.
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? ' ' : ch;
    frag.appendChild(span);
  }
  el.appendChild(frag);
  return el.querySelectorAll('.char');
}

// Intro-tekst van de loader laten "invallen".
export function animateLoaderIntro() {
  const nameEl = document.querySelector('[data-split]');
  const chars = splitChars(nameEl);
  animate(chars, {
    translateY: ['120%', '0%'],
    rotateZ: [-12, 0],
    opacity: [0, 1],
    delay: stagger(45),
    duration: 900,
    ease: 'out(4)',
  });
}

// Zachte camera-fly-in: van ver weg naar de werkplek.
export function flyIn({ camera, controls, onDone }) {
  const tl = createTimeline({
    defaults: { ease: 'inOutQuart' },
    onComplete: () => {
      controls.enabled = true;
      onDone?.();
    },
  });
  tl.add(camera.position, {
    x: [0, 0.5],
    y: [9, 3.2],
    z: [17, 9],
    duration: 2200,
  });
  return tl;
}

// Reveal van panel-inhoud (staggered van onder naar boven).
export function revealPanel() {
  const items = document.querySelectorAll('#panel-content .reveal');
  animate(items, {
    translateY: ['18px', '0px'],
    opacity: [0, 1],
    delay: stagger(70, { start: 80 }),
    duration: 600,
    ease: 'out(3)',
  });
  // skill-balken laten vollopen
  const bars = document.querySelectorAll('#panel-content .skill-bar i');
  bars.forEach((bar) => {
    animate(bar, {
      width: ['0%', bar.dataset.level + '%'],
      duration: 900,
      delay: 300,
      ease: 'out(3)',
    });
  });
}

// HUD/nav binnenfaden na de intro.
export function showHud() {
  document.querySelectorAll('.hud').forEach((el) => el.classList.add('is-visible'));
  const navBtns = document.querySelectorAll('#hud-nav button');
  animate(navBtns, {
    translateY: ['-12px', '0px'],
    opacity: [0, 1],
    delay: stagger(60),
    duration: 500,
    ease: 'out(3)',
  });
}
