import { defineConfig } from 'vite';

export default defineConfig({
  // Relatieve paden -> werkt zowel op een eigen domein (Vercel/Netlify)
  // als in een subfolder (GitHub Pages: gebruiker.github.io/cv/).
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
