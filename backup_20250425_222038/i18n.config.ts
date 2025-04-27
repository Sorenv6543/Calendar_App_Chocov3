export default {
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  defaultLocale: 'en',
  strategy: 'prefix_except_default',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
  },
  locales: [
    {
      code: 'en',
      name: 'English',
      file: 'en.json'
    },
    {
      code: 'es',
      name: 'Español',
      file: 'es.json'
    }
  ],
  lazy: true,
  langDir: 'locales/',
  vueI18n: {
    fallbackLocale: 'en',
    messages: {
      en: {
        welcome: 'Welcome'
      },
      es: {
        welcome: 'Bienvenido'
      }
    }
  }
} 