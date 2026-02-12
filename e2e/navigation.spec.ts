import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('unauthenticated user is redirected to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from contacts', async ({ page }) => {
    await page.goto('/contacts')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from companies', async ({ page }) => {
    await page.goto('/companies')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from deals', async ({ page }) => {
    await page.goto('/deals')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from activities', async ({ page }) => {
    await page.goto('/activities')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user is redirected to login from settings', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page is accessible without auth', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('[data-slot="card-title"]')).toHaveText('Sign in')
  })

  test('signup page is accessible without auth', async ({ page }) => {
    await page.goto('/signup')
    await expect(page).toHaveURL(/\/signup/)
    await expect(page.locator('text=Create an account')).toBeVisible()
  })

  test('forgot-password page is accessible without auth', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page).toHaveURL(/\/forgot-password/)
    await expect(page.locator('text=Reset your password')).toBeVisible()
  })
})
