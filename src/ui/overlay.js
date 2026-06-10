import { content } from '../data/content.js';
import { revealPanel, showHud } from './animations.js';

const panel = document.getElementById('panel');
const scrim = document.getElementById('panel-scrim');
const panelContent = document.getElementById('panel-content');

// --- Panel-inhoud per type --------------------------------------------------
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderProject(p) {
  return `
    <div class="reveal eyebrow">Project${p.context ? ' · ' + esc(p.context) : ''}</div>
    <h2 class="reveal">${esc(p.title)}</h2>
    <p class="reveal">${esc(p.description)}</p>
    <div class="reveal tags">${(p.stack || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    ${p.highlights && p.highlights.length ? `
      <div class="reveal eyebrow" style="margin-top:1.4rem">Highlights</div>
      <ul class="bullets reveal">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    ${p.impact ? `<p class="reveal impact"><strong>Impact:</strong> ${esc(p.impact)}</p>` : ''}
    ${p.link ? `<a class="reveal panel-link" href="${esc(p.link)}" target="_blank" rel="noopener">Bekijk project →</a>` : ''}
  `;
}

function renderAbout(a) {
  return `
    <div class="reveal eyebrow">${esc(content.role)}</div>
    <h2 class="reveal">${esc(content.name)}</h2>
    ${a.lines.filter(Boolean).map((l) => `<p class="reveal">${esc(l)}</p>`).join('')}
    <a class="reveal panel-link" href="mailto:${esc(content.email)}">Neem contact op →</a>
  `;
}

function renderSkills(skills) {
  return `
    <div class="reveal eyebrow">Skills</div>
    <h2 class="reveal">Waar ik mee werk</h2>
    ${skills.categories.map((c) => `
      <div class="reveal skill-group">
        <h3>${esc(c.title)}</h3>
        <div class="tags">${c.items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>
      </div>`).join('')}
    <div class="reveal eyebrow" style="margin-top:1.6rem">Soft skills</div>
    <ul class="bullets reveal">${skills.soft.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    <div class="reveal eyebrow" style="margin-top:1.6rem">Talen</div>
    <div class="reveal tags">${skills.languages.map((l) => `<span>${esc(l.name)} · ${esc(l.level)}</span>`).join('')}</div>
  `;
}

function renderExperience() {
  return `
    <div class="reveal eyebrow">Parcours</div>
    <h2 class="reveal">Werkervaring</h2>
    ${content.experience.map((e) => `
      <div class="reveal timeline-item">
        <div class="period">${esc(e.period)}</div>
        <h3>${esc(e.role)}</h3>
        <div class="company">${esc(e.company)}</div>
        ${e.bullets ? `<ul class="bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      </div>`).join('')}
    <div class="reveal eyebrow" style="margin-top:1.4rem">Opleiding</div>
    ${content.education.map((e) => `
      <div class="reveal timeline-item">
        <div class="period">${esc(e.period)}</div>
        <h3>${esc(e.title)}</h3>
        <div class="company">${esc(e.school)}</div>
      </div>`).join('')}
  `;
}

function renderContact() {
  const items = [
    { label: 'E-mail', value: content.email, href: `mailto:${content.email}` },
  ];
  if (content.phone) {
    items.push({ label: 'Telefoon', value: content.phone, href: `tel:${content.phone.replace(/\s/g, '')}` });
  }
  for (const s of content.socials) {
    items.push({ label: s.label, value: s.url.replace(/^https?:\/\//, ''), href: s.url });
  }
  if (content.location) items.push({ label: 'Locatie', value: content.location, href: null });
  if (content.cvUrl) items.push({ label: 'CV (PDF)', value: 'Download', href: content.cvUrl });
  return `
    <div class="reveal eyebrow">Contact</div>
    <h2 class="reveal">Laten we praten ☕</h2>
    <p class="reveal">${esc(content.tagline)}</p>
    <div class="reveal contact-grid">
      ${items.map((i) => i.href
        ? `<a href="${esc(i.href)}" target="_blank" rel="noopener">${esc(i.label)}<span>${esc(i.value)}</span></a>`
        : `<div class="contact-static">${esc(i.label)}<span>${esc(i.value)}</span></div>`).join('')}
    </div>
  `;
}

const renderers = {
  project: (d) => renderProject(d.payload),
  about: (d) => renderAbout(d.payload),
  skills: () => renderSkills(content.skills),
  experience: () => renderExperience(),
  contact: () => renderContact(),
};

export function openPanel(userData) {
  const render = renderers[userData.kind];
  if (!render) return;
  panelContent.innerHTML = render(userData);
  panel.classList.add('is-open');
  scrim.classList.add('is-open');
  requestAnimationFrame(revealPanel);
}

export function closePanel() {
  panel.classList.remove('is-open');
  scrim.classList.remove('is-open');
}

// --- HUD opbouwen -----------------------------------------------------------
export function buildHud(onNavSelect) {
  document.getElementById('hud-name').textContent = content.name;
  document.title = `${content.name} — 3D Portfolio`;

  const nav = document.getElementById('hud-nav');
  const links = [
    { label: 'over', kind: 'about', payload: content.about },
    { label: 'skills', kind: 'skills', payload: content.skills },
    { label: 'werk', kind: 'experience', payload: content.experience },
    { label: 'contact', kind: 'contact', payload: null },
  ];
  for (const l of links) {
    const btn = document.createElement('button');
    btn.textContent = l.label;
    btn.addEventListener('click', () => onNavSelect({ kind: l.kind, payload: l.payload, label: l.label }));
    nav.appendChild(btn);
  }
}

// Sluit-knoppen koppelen.
export function wirePanelClose() {
  document.getElementById('panel-close').addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });
}

export { showHud };
