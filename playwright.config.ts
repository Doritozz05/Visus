import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 180 * 1000, // 3 minutes max per test
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1, // Single worker to avoid database races in IndexedDB
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'cmd /c npm run dev -- -p 3002',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
});
