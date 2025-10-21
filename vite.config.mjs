import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint2';


// For documentation see https://vitejs.dev/config/
export default defineConfig({
  base: '/metadata/',          // GitHub Pages subpath
  appType: 'spa',
  plugins: [
    react(), 
    eslint({
      // run ESLint only during dev (serve). Use `eslint .` in CI to fail builds.
      dev: true,
      build: false,
      // keep dev fast and still see results
      lintInWorker: true,
      lintOnStart: true,
      // exclude build products
      exclude: ['node_modules', 'dist']
    })
  ],
  server: { open: true },
  preview: { open: true },
  build: {
    target: 'baseline-widely-available',
    outDir: 'dist'
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true
  }
});
