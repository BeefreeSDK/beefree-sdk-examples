import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
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
      port: parseInt(env.VITE_PORT) || 8080,
      host: true,
      proxy: {
        '/auth': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
})
