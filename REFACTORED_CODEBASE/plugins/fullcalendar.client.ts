import { defineNuxtPlugin } from 'nuxt/app'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

export default defineNuxtPlugin((nuxtApp) => {
  // Register FullCalendar component globally
  nuxtApp.vueApp.component('FullCalendar', FullCalendar)
  
  // Provide calendar plugins to be used in components
  return {
    provide: {
      calendarPlugins: {
        dayGrid: dayGridPlugin,
        timeGrid: timeGridPlugin,
        list: listPlugin,
        interaction: interactionPlugin
      }
    }
  }
}) 