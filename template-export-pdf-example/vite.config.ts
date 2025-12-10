import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: parseInt(process.env.VITE_PORT || '8003'),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || 3003}`,
        changeOrigin: true
      },
      '/auth': {
        target: `http://localhost:${process.env.PORT || 3003}`,
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
