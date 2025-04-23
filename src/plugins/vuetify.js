// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

// Icons
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import { fa } from 'vuetify/iconsets/fa'
import '@fortawesome/fontawesome-free/css/all.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa
    }
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#4169e2',    // Royal blue
          secondary: '#f39abb',  // Soft pink
          accent: '#f4c530',     // Warm yellow/gold
          error: '#e73245',      // Vibrant red
          success: '#00a692',    // Teal green
          'primary-darken-1': '#3a5ecc',
          'secondary-darken-1': '#d988a6',
          background: '#f5f5f5'
        }
      }
    }
  }
})