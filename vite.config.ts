import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxyar `/api/*` para o backend remoto para evitar problemas de CORS em desenvolvimento
      '/api': {
        target: 'https://kong-b97fc7d5c3uskyjyt.kongcloud.dev/estoque',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
