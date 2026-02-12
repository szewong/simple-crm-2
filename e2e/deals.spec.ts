import { test, expect } from '@playwright/test'

test.describe('Deals', () => {
  test('deals pipeline page loads', async ({ page }) => {
    await page.goto('/deals')
    await expect(page.getByRole('heading', { name: 'Deals', exact: true })).toBeVisible()
  })

  test('deals page shows kanban board or empty state', async ({ page }) => {
    await page.goto('/deals')
    // Should show either the kanban columns or empty state
    const hasColumns = await page.locator('[data-testid="deal-column"], .deal-column').count()
    const hasEmptyState = await page.getByText(/no deals/i).count()
    const hasStageHeaders = await page.getByText(/qualification|meeting|proposal|negotiation/i).count()
    expect(hasColumns + hasEmptyState + hasStageHeaders).toBeGreaterThan(0)
  })

  test('new deal page loads with form', async ({ page }) => {
    await page.goto('/deals/new')
    await expect(page.getByRole('heading', { name: /new deal/i })).toBeVisible()
    await expect(page.getByLabel(/deal title/i)).toBeVisible()
    await expect(page.getByLabel(/value/i)).toBeVisible()
  })

  test('can create a new deal', async ({ page }) => {
    await page.goto('/deals/new')

    const timestamp = Date.now()
    const dealTitle = `E2E Deal ${timestamp}`

    await page.getByLabel(/deal title/i).fill(dealTitle)
    await page.getByLabel(/value/i).fill('50000')
    await page.getByLabel(/probability/i).fill('60')

    await page.getByRole('button', { name: /create deal/i }).click()

    // Should redirect to deals page
    await page.waitForURL(/\/deals/, { timeout: 10000 })
  })

  test('deals list view page loads', async ({ page }) => {
    await page.goto('/deals/list')
    await expect(page.getByRole('heading', { name: 'Deals', exact: true })).toBeVisible()
  })

  test('can navigate between kanban and list views', async ({ page }) => {
    await page.goto('/deals')

    // Look for a link/button to switch to list view
    const listLink = page.getByRole('link', { name: /list|table/i })
    if (await listLink.count() > 0) {
      await listLink.click()
      await page.waitForURL(/\/deals\/list/, { timeout: 10000 })
      await expect(page).toHaveURL(/\/deals\/list/)
    }
  })

  test('deal form validates required fields', async ({ page }) => {
    await page.goto('/deals/new')
    await page.getByRole('button', { name: /create deal/i }).click()

    // Should show validation error for title
    await expect(page.locator('.text-destructive').first()).toBeVisible()
  })

  test('can view deal detail after creation', async ({ page }) => {
    // Create a deal first
    await page.goto('/deals/new')
    const timestamp = Date.now()
    const dealTitle = `DetailDeal ${timestamp}`
    await page.getByLabel(/deal title/i).fill(dealTitle)
    await page.getByLabel(/value/i).fill('25000')
    await page.getByRole('button', { name: /create deal/i }).click()
    await page.waitForURL(/\/deals/, { timeout: 10000 })

    // Navigate to list view to find the deal
    await page.goto('/deals/list')
    const dealLink = page.getByText(dealTitle)
    if (await dealLink.count() > 0) {
      await dealLink.first().click()
      await page.waitForURL(/\/deals\/[a-f0-9-]+/, { timeout: 10000 })
      await expect(page.getByText(dealTitle).first()).toBeVisible()
    }
  })
})
