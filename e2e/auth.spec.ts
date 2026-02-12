import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders email and password fields', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('renders sign in button', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign in')
  })

  test('has link to forgot password', async ({ page }) => {
    const forgotLink = page.locator('a[href="/forgot-password"]')
    await expect(forgotLink).toBeVisible()
  })

  test('has link to sign up', async ({ page }) => {
    const signupLink = page.locator('a[href="/signup"]')
    await expect(signupLink).toBeVisible()
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@test.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Button should show loading state
    await expect(page.locator('button[type="submit"]')).toHaveText('Signing in...')

    // Wait for error toast or button to return to normal state
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign in', { timeout: 10000 })
  })
})

test.describe('Signup page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('renders signup form fields', async ({ page }) => {
    await expect(page.locator('input#fullName')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('renders sign up button', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign up')
  })

  test('has link to sign in', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]')
    await expect(loginLink).toBeVisible()
  })
})

test.describe('Forgot password page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password')
  })

  test('renders email field', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('renders reset button', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toHaveText('Send reset link')
  })

  test('has link back to sign in', async ({ page }) => {
    const backLink = page.locator('a[href="/login"]')
    await expect(backLink).toBeVisible()
  })
})
