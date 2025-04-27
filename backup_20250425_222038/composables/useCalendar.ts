import { ref, computed } from 'vue'
import type { EventInput } from '@fullcalendar/core'

export function useCalendar() {
  const events = ref<EventInput[]>([])
  const selectedEvent = ref<EventInput | null>(null)
  const calendarView = ref<string>('dayGridMonth')

  const addEvent = (event: EventInput) => {
    events.value.push(event)
  }

  const updateEvent = (eventId: string, updates: Partial<EventInput>) => {
    const index = events.value.findIndex(e => e.id === eventId)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updates }
    }
  }

  const deleteEvent = (eventId: string) => {
    events.value = events.value.filter(e => e.id !== eventId)
  }

  const setSelectedEvent = (event: EventInput | null) => {
    selectedEvent.value = event
  }

  const setCalendarView = (view: string) => {
    calendarView.value = view
  }

  const getEventById = (eventId: string) => {
    return events.value.find(e => e.id === eventId)
  }

  return {
    events: computed(() => events.value),
    selectedEvent: computed(() => selectedEvent.value),
    calendarView: computed(() => calendarView.value),
    addEvent,
    updateEvent,
    deleteEvent,
    setSelectedEvent,
    setCalendarView,
    getEventById
  }
} 