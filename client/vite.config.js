/* eslint-disable no-undef */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

// .env.development in root folder
if (process.env.NODE_ENV === 'development') dotenv.config({ path: '../.env.development' })
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  ...(process.env.NODE_ENV === 'development' && {
    server: {
      port: process.env.CLIENT_PORT,
      proxy: {
        '/api': {
          target: `https://localhost:${process.env.SERVER_PORT}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
