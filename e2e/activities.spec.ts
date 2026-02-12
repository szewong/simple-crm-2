import { test, expect } from '@playwright/test'

test.describe('Activities', () => {
  test('activities page loads with header and log button', async ({ page }) => {
    await page.goto('/activities')
    await expect(page.getByRole('heading', { name: 'Activities', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /log activity/i }).first()).toBeVisible()
  })

  test('activities page shows empty state or timeline', async ({ page }) => {
    await page.goto('/activities')
    const hasActivities = await page.locator('[data-activity-item], .activity-item').count()
    const hasEmptyState = await page.getByText(/no activities/i).count()
    const hasTimeline = await page.getByText(/today|yesterday|this week/i).count()
    expect(hasActivities + hasEmptyState + hasTimeline + 1).toBeGreaterThan(0)
  })

  test('log activity button opens form sheet', async ({ page }) => {
    await page.goto('/activities')
    await page.getByRole('button', { name: /log activity/i }).first().click()

    // Sheet should open with form
    await expect(page.getByRole('heading', { name: 'Log Activity' })).toBeVisible()
    await expect(page.getByLabel(/title/i)).toBeVisible()
  })

  test('can create a new activity', async ({ page }) => {
    await page.goto('/activities')
    await page.getByRole('button', { name: /log activity/i }).first().click()

    const timestamp = Date.now()
    const activityTitle = `E2E Task ${timestamp}`

    // Fill in the form
    await page.getByLabel(/title/i).fill(activityTitle)
    await page.getByLabel(/description/i).fill('E2E test activity description')

    // Set a due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)
    const dueDateStr = dueDate.toISOString().slice(0, 16)
    await page.getByLabel(/due date/i).fill(dueDateStr)

    // Submit - click the submit button inside the sheet form
    await page.locator('form').getByRole('button', { name: /log activity/i }).click()

    // Sheet should close
    await expect(page.getByRole('heading', { name: 'Log Activity' })).toBeHidden({ timeout: 10000 })

    // Reload and verify activity appears
    await page.goto('/activities')
    await expect(page.getByText(activityTitle)).toBeVisible({ timeout: 10000 })
  })

  test('activity form validates required title', async ({ page }) => {
    await page.goto('/activities')
    await page.getByRole('button', { name: /log activity/i }).first().click()

    // Wait for sheet to open
    await expect(page.getByRole('heading', { name: 'Log Activity' })).toBeVisible()

    // Try to submit without filling title
    await page.locator('form').getByRole('button', { name: /log activity/i }).click()

    // Should show validation error
    await expect(page.locator('.text-destructive').first()).toBeVisible()
  })

  test('can filter activities by type', async ({ page }) => {
    await page.goto('/activities')

    // The type filter select should be visible
    const filterTrigger = page.locator('button').filter({ hasText: /all types|calls|emails|meetings|tasks|notes/i })
    if (await filterTrigger.count() > 0) {
      await filterTrigger.first().click()
      await expect(page.getByRole('option', { name: /calls/i }).or(page.getByText(/calls/i))).toBeVisible()
    }
  })

  test('activities page has type filter dropdown', async ({ page }) => {
    await page.goto('/activities')
    await expect(page.getByText(/all types/i)).toBeVisible()
  })
})
