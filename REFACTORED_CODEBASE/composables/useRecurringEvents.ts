import { computed } from 'vue'
import type { Ref } from 'vue'
import type { EventFormState } from './useEventForm'

export interface RecurringEvent {
  start: string
  end: string
  extendedProps: {
    isRecurring: boolean
    recurrenceId: string
    recurrencePattern: EventFormState['recurrencePattern']
  }
}

export function useRecurringEvents(formState: Ref<EventFormState>) {
  const generateRecurringEvents = (baseEvent: RecurringEvent): RecurringEvent[] => {
    const events: RecurringEvent[] = []
    const { frequency, interval, endDate, count } = formState.value.recurrencePattern
    const startDate = new Date(baseEvent.start)
    const endDateObj = endDate ? new Date(endDate) : null
    let currentDate = new Date(startDate)
    let eventCount = 0

    while (true) {
      // Check if we've reached the maximum number of events
      if (count && eventCount >= count) break
      
      // Check if we've reached the end date
      if (endDateObj && currentDate > endDateObj) break

      // Skip the first event as it's already created
      if (eventCount > 0) {
        const eventEnd = new Date(currentDate)
        eventEnd.setDate(eventEnd.getDate() + (new Date(baseEvent.end).getDate() - new Date(baseEvent.start).getDate()))

        events.push({
          start: currentDate.toISOString(),
          end: eventEnd.toISOString(),
          extendedProps: {
            ...baseEvent.extendedProps,
            recurrenceId: `${baseEvent.extendedProps.recurrenceId}-${eventCount}`
          }
        })
      }

      // Increment the date based on frequency and interval
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval)
          break
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * interval))
          break
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + interval)
          break
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + interval)
          break
      }

      eventCount++
    }

    return events
  }

  const getRecurrenceDescription = computed(() => {
    const { frequency, interval, endDate, count } = formState.value.recurrencePattern
    let description = `Repeats every ${interval} ${frequency}`
    
    if (endDate) {
      description += ` until ${new Date(endDate).toLocaleDateString()}`
    } else if (count) {
      description += ` for ${count} ${count === 1 ? 'time' : 'times'}`
    }

    return description
  })

  return {
    generateRecurringEvents,
    getRecurrenceDescription
  }
} 