// @ts-check
require('dotenv').config({ override: true }); // must stay the very first line

const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000, // per-test default; individual tests override this via test.setTimeout()

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* IMPORTANT: workers is forced to 1. The app enforces single-session-per-
     account, and all tests here log in with the SAME MYCOACH_USERNAME. With
     workers > 1, one worker's login silently kicks out another worker's
     already-active session — this isn't test flakiness, it's the app's
     real single-session security behavior colliding with parallel execution.
     Only raise this again if/when separate credentials exist per worker. */
  workers: 1,
  /* Multiple reporters: a live terminal summary while running, a
     self-contained interactive HTML report you can open or zip and share,
     and a JSON file with the raw pass/fail data if you ever want to parse
     it (e.g. paste a summary elsewhere, or feed it into another tool). */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  /* Shared settings for all the projects below. */
  use: {
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers.
     NOTE: only chromium is enabled here on purpose — these session-timeout
     tests are long (real wall-clock waits), and this suite isn't testing
     browser-specific rendering, so running it x3 across chromium/firefox/
     webkit would triple runtime for no real benefit. Uncomment the others
     if/when you specifically need cross-browser coverage. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});