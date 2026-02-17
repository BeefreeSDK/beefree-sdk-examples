import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
      port: parseInt(env.VITE_PORT || '8030', 10),
      host: true,
      proxy: {
        '/auth': {
          target: `http://localhost:${env.PORT || 3030}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
