// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5173, // ✅ Lock dev port so CORS origin never drifts
    proxy: {
      // ✅ All /api/* requests in dev → forwarded to backend
      // Browser sees: http://localhost:5173/api/search/all-books
      // Vite forwards: https://smartlib-xgxi.onrender.com/search/all-books
      // CORS never triggered because request comes from server, not browser
      "/api": {
        target: "https://smartlib-xgxi.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("❌ Proxy error:", err.message);
          });
          proxy.on("proxyReq", (_, req) => {
            console.log("🔀 Proxying:", req.method, req.url);
          });
        },
      },
    },
  },
})