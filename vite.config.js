import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import vuetify from "vite-plugin-vuetify";

import vueDevTools from 'vite-plugin-vue-devtools'
import { sourceMapsEnabled } from "process";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",  
  plugins: [
    vue(),
   vueDevTools(),
    vuetify(),

  ],
    sourceMapsEnabled: {
    enabled: true,
    sourceMap: true,
    sourceMapInlineSources: true,
    sourceMapInlineSourcesContent: true,
  },


      // Faster development server:
      server: {
        hmr: { overlay: false }, // Disable error overlay for cleaner dev experience
    host: false, // Expose to network,
    open: true, // Auto-open browser on server start
    fs: {
      
      strict: true,
    },
  },

  // Optimize dependencies for faster startup
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify', 'fullcalendar'], // Add your frequently used dependencies
    exclude: [], // Dependencies that should not be pre-bundled
  },

  // esbuild transformation options
  esbuild: {
    target: 'esnext'
  },

  // Cache settings for dev mode
  cacheDir: '.vite',
  
  sourceMapsEnabled: {
    enabled: true,
    sourceMap: true,
    sourceMapInlineSources: true,
    sourceMapInlineSourcesContent: true,
  }




})

