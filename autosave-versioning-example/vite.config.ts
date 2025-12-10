import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT || '8008'),
    proxy: {
      '/auth': {
        target: `http://localhost:${process.env.PORT || 3008}`,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
