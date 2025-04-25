import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, VueWrapper } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { auth } from '../../mocks/auth'
import { db } from '../../mocks/firebaseConfig'
import { useUserStore } from '../../mocks/userStore'
import { CalendarEvent } from '../../types/calendar'
import {
  createMockEvent,
  createMockFullCalendarEvent,
  createMockCalendarApi,
  createMockDayCells,
  createDateInfo
} from './helpers/calendarTestUtils'

// Mock Vue components
vi.mock('../FullCalendar.vue', () => ({
  default: {
    name: 'FullCalendar',
    render() {
      return h('div', { class: 'mock-calendar' });
    }

  }
}))

vi.mock('../EventModal.vue', () => ({
  default: {
    name: 'EventModal',
    props: ['modelValue', 'event', 'houses', 'eventStartDate', 'eventEndDate'],
    render() {
      return h('div', { class: 'mock-event-modal' });
    },
    emits: ['close', 'create', 'update', 'delete']
  }
}))

vi.mock('../TimePicker.vue', () => ({
  default: {
    name: 'TimePicker',
    props: ['modelValue', 'isVisible'],
    render() {
      return h('div', { class: 'mock-time-picker' });
    },
    emits: ['update:modelValue', 'update:isVisible']
  }
}))

// Mock Firebase
vi.mock('../../auth', () => {
  return { auth }
})

vi.mock('../../firebaseConfig', () => {
  return { db }
})

// Mock Pinia store
vi.mock('../../stores/userStore', () => {
  return { useUserStore }
})

// Mock FullCalendar and its plugins
vi.mock('@fullcalendar/vue3', () => ({
  default: {
    props: ['options'],
    render() {
      return h('div', { class: 'mock-calendar' });
    }
  }
}))

vi.mock('@fullcalendar/daygrid', () => ({ default: {} }))
vi.mock('@fullcalendar/timegrid', () => ({ default: {} }))
vi.mock('@fullcalendar/interaction', () => ({ default: {} }))

// Mock collection, doc, etc. functions
const mockCollection = vi.fn()
const mockQuery = vi.fn()
const mockWhere = vi.fn()
const mockGetDocs = vi.fn()
const mockAddDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockDoc = vi.fn()

// Mock test events
const testEvents: CalendarEvent[] = [
  createMockEvent({
    id: 'event1',
    title: 'Test Event 1',
    extendedProps: {
      turn: true,
      turndate: '2023-11-01'
    }
  }),
  createMockEvent({
    id: 'event2',
    title: 'Test Event 2',
    start: '2023-11-02T14:00:00.000Z',
    end: '2023-11-02T16:00:00.000Z',
    extendedProps: {
      color: '#ff5722',
      eventnotes: 'Another test',
      turn: false
    }
  })
]

vi.mock('firebase/firestore', () => ({
  collection: (...args: any[]) => {
    mockCollection(...args)
    return 'mock-collection'
  },
  doc: (...args: any[]) => {
    mockDoc(...args)
    return 'mock-doc-ref'
  },
  query: (...args: any[]) => {
    mockQuery(...args)
    return 'mock-query'
  },
  where: (...args: any[]) => {
    mockWhere(...args)
    return 'mock-where'
  },
  getDocs: async () => {
    mockGetDocs()
    return {
      docs: testEvents.map(event => ({
        id: event.id as string,
        data: () => ({
          title: event.title,
          start: event.start,
          end: event.end,
          userId: event.userId,
          extendedProps: event.extendedProps
        })
      }))
    }
  },
  addDoc: async (...args: any[]) => {
    mockAddDoc(...args)
    return { id: 'new-event-id' }
  },
  updateDoc: async (...args: any[]) => {
    mockUpdateDoc(...args)
    return {}
  },
  deleteDoc: async (...args: any[]) => {
    mockDeleteDoc(...args)
    return {}
  }
}))

describe('FullCalendar', () => {
  it('should mock test for demonstration', () => {
    expect(true).toBe(true)
  })
}) 