# Calendar App Testing Guide

This document provides guidelines for testing the Calendar application using Vitest.

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests once
npm run test

# Run tests in watch mode (automatically reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Using the Test Runner Script

For more flexibility, you can use the test runner scripts:

**Windows:**
```cmd
# Run all tests once
scripts\run-tests.bat

# Run tests in watch mode
scripts\run-tests.bat -w

# Run tests with coverage
scripts\run-tests.bat -c

# Run specific tests
scripts\run-tests.bat -f FullCalendar

# See all options
scripts\run-tests.bat -h
```

**Unix/Linux/Mac:**
```bash
# Make the script executable first
chmod +x scripts/run-tests.sh

# Run all tests once
scripts/run-tests.sh

# Run tests in watch mode
scripts/run-tests.sh -w

# Run tests with coverage
scripts/run-tests.sh -c

# Run specific tests
scripts/run-tests.sh -f FullCalendar

# See all options
scripts/run-tests.sh -h
```

## Test Files Structure

- `src/components/__tests__/` - Contains component tests
- `src/components/__tests__/helpers/` - Contains test helper functions

## Writing New Tests

1. Create a new test file with the pattern `ComponentName.spec.ts` in the `__tests__` directory
2. Use the helper functions from `calendarTestUtils.ts` to create mock data
3. Follow the existing test patterns for consistency

## Mocking Dependencies

When testing components with external dependencies (Firebase, etc.), always use the mock functions provided in the test files.

## Test File Structure

Each test file should follow this structure:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentToTest from '../ComponentToTest.vue'
// Import helper functions and types

// Mock dependencies

describe('ComponentToTest.vue', () => {
  let wrapper
  
  beforeEach(() => {
    // Setup code
  })
  
  afterEach(() => {
    // Cleanup code
  })
  
  it('should test specific functionality', async () => {
    // Test code
    expect(result).toBe(expectedValue)
  })
})
```

## Best Practices

1. Test one thing per test
2. Use descriptive test names
3. Mock external dependencies
4. Focus on testing behavior, not implementation details
5. Keep tests independent (no test should depend on another test)
6. Clean up after tests (in afterEach or afterAll hooks)

## Coverage Goals

We aim for:
- 80% line coverage
- 70% branch coverage
- 80% function coverage
- 70% statement coverage 