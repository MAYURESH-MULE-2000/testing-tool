import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the SauceDemo automation project.
 *
 * Two projects are defined so that UI and API tests can share one repo
 * without fighting over `baseURL`:
 *   - "ui"  -> runs everything except /tests/api against https://www.saucedemo.com
 *   - "api" -> runs only /tests/api against the public reqres.in test API
 */
export default defineConfig({
  testDir: './tests',

  // Fail the whole run if a test.only was accidentally committed.
  forbidOnly: !!process.env.CI,

  // Tests are independent, so they can safely run in parallel.
  fullyParallel: true,

  // One retry on CI only - keeps local runs honest about flaky tests.
  retries: process.env.CI ? 1 : 0,

  // Playwright's built-in HTML report (opened with `npx playwright show-report`).
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // Capture debugging artefacts only when something actually fails.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'ui',
      testIgnore: '**/api/**',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      name: 'api',
      testMatch: '**/api/**',
      use: {
        baseURL: 'https://reqres.in',
        // reqres.in requires a free API key header on its public endpoints.
        extraHTTPHeaders: {
          'x-api-key': 'reqres-free-v1',
        },
      },
    },
  ],
});
