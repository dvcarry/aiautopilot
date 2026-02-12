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
    target: 'es2018',
    outDir: 'dist',
    minify: false,
  },
  esbuild: {
    target: 'es2018'
  }
})
