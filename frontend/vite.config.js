import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    // Proxy /api requests to the FastAPI backend so the frontend never has to
    // hard-code the backend origin.
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Required for Chrome/Electron source-map debugging
  },
})
