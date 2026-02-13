import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  // Change this to your GitHub Pages URL:
  // For user/org site: https://<username>.github.io
  // For user site: https://iacanaweber.github.io
  site: 'https://iacanaweber.github.io',
  base: '/',

  integrations: [
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  build: {
    format: 'directory',
  },
});
