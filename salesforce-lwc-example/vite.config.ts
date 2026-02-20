import { defineConfig, loadEnv } from 'vite'
import lwc from 'vite-plugin-lwc'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      lwc({
        modules: [
          { dir: 'src/modules' }
        ],
      }),
    ],
    root: '.',
    publicDir: 'public',
    server: {
      port: Number(env.VITE_PORT) || 8031,
      host: true,
      proxy: {
        '/auth': {
          target: `http://localhost:${env.PORT || 3031}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        // Stubs for Salesforce-specific modules (used in local dev)
        'lightning/platformResourceLoader': path.resolve(__dirname, 'stubs/lightning/platformResourceLoader.js'),
        '@salesforce/resourceUrl/beefree_sdk': path.resolve(__dirname, 'stubs/@salesforce/resourceUrl/beefree_sdk.js'),
        '@salesforce/apex/BeefreeAuthController.getAuthToken': path.resolve(__dirname, 'stubs/@salesforce/apex/BeefreeAuthController.getAuthToken.js'),
        '@salesforce/apex/BeefreeAuthController.getTemplate': path.resolve(__dirname, 'stubs/@salesforce/apex/BeefreeAuthController.getTemplate.js'),
      },
    },
    optimizeDeps: {
      include: ['lwc', '@beefree.io/sdk'],
    },
  }
})
