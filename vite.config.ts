import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MonoS/',
  worker: {
    format: 'es'
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true,
      timeout: 1000
    },
    open: true,
    host: true
  }
}) 