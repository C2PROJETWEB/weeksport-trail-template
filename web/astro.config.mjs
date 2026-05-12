// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: process.env.PUBLIC_SITE_URL || 'https://weeksport-villerest.pages.dev',
  vite: {
    plugins: [tailwindcss()]
  }
});