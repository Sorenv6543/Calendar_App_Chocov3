# Testing Guide

This document provides comprehensive information about testing this application.

## Unit Testing with Vitest

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are organized in the `tests` directory with the following structure:

- `tests/components/` - Component tests
- `tests/stores/` - Pinia store tests
- `tests/composables/` - Composables tests
- `tests/services/` - API/Firebase service tests
- `tests/utils/` - Utility function tests

### Writing Component Tests

Here's how to write a basic component test:

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import YourComponent from '@/components/YourComponent.vue'

describe('YourComponent.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(YourComponent)
    expect(wrapper.exists()).toBe(true)
  })
  
  it('handles user interaction', async () => {
    const wrapper = mount(YourComponent)
    await wrapper.find('button').trigger('click')
    // Assert expected behavior
  })
})
```

### Testing Pinia Stores

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useYourStore } from '@/stores/yourStore'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Your Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct state', () => {
    const store = useYourStore()
    expect(store.someValue).toBe(expectedValue)
  })
  
  it('updates state correctly', () => {
    const store = useYourStore()
    store.someAction()
    expect(store.someValue).toBe(newExpectedValue)
  })
})
```

### Mocking Dependencies

Use Vitest's mocking capabilities to mock external dependencies:

```javascript
import { vi } from 'vitest'

// Mock a module
vi.mock('@/services/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'mocked data' })
}))

// Mock a specific function
const mockFn = vi.fn().mockImplementation(() => 'mocked result')
```

### Custom Matchers

The project includes custom test matchers in `tests/utils/customMatchers.js`:

```javascript
// Using custom matchers
expect(event).toBeValidCalendarEvent()
expect(house).toBeValidHouse()
```

## E2E Testing

End-to-end testing can be implemented using Playwright or Cypress. See the `e2e-example.md` file for guidance on setting up Playwright for E2E testing.

## Test Coverage

The test coverage goal for this project is:

- Components: 80%
- Stores: 90%
- Utilities: 90%
- Services: 70%

To view coverage, run:

```bash
npm run test:coverage
```

## Writing Testable Code

Follow these principles to write testable code:

1. **Single Responsibility Principle**: Each component/function should do one thing.
2. **Dependency Injection**: Pass dependencies as props/parameters.
3. **Avoid Direct DOM Manipulation**: Use Vue's reactivity system.
4. **Separate Logic from UI**: Business logic should be in composables or stores.
5. **Avoid Side Effects**: Pure functions are easier to test.

## Common Test Cases

Always test these aspects of components:

1. **Rendering**: Does the component render correctly?
2. **Props**: Does it handle props properly?
3. **User Interaction**: Does it respond to events correctly?
4. **State Changes**: Does internal state update as expected?
5. **Edge Cases**: How does it handle empty data, errors, loading states?

## Debugging Tests

If tests are failing:

1. Use `console.log()` in test files (removed in production)
2. Check if component mounts properly
3. Verify DOM structure with `wrapper.html()`
4. Check if mocks are working properly
5. Ensure asynchronous operations complete before assertions 