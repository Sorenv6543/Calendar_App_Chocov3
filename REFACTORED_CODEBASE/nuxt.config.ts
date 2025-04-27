export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [
    ],
    define: {
      'process.env.DEBUG': false,
    },
  },
  css: ['~/assets/css/main.css'],
  build: {
    transpile: ['@fullcalendar/core']
  },
  modules: [
    ['@nuxtjs/color-mode', {
      preference: 'system',
      fallback: 'light',
      classSuffix: ''
    }],
    '@nuxt/ui',
    '@nuxt/image',
    ['@nuxtjs/i18n', {
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
    }],
    '@nuxt/devtools'
  ],
  plugins: [
    { src: '~/plugins/fullcalendar.ts', mode: 'client' }
  ],
  typescript: {
    strict: true,
    typeCheck: true
  }
})


