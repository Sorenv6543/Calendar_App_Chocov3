// Import custom matchers
import './utils/customMatchers'
import { vi, beforeAll, afterAll } from 'vitest'

// Global setup for all tests
beforeAll(() => {
  // Global test setup if needed
})

afterAll(() => {
  // Global test teardown if needed
})

// Mock console methods to keep test output clean
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {}) 