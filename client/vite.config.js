/* eslint-disable no-undef */
const { fileURLToPath, URL } = require('url')
const { defineConfig } = require('vite')
const vue = require('@vitejs/plugin-vue')
const dotenv = require('dotenv')

// .env.development in root folder
if (process.env.NODE_ENV === 'development') dotenv.config({ path: '../.env.development' })

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [vue()],
  ...(process.env.NODE_ENV === 'development' && {
    server: {
      port: process.env.CLIENT_PORT,
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.SERVER_PORT}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', __dirname + '/'))
    }
  }
})
