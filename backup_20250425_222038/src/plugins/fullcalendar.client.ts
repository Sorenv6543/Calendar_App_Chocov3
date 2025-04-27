import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FullCalendar', FullCalendar)
  
  return {
    provide: {
      fullCalendar: () => ({
        FullCalendar,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]
      })
    }
  }
}) 