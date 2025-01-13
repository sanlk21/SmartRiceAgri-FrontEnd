import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'css',
      transform(code, id) {
        if (id.endsWith('.css')) {
          return {
            code: `
              import { createPopper } from '@popperjs/core';
              ${code}
            `,
            map: null, // return null if no source map
          };
        }
      },
    },
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@context': path.resolve(__dirname, 'src/context'),
      // Add any other necessary aliases
    },
  },
});