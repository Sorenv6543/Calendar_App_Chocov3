import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    }),
    // Add visualizer in analyze mode
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
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
      external: [
        '@fullcalendar/core',
        '@fullcalendar/core/index.js',
        '@fullcalendar/core/internal.js',
        '@fullcalendar/core/internal',
        '@fullcalendar/core/preact.js'
      ],
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia', 'vuetify'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'calendar': ['@fullcalendar/vue3', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/interaction'],
        },
      },
    },
  },
      
  // Faster development server:
  server: {
    hmr: { overlay: false }, // Disable error overlay for cleaner dev experience
    host: true, // Expose to network
  },
}))

