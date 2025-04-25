import { defineConfig, type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig(
  ({ mode }): UserConfig => ({
    base: "/",
    plugins: [vue(), vueDevTools(), vuetify()],
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
        strict: true, // Restrict serving files outside of root directory
      },
    },

    // Optimize dependencies for faster startup
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "vuetify", "fullcalendar"], // Add your frequently used dependencies
      exclude: [], // Dependencies that should not be pre-bundled
    },

    // esbuild transformation options
    esbuild: {
      target: "esnext",
    },

    // Cache settings for dev mode
    cacheDir: ".vite",

    // Sourcemap generation in dev mode
    build: {
      sourcemap: mode === "development",
      // Splitting chunks for better cache usage
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-vendor": ["vue", "vue-router", "pinia"],
            "ui-vendor": ["vuetify"],
          },
        },
      },
    },
  })
);
