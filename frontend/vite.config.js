import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: 'dist2',
    sourcemap: true,
    minify: 'esbuild'
  },
  plugins: [react()],
  server: {
    port: 3003,
    proxy: {
      '/api': 'https://flinxx-backend.onrender.com'
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    },
    middlewareMode: false,
    middleware: [
      (req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none')
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none')
        res.removeHeader('Cross-Origin-Resource-Policy')
        next()
      }
    ]
  }
})
