import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Change the target dynamically based on the environment
        target: process.env.VITE_API_URL || 'https://127.0.0.1:5000',
        changeOrigin: true,
        secure: false, // Important for local self-signed certs
      },
    },
  },
})
