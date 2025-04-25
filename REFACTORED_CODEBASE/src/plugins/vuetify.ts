import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { md3 } from 'vuetify/blueprints';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

// Create Vuetify instance
const vuetify = createVuetify({
  blueprint: md3,
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#6200ea',
          secondary: '#9c27b0',
          accent: '#03dac6',
          error: '#b00020',
          warning: '#fb8c00',
          info: '#2196f3',
          success: '#4caf50',
          background: '#f5f5f5',
          surface: '#ffffff',
        },
      },
      dark: {
        colors: {
          primary: '#bb86fc',
          secondary: '#03dac6',
          accent: '#6200ea',
          error: '#cf6679',
          warning: '#ffab40',
          info: '#64b5f6',
          success: '#81c784',
          background: '#121212',
          surface: '#1e1e1e',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

export default vuetify; 