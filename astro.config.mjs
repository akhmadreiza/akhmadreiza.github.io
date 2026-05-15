// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://akhmadreiza.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      transformers: [
        {
          line(node) {
            if (node.properties?.style) {
              node.properties.style = node.properties.style
                .replace(/background-color:\s*[^;]+;?\s*/gi, '')
                .replace(/background:\s*[^;]+;?\s*/gi, '');
            }
          },
        },
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
