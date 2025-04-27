// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/postcss',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],



  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  postcss: {
    plugins: {
      options.postcss
    },
  },


  i18n: {
    baseUrl: 'http://localhost:3000',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US'
      }
    ],
    vueI18n: './i18n.config.ts'
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;'
        }
      }
    },
    optimizeDeps: {
      include: [
        '@fullcalendar/core',
        '@fullcalendar/vue3',
        '@fullcalendar/daygrid',
        '@fullcalendar/interaction',
        '@fullcalendar/timegrid',
        '@fullcalendar/list'
      ]
    },
    ssr: {
      noExternal: ['@fullcalendar/core']
    }
  },

  plugins: [
    { src: '~/plugins/fullcalendar.ts', mode: 'client' }
  ],

  typescript: {
    strict: true,
    typeCheck: true
  },

  compatibilityDate: '2025-04-25'
})
