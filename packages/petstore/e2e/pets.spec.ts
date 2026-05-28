import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page, request }) => {
  // Reset server state before each test for isolation
  await request.delete('/api/pets')
  await page.goto('/')
})

test('shows empty state on first load', async ({ page }) => {
  await expect(page.getByTestId('empty-state')).toBeVisible()
})

test('can add a pet and see it in the list', async ({ page }) => {
  await page.getByTestId('pet-name').fill('Buddy')
  await page.getByTestId('pet-species').fill('Dog')
  await page.getByTestId('add-pet').click()

  await expect(page.getByTestId('pet-row')).toBeVisible()
  await expect(page.getByTestId('pet-name-display').first()).toHaveText('Buddy')
  await expect(page.getByTestId('pet-species-display').first()).toHaveText('Dog')
  await expect(page.getByTestId('empty-state')).not.toBeVisible()
})

test('can delete a pet', async ({ page }) => {
  // Add first
  await page.getByTestId('pet-name').fill('Whiskers')
  await page.getByTestId('pet-species').fill('Cat')
  await page.getByTestId('add-pet').click()
  await expect(page.getByTestId('pet-row')).toBeVisible()

  // Delete
  await page.getByTestId('delete-pet').first().click()
  await expect(page.getByTestId('pet-row')).not.toBeVisible()
  await expect(page.getByTestId('empty-state')).toBeVisible()
})

test('can add multiple pets', async ({ page }) => {
  await page.getByTestId('pet-name').fill('Buddy')
  await page.getByTestId('pet-species').fill('Dog')
  await page.getByTestId('add-pet').click()
  await expect(page.getByTestId('pet-row')).toHaveCount(1)

  await page.getByTestId('pet-name').fill('Whiskers')
  await page.getByTestId('pet-species').fill('Cat')
  await page.getByTestId('add-pet').click()
  await expect(page.getByTestId('pet-row')).toHaveCount(2)
})

test('form clears after adding a pet', async ({ page }) => {
  await page.getByTestId('pet-name').fill('Buddy')
  await page.getByTestId('pet-species').fill('Dog')
  await page.getByTestId('add-pet').click()

  await expect(page.getByTestId('pet-name')).toHaveValue('')
  await expect(page.getByTestId('pet-species')).toHaveValue('')
})

test('shows validation errors when submitting empty fields', async ({ page }) => {
  await page.getByTestId('add-pet').click()

  await expect(page.getByTestId('pet-name-error')).toHaveText('Name is required')
  await expect(page.getByTestId('pet-species-error')).toHaveText('Species is required')
})
