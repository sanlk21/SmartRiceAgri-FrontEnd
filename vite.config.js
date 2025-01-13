import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: ['tailwindcss', 'autoprefixer'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true
  }
});