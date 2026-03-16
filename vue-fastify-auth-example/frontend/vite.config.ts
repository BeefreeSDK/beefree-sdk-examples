import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8033,
    strictPort: true,
    proxy: {
      '/auth': { target: 'http://localhost:3033', changeOrigin: true },
      '/template': { target: 'http://localhost:3033', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
