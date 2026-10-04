// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITIO } from './src/data/restaurante.ts';

export default defineConfig({
  site: SITIO.url,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({ filter: page => !page.includes('/og') }),
  ],
});
