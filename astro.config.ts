import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { SITE } from './src/config/site';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  markdown: {
    // Keep punctuation exactly as written (no automatic dashes or curly quotes).
    processor: satteri({ features: { smartPunctuation: false } }),
  },
  devToolbar: {
    enabled: false,
  },
});
