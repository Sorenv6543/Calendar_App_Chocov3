import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface EventFormState {
  selectedHouse: any | null
  startDate: string
  endDate: string
  turn: boolean
  turnDate: string
  turnCheckInTime: string
  turnCheckOutTime: string
  eventNotes: string
  isRecurring: boolean
  recurrencePattern: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate: string | null
    count: number | null
  }
}

export function useEventForm(initialState?: Partial<EventFormState>) {
  // Form state
  const formState = ref<EventFormState>({
    selectedHouse: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    turn: false,
    turnDate: '',
    turnCheckInTime: '',
    turnCheckOutTime: '',
    eventNotes: '',
    isRecurring: false,
    recurrencePattern: {
      frequency: 'weekly',
      interval: 1,
      endDate: null,
      count: null
    },
    ...initialState
  })

  // Validation state
  const validationErrors = ref<Record<string, string>>({})

  // Computed properties
  const isValid = computed(() => {
    return Object.keys(validationErrors.value).length === 0
  })

  const hasRequiredFields = computed(() => {
    return !!formState.value.selectedHouse && 
           !!formState.value.startDate && 
           !!formState.value.endDate
  })

  // Methods
  const validateForm = () => {
    validationErrors.value = {}

    if (!formState.value.selectedHouse) {
      validationErrors.value.house = 'Please select a house'
    }

    if (!formState.value.startDate) {
      validationErrors.value.startDate = 'Start date is required'
    }

    if (!formState.value.endDate) {
      validationErrors.value.endDate = 'End date is required'
    }

    if (formState.value.startDate > formState.value.endDate) {
      validationErrors.value.dateRange = 'End date must be after start date'
    }

    if (formState.value.turn) {
      if (!formState.value.turnDate) {
        validationErrors.value.turnDate = 'Turn date is required'
      }
      if (!formState.value.turnCheckInTime) {
        validationErrors.value.turnCheckInTime = 'Check-in time is required'
      }
      if (!formState.value.turnCheckOutTime) {
        validationErrors.value.turnCheckOutTime = 'Check-out time is required'
      }
    }

    if (formState.value.isRecurring) {
      if (!formState.value.recurrencePattern.frequency) {
        validationErrors.value.recurrenceFrequency = 'Recurrence frequency is required'
      }
      if (formState.value.recurrencePattern.interval < 1) {
        validationErrors.value.recurrenceInterval = 'Interval must be at least 1'
      }
    }

    return isValid.value
  }

  const resetForm = () => {
    formState.value = {
      selectedHouse: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      turn: false,
      turnDate: '',
      turnCheckInTime: '',
      turnCheckOutTime: '',
      eventNotes: '',
      isRecurring: false,
      recurrencePattern: {
        frequency: 'weekly',
        interval: 1,
        endDate: null,
        count: null
      }
    }
    validationErrors.value = {}
  }

  return {
    formState,
    validationErrors,
    isValid,
    hasRequiredFields,
    validateForm,
    resetForm
  }
} 