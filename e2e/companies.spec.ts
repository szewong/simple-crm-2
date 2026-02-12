import { test, expect } from '@playwright/test'

test.describe('Companies', () => {
  test('companies page loads with header and add button', async ({ page }) => {
    await page.goto('/companies')
    await expect(page.getByRole('heading', { name: 'Companies', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /add company/i })).toBeVisible()
  })

  test('new company page loads with form', async ({ page }) => {
    await page.goto('/companies/new')
    await expect(page.getByRole('heading', { name: /new company/i })).toBeVisible()
    await expect(page.getByLabel(/company name/i)).toBeVisible()
    await expect(page.getByLabel(/domain/i)).toBeVisible()
  })

  test('can create a new company', async ({ page }) => {
    await page.goto('/companies/new')

    const timestamp = Date.now()
    const companyName = `E2E Corp ${timestamp}`

    await page.getByLabel(/company name/i).fill(companyName)
    await page.getByLabel(/domain/i).fill(`e2e-${timestamp}.com`)
    await page.getByLabel(/phone/i).fill('+1-555-0200')
    await page.getByLabel(/industry/i).fill('Technology')

    await page.getByRole('button', { name: /create company/i }).click()

    // Should redirect to companies list
    await page.waitForURL(/\/companies$/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/companies$/)
  })

  test('companies list shows created company', async ({ page }) => {
    await page.goto('/companies/new')
    const timestamp = Date.now()
    const companyName = `ListCo ${timestamp}`
    await page.getByLabel(/company name/i).fill(companyName)
    await page.getByRole('button', { name: /create company/i }).click()
    await page.waitForURL(/\/companies$/, { timeout: 10000 })

    await expect(page.getByText(companyName)).toBeVisible()
  })

  test('can navigate to company detail page', async ({ page }) => {
    await page.goto('/companies/new')
    const timestamp = Date.now()
    const companyName = `DetailCo ${timestamp}`
    await page.getByLabel(/company name/i).fill(companyName)
    await page.getByLabel(/industry/i).fill('Finance')
    await page.getByRole('button', { name: /create company/i }).click()
    await page.waitForURL(/\/companies$/, { timeout: 10000 })

    await page.getByText(companyName).first().click()
    await page.waitForURL(/\/companies\/[a-f0-9-]+/, { timeout: 10000 })

    await expect(page.getByRole('heading').filter({ hasText: companyName })).toBeVisible()
  })

  test('company form validates required fields', async ({ page }) => {
    await page.goto('/companies/new')
    await page.getByRole('button', { name: /create company/i }).click()

    // Should show validation error for name
    await expect(page.locator('.text-destructive').first()).toBeVisible()
  })
})
