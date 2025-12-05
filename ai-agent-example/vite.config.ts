import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '8029', 10),
    host: true,
    proxy: {
      '/auth': {
        target: `http://localhost:${process.env.PORT || 3029}`,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
