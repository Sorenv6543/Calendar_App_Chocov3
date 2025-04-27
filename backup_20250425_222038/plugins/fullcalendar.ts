import { defineNuxtPlugin } from '#imports'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FullCalendar', FullCalendar)
  
  return {
    provide: {
      fullCalendarPlugins: [
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        interactionPlugin
      ]
    }
  }
}) 