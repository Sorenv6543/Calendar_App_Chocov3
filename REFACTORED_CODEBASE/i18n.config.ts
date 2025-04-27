export const messages = {
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information'
    },
    calendar: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List',
      more: 'More',
      noEvents: 'No events to display',
      addEvent: 'Add Event',
      editEvent: 'Edit Event',
      deleteEvent: 'Delete Event',
      eventTitle: 'Event Title',
      eventDescription: 'Event Description',
      eventStart: 'Start Time',
      eventEnd: 'End Time',
      allDay: 'All Day',
      location: 'Location',
      attendees: 'Attendees'
    },
    validation: {
      required: '{field} is required',
      email: 'Please enter a valid email address',
      minLength: '{field} must be at least {length} characters',
      passwordMismatch: 'Passwords do not match',
      invalidCredentials: 'Invalid email or password'
    }
  }
}

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
        common: {
          welcome: 'Welcome',
          login: 'Login',
          logout: 'Logout',
          register: 'Register',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          submit: 'Submit',
          cancel: 'Cancel',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          back: 'Back',
          next: 'Next',
          previous: 'Previous',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          warning: 'Warning',
          info: 'Information'
        },
        calendar: {
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List',
          more: 'More',
          noEvents: 'No events to display',
          addEvent: 'Add Event',
          editEvent: 'Edit Event',
          deleteEvent: 'Delete Event',
          eventTitle: 'Event Title',
          eventDescription: 'Event Description',
          eventStart: 'Start Time',
          eventEnd: 'End Time',
          allDay: 'All Day',
          location: 'Location',
          attendees: 'Attendees'
        },
        validation: {
          required: '{field} is required',
          email: 'Please enter a valid email address',
          minLength: '{field} must be at least {length} characters',
          passwordMismatch: 'Passwords do not match',
          invalidCredentials: 'Invalid email or password'
        }
      },
      es: {
        welcome: 'Bienvenido'
      }
    }
  },
  messages
} 