import { defineNuxtPlugin } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  // Register FullCalendar components globally
  nuxtApp.vueApp.component('FullCalendar', FullCalendar)
  
  // Export plugins for use in components
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