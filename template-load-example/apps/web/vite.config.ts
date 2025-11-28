import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Different port from API
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
