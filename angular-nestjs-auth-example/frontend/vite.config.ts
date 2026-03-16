import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    port: 8034,
    strictPort: true,
    proxy: {
      '/auth': { target: 'http://localhost:3034', changeOrigin: true },
      '/template': { target: 'http://localhost:3034', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
