import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'https://d1pphanrf0qsx7.cloudfront.net',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'https://d1pphanrf0qsx7.cloudfront.net',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
