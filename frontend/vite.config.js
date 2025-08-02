// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    // <--- Add this server config block
    proxy: {
      // Proxy /api requests to our backend server
      "/api": {
        target: "http://localhost:3000", // Your backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Optional: Set to false if backend is not HTTPS
        // Optional: rewrite path if backend expects paths without /api
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
