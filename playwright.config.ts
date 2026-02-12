import { defineConfig, devices } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, 'e2e/.auth/user.json')

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    // Setup project that authenticates
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    // Unauthenticated tests
    {
      name: 'unauthenticated',
      testMatch: /navigation\.spec\.ts|auth\.spec\.ts/,
    },
    // Authenticated tests
    {
      name: 'authenticated',
      testMatch: /contacts\.spec\.ts|companies\.spec\.ts|deals\.spec\.ts|activities\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        storageState: authFile,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
