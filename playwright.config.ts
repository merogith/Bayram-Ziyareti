import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 90_000,
  use: {
    baseURL: 'http://127.0.0.1:4188/Bayram-Ziyareti/',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'touch', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4188 --strictPort',
    url: 'http://127.0.0.1:4188/Bayram-Ziyareti/',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
