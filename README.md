# 🪵 3D Portfolio — Cozy Dev Workshop

Een interactieve 3D-CV waarin bezoekers door jouw persoonlijke werkplaats
kunnen rondkijken en op voorwerpen klikken om je projecten, skills, ervaring
en contactgegevens te ontdekken. Gebouwd met **Three.js**, **anime.js** en
**Vite** — volledig statisch, dus gratis en supersnel te hosten.

![stack](https://img.shields.io/badge/three.js-WebGL-orange) ![stack](https://img.shields.io/badge/anime.js-animaties-ff8a5b) ![stack](https://img.shields.io/badge/vite-build-646cff)

## ✨ Wat zit erin?

- 🏠 Een **cozy dev workshop** in 3D die je vrij kan rondraaien (sleep met muis/vinger)
- 📦 **Klikbare voorwerpen**: gloeiende projectdozen, een bureau-monitor (over mij),
  een gereedschapsbord (skills), een prikbord (ervaring) en een koffiemok (contact)
- 🎬 **anime.js-animaties**: intro met staggered tekst, camera-fly-in en soepele reveals
- 📱 Werkt op desktop én mobiel
- ⚡ Geen externe 3D-modellen of textuur-downloads → laadt razendsnel

## 🚀 Aan de slag

```bash
npm install      # dependencies installeren
npm run dev      # lokaal draaien op http://localhost:5173
npm run build    # productieversie bouwen naar /dist
npm run preview  # de gebouwde versie lokaal bekijken
```

## ✏️ Jouw gegevens invullen

Pas **alleen** `src/data/content.js` aan. Daar zet je je naam, rol, projecten,
skills, ervaring en links. De 3D-scene en panelen passen zich automatisch aan.

Wil je een PDF-CV laten downloaden? Zet het bestand in de map `public/`
(bv. `public/cv.pdf`) en vul `cvUrl: '/cv.pdf'` in `content.js` in.

## 🌐 Hosten

De site is een statische build (`npm run build` → map `dist/`), dus je kan hem
overal hosten. Een paar opties:

**Zelf hosten:** upload de inhoud van `dist/` naar je eigen webserver/hosting.

**Vercel of Netlify (gratis, eigen domein mogelijk):**
- Importeer de repo. Build command: `npm run build`, output directory: `dist`.

**GitHub Pages (gratis, optioneel):**
1. Ga in GitHub naar *Settings → Pages → Source* en kies **GitHub Actions**.
2. Start de workflow handmatig via het *Actions*-tabblad → **Deploy naar GitHub Pages**
   → *Run workflow*. Je site komt dan op `https://<gebruikersnaam>.github.io/cv/`.
   *(De workflow staat standaard op handmatig en draait dus niet vanzelf.)*

## 🧩 Structuur

```
src/
├── data/content.js     ← JOUW content (dit pas je aan)
├── style.css           ← alle styling
├── main.js             ← knoopt alles samen + loader
├── scene/
│   ├── world.js        ← renderer, camera, licht, controls
│   ├── shop.js         ← de werkplaats + klikbare objecten
│   ├── interaction.js  ← hover/klik-logica
│   └── textures.js     ← procedurele hout/muur/tekst-texturen
└── ui/
    ├── overlay.js      ← de info-panelen + navigatie
    └── animations.js   ← anime.js intro & reveals
```

Veel plezier ermee! 🎉
