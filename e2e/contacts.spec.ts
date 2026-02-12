import { test, expect } from '@playwright/test'

test.describe('Contacts', () => {
  test('contacts page loads with header and add button', async ({ page }) => {
    await page.goto('/contacts')
    await expect(page.getByRole('heading', { name: 'Contacts', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /add contact/i })).toBeVisible()
  })

  test('new contact page loads with form', async ({ page }) => {
    await page.goto('/contacts/new')
    await expect(page.getByRole('heading', { name: /new contact/i })).toBeVisible()
    await expect(page.getByLabel(/first name/i)).toBeVisible()
    await expect(page.getByLabel(/last name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('can create a new contact', async ({ page }) => {
    await page.goto('/contacts/new')

    const timestamp = Date.now()
    const firstName = `E2E-${timestamp}`
    const lastName = 'TestContact'

    await page.getByLabel(/first name/i).fill(firstName)
    await page.getByLabel(/last name/i).fill(lastName)
    await page.getByLabel(/email/i).fill(`e2e-${timestamp}@test.com`)
    await page.getByLabel(/phone/i).fill('+1-555-0100')
    await page.getByLabel(/job title/i).fill('QA Engineer')

    await page.getByRole('button', { name: /create contact/i }).click()

    // Should redirect to contacts list
    await page.waitForURL(/\/contacts$/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/contacts$/)
  })

  test('contacts list shows created contact', async ({ page }) => {
    // First create a contact
    await page.goto('/contacts/new')
    const timestamp = Date.now()
    await page.getByLabel(/first name/i).fill(`ListTest-${timestamp}`)
    await page.getByLabel(/last name/i).fill('Contact')
    await page.getByLabel(/email/i).fill(`list-${timestamp}@test.com`)
    await page.getByRole('button', { name: /create contact/i }).click()
    await page.waitForURL(/\/contacts$/, { timeout: 10000 })

    // Verify the contact appears in the list
    await expect(page.getByText(`ListTest-${timestamp}`)).toBeVisible()
  })

  test('can navigate to contact detail page', async ({ page }) => {
    // Create a contact first
    await page.goto('/contacts/new')
    const timestamp = Date.now()
    await page.getByLabel(/first name/i).fill(`Detail-${timestamp}`)
    await page.getByLabel(/last name/i).fill('ViewTest')
    await page.getByRole('button', { name: /create contact/i }).click()
    await page.waitForURL(/\/contacts$/, { timeout: 10000 })

    // Click on the contact to view detail
    await page.getByText(`Detail-${timestamp}`).first().click()
    await page.waitForURL(/\/contacts\/[a-f0-9-]+/, { timeout: 10000 })

    // Verify detail page shows contact info
    await expect(page.getByRole('heading').filter({ hasText: `Detail-${timestamp}` })).toBeVisible()
  })

  test('contact form shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/contacts/new')
    await page.getByRole('button', { name: /create contact/i }).click()

    // Should show validation error (first_name is required)
    await expect(page.locator('.text-destructive').first()).toBeVisible()
  })

  test('search input is visible on contacts page', async ({ page }) => {
    await page.goto('/contacts')
    await expect(page.getByPlaceholder(/search/i)).toBeVisible()
  })
})
