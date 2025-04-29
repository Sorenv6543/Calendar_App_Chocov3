import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",  
  plugins: [
    vueDevTools({
      enabled: true,
      trace: true,


      traceLimit: 1000,
      traceAll: true,
      
    }), 
    vue(),
    vuetify(),  
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // Faster development server:
  server: {
    hmr: { overlay: false }, // Disable error overlay for cleaner dev experience
    host: false, // Expose to network,
    open: true, // Auto-open browser on server start
    fs: {
      strict: false, // Restrict serving files outside of root directory
    },
  },



  // esbuild transformation options
  esbuild: {
    target: 'esnext'
  },

  // Cache settings for dev mode
  cacheDir: '.vite',
  
  // Sourcemap generation in dev mode
  build: {
    sourcemap: mode === 'development',

    // Splitting chunks for better cache usage
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['vuetify']
        }
      }
    }
  }
}))

