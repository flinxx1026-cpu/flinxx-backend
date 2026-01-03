import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
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
