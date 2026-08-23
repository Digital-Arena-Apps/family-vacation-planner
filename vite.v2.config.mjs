import { defineConfig } from 'vite';

export default defineConfig({
  root: 'v2',
  base: '/',
  build: {
    outDir: '../dist-v2',
    emptyOutDir: true,
    target: 'es2020'
  }
});
