import { defineStore } from 'pinia'
import type {
  CalendarEvent,
  CalendarViewType,
  CalendarConfig,
  TimeSlot,
  CalendarFilters
} from '@/models'

interface CalendarStoreState {
  events: CalendarEvent[]
  currentView: CalendarViewType
  selectedDate: Date | null
  selectedEvent: CalendarEvent | null
  config: CalendarConfig
  filters: CalendarFilters
  loading: boolean
  error: string | null
}

export const useCalendarStore = defineStore('calendar', {
  state: (): CalendarStoreState => ({
    events: [],
    currentView: 'dayGridMonth',
    selectedDate: null,
    selectedEvent: null,
    config: {
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        startTime: '09:00',
        endTime: '17:00'
      }
    },
    filters: {},
    loading: false,
    error: null
  }),

  getters: {
    filteredEvents: (state) => {
      let events = [...state.events]

      // Apply filters
      if (state.filters.userId) {
        events = events.filter(event => event.userId === state.filters.userId)
      }
      if (state.filters.houseId) {
        events = events.filter(event => event.houseId === state.filters.houseId)
      }
      if (state.filters.dateRange) {
        events = events.filter(event => {
          const eventDate = new Date(event.start)
          const startDate = new Date(state.filters.dateRange!.start)
          const endDate = new Date(state.filters.dateRange!.end)
          return eventDate >= startDate && eventDate <= endDate
        })
      }

      return events
    },
    isLoading: (state) => state.loading,
    calendarError: (state) => state.error
  },

  actions: {
    async fetchEvents(filters: CalendarFilters = {}) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual events fetch from Firebase
        this.filters = filters
        // Mock data for now
        this.events = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch events'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual event creation in Firebase
        const newEvent: CalendarEvent = {
          ...event,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.events.push(newEvent)
        return newEvent
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add event'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEvent(eventId: string, updates: Partial<CalendarEvent>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual event update in Firebase
        const index = this.events.findIndex(event => event.id === eventId)
        if (index !== -1) {
          this.events[index] = {
            ...this.events[index],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update event'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEvent(eventId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual event deletion in Firebase
        this.events = this.events.filter(event => event.id !== eventId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete event'
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentView(view: CalendarViewType) {
      this.currentView = view
    },

    setSelectedDate(date: Date | null) {
      this.selectedDate = date
    },

    setSelectedEvent(event: CalendarEvent | null) {
      this.selectedEvent = event
    },

    updateConfig(config: Partial<CalendarConfig>) {
      this.config = { ...this.config, ...config }
    }
  }
}) 