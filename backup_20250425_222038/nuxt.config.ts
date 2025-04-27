// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
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

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config',
    exposeConfig: false,
    exposeLevel: 2,
    config: {
      content: [
        'components/**/*.{vue,js,ts}',
        'layouts/**/*.vue',
        'pages/**/*.vue',
        'composables/**/*.{js,ts}',
        'plugins/**/*.{js,ts}',
        'App.{js,ts,vue}',
        'app.{js,ts,vue}',
        'Error.{js,ts,vue}',
        'error.{js,ts,vue}',
        'content/**/*.md'
      ]
    }
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
    optimizeDeps: {
      include: [
        '@fullcalendar/core',
        '@fullcalendar/vue3',
        '@fullcalendar/daygrid',
        '@fullcalendar/interaction',
        '@fullcalendar/timegrid',
        '@fullcalendar/list'
      ]
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