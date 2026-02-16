import { defineConfig } from 'vite'

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
    port: parseInt(process.env.VITE_PORT || '8007', 10),
    host: true,
    proxy: {
      '/auth': {
        target: `http://localhost:${process.env.PORT || 3007}`,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
