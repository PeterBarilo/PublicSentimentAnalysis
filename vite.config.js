import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/scrape': {
        target: 'http://127.0.0.1:5000',  // Flask backend
        changeOrigin: true,
        secure: false,
      },
      '/sentiment-results': {
        target: 'http://127.0.0.1:5000',  // Flask backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})
