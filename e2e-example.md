# E2E Testing with Playwright

This is a guide for setting up Playwright for end-to-end testing.

## Installation

```bash
# Install Playwright
npm install -D @playwright/test

# Install Playwright browsers
npx playwright install
```

## Example Test Structure

Create a `playwright.config.js` file:

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
```

## Example Login Test

```typescript
// e2e-tests/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should show login form', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for the error message
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should login with valid credentials', async ({ page }) => {
    // Use test credentials - replace with your test user
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    
    // Check if redirect to dashboard occurs
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
  });
});
```

## Example Calendar Test

```typescript
// e2e-tests/calendar.spec.ts
import { test, expect } from '@playwright/test';

// Helper to login before tests
async function login(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
}

test.describe('Calendar functionality', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/calendar');
  });

  test('should show calendar view', async ({ page }) => {
    await expect(page.locator('.fc-toolbar')).toBeVisible();
    await expect(page.locator('.fc-daygrid-body')).toBeVisible();
  });

  test('should be able to create an event', async ({ page }) => {
    // Click on a day in the calendar
    await page.click('.fc-day[data-date="2023-09-15"]');
    
    // Wait for modal to appear
    await expect(page.locator('.event-modal')).toBeVisible();
    
    // Fill in event details
    await page.fill('input[name="title"]', 'Test Event');
    await page.fill('textarea[name="description"]', 'Test description');
    
    // Submit the form
    await page.click('button.save-event');
    
    // Verify event appears on calendar
    await expect(page.locator('.fc-event-title:has-text("Test Event")')).toBeVisible();
  });
});
```

## Running E2E Tests

Add these scripts to your package.json:

```json
{
  "scripts": {
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:report": "playwright show-report"
  }
}
```

Run the tests:

```bash
# Run all E2E tests
npm run e2e

# Run tests with UI
npm run e2e:ui

# Show test report
npm run e2e:report
``` 