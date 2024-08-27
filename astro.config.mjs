import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://daveFromGrogtag.github.io',
  base: 'MIS-Pro',
  integrations: [react()]
});