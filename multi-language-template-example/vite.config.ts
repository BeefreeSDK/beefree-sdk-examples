import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

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
    port: parseInt(process.env.VITE_PORT || '8921', 10),
    strictPort: true,
    host: true,
    proxy: {
      '/auth': {
        target: `http://localhost:${process.env.PORT || 3021}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
