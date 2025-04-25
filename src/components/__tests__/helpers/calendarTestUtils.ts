import { vi } from 'vitest'
import { CalendarEvent, CalendarEventExtendedProps } from '../../../types/calendar'

/**
 * Creates a mock calendar event with default values that can be overridden
 */
export function createMockEvent(override: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: `event-${Math.floor(Math.random() * 1000)}`,
    title: 'Test Event',
    start: '2023-11-01T10:00:00.000Z',
    end: '2023-11-01T12:00:00.000Z',
    userId: 'test-user-id',
    extendedProps: {
      color: '#2979ff',
      eventnotes: 'Test notes',
      turn: false,
      ...override.extendedProps
    },
    ...override
  }
}

/**
 * Creates a mock FullCalendar event object with the properties expected by FullCalendar
 */
export function createMockFullCalendarEvent(override: Partial<any> = {}) {
  return {
    id: `event-${Math.floor(Math.random() * 1000)}`,
    title: 'Test Event',
    start: new Date('2023-11-01T10:00:00.000Z'),
    end: new Date('2023-11-01T12:00:00.000Z'),
    extendedProps: {
      color: '#2979ff',
      eventnotes: 'Test notes',
      turn: false,
    },
    setProp: vi.fn(),
    setStart: vi.fn(),
    setEnd: vi.fn(),
    setExtendedProp: vi.fn(),
    remove: vi.fn(),
    ...override
  }
}

/**
 * Creates a mock calendar API object with common methods
 */
export function createMockCalendarApi(events: any[] = []) {
  return {
    changeView: vi.fn(),
    refetchEvents: vi.fn(),
    unselect: vi.fn(),
    prev: vi.fn(),
    next: vi.fn(),
    getEvents: vi.fn(() => events),
    getEventById: vi.fn((id) => events.find(event => event.id === id)),
  }
}

/**
 * Creates a mock for document.querySelectorAll to use in turn day highlight tests
 */
export function createMockDayCells(turnDates: string[] = []) {
  // Create an array of day cells, some with turn dates
  return Array.from({ length: 7 }, (_, i) => {
    const date = `2023-11-0${i + 1}`
    const hasTurn = turnDates.includes(date)
    
    return {
      getAttribute: () => date,
      classList: {
        contains: () => hasTurn,
        add: vi.fn(),
        remove: vi.fn()
      }
    }
  })
}

/**
 * Creates a date info object as used by FullCalendar
 */
export function createDateInfo(start: string, end: string) {
  return {
    start: new Date(start),
    end: new Date(end),
    startStr: start,
    endStr: end
  }
} 