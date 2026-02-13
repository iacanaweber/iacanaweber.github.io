import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  // Change this to your GitHub Pages URL:
  // For user/org site: https://<username>.github.io
  // For project site: https://<username>.github.io/personal_site
  site: 'https://iacanaw.github.io',
  base: '/personal_site',

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
