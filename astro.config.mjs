// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const enableSentry = process.env.ENABLE_SENTRY === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://hiring-github-readme.vercel.app',
  base: '/',
  output: 'static',

  integrations: [
    react(),
    sitemap(),
    ...(enableSentry
      ? [
          sentry({
            project: 'javascript-astro',
            org: 'hiring-github-readme',
            authToken: process.env.SENTRY_AUTH_TOKEN,
          }),
        ]
      : []),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
