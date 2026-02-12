import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5077',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'node14',
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      external: [],
    },
  },
  esbuild: {
    target: 'node14',
    supported: {
      'logical-assignment': false,
      'nullish-coalescing-assignment': false,
      'optional-chaining': true,
      'nullish-coalescing': true
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'node14',
      supported: {
        'logical-assignment': false,
        'nullish-coalescing-assignment': false
      }
    }
  }
})
