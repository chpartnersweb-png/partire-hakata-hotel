// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/data/site.mjs';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  output: 'static',
  devToolbar: { enabled: false },
});
