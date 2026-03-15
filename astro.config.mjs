// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://mskvitalii.github.io',
  base: '/hiring-github-readme',
  output: 'static',

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
