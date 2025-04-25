import { expect } from 'vitest'

expect.extend({
  toBeValidCalendarEvent(received) {
    const isValid = received && 
                  typeof received === 'object' &&
                  received.id !== undefined && 
                  received.title !== undefined && 
                  received.start !== undefined && 
                  received.end !== undefined

    return {
      pass: isValid,
      message: () => isValid
        ? `Expected ${JSON.stringify(received)} not to be a valid calendar event`
        : `Expected ${JSON.stringify(received)} to be a valid calendar event with id, title, start and end properties`
    }
  },
  
  toBeValidHouse(received) {
    const isValid = received && 
                  typeof received === 'object' &&
                  received.houseId !== undefined && 
                  received.address !== undefined

    return {
      pass: isValid,
      message: () => isValid
        ? `Expected ${JSON.stringify(received)} not to be a valid house`
        : `Expected ${JSON.stringify(received)} to be a valid house with houseId and address properties`
    }
  }
}) 