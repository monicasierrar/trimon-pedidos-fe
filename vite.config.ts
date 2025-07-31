import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Your Vite app's development port
    proxy: {
      // Proxy requests starting with '/api' to your Express API
      '/api': {
        target: 'http://localhost:3000', // The address of your Express API
        changeOrigin: true, // This is important for virtual hosting scenarios
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: if your API routes don't start with /api
      },
      // You can add more proxies if needed
      // '/another-api': {
      //   target: 'http://localhost:4000',
      //   changeOrigin: true,
      // }
    },
  },
})
