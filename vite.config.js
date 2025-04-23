import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",  
  plugins: [
    vue(),
   vueDevTools(),
    vuetify(),
    VitePWA({
      manifest: {
        name: "Vue 3 PWA",
        short_name: "VuePWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
       // Consider adding build optimizations:
       build: {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
        // Chunk splitting for better caching:
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor': ['vue', 'vue-router', 'pinia', 'vuetify'],
            },
          },
        },
      },
      
      // Faster development server:
      server: {
        hmr: { overlay: false }, // Disable error overlay for cleaner dev experience
        host: true, // Expose to network
      },
    });

