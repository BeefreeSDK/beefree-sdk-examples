import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [],
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
    port: parseInt(process.env.VITE_PORT || '8030', 10),
    host: true,
    proxy: {
      '/auth': {
        target: `http://localhost:${process.env.PORT || 3030}`,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
