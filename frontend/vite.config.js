import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
  plugins: [react()],
  build: {
    // ✅ NO sourcemaps in production — code stays obfuscated in DevTools
    sourcemap: false,
    // ✅ Use esbuild for fastest, most aggressive minification
    minify: 'esbuild',
    // ✅ CSS also minified in production
    cssMinify: true,
    // ✅ Aggressive target for maximum compression
    target: 'es2015',
    // ✅ Increase chunk warning limit (we optimize via manual chunks)
    chunkSizeWarningLimit: 1000,
    // ✅ Ensure clean output directory on every build
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // ✅ Split vendor code into separate chunks for caching + obfuscation
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-socket': ['socket.io-client'],
        },
        // ✅ Hash-only filenames — no human-readable names in production bundles
        chunkFileNames: 'assets/js/[hash].js',
        entryFileNames: 'assets/js/[hash].js',
        assetFileNames: 'assets/[ext]/[hash].[ext]',
      },
      // ✅ Tree-shake aggressively — remove unused exports
      treeshake: {
        moduleSideEffects: true,
        preset: 'recommended',
      },
    },
  },
  esbuild: {
    // ✅ PRIMARY MECHANISM: Remove ALL console.* and debugger at AST level during build
    // This is 100% reliable — the calls are physically deleted from the output bundle
    ...(isProd ? {
      drop: ['console', 'debugger'],
      // ✅ Mark common logging wrappers as pure — tree-shaker removes them
      pure: ['console.log', 'console.info', 'console.warn', 'console.debug', 'console.trace'],
      legalComments: 'none',
      // ✅ Mangle variable names for maximum obfuscation
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    } : {
      // Development: keep all logs for debugging
      drop: [],
    }),
  },
  server: {
    port: 3003,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      'localhost:3003',
      '127.0.0.1'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
};
})
