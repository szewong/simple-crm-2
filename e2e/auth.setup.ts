import { test as setup, expect } from '@playwright/test'

const TEST_EMAIL = 'e2etest@simplecrm.com'
const TEST_PASSWORD = 'TestPassword123'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(TEST_EMAIL)
  await page.getByLabel('Password').fill(TEST_PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait for redirect to dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  await expect(page).toHaveURL(/\/dashboard/)

  // Save signed-in state
  await page.context().storageState({ path: 'e2e/.auth/user.json' })
})
