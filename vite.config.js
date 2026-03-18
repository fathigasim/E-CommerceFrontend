import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    //  host: '127.0.0.1',  //  Fix: Use IPv4 instead of IPv6 (::1)
    // port: 5174,          //  Fix: Use a different port
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7104',  // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})