import { defineConfig } from 'vite'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  base: './',
  server: {
    port: process.env.PORT,
  },
})
