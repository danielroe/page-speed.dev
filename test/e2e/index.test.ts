import { expect, test } from '@nuxt/test-utils/playwright'

test('home page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot()
})

test('detail page with CrUX data', async ({ page }) => {
  await page.goto('/roe.dev')
  await expect(page).toHaveScreenshot()
})

test('detail page with Lighthouse data', async ({ page }) => {
  await page.goto('/atinux.com')
  await expect(page).toHaveScreenshot()
})

test('og image for home page', async ({ page }) => {
  await page.goto('/__og-image__/static/og.png')
  await expect(page).toHaveScreenshot()
})

test('og image with CrUX data', async ({ page }) => {
  await page.goto('/__og-image__/image/roe.dev/og.png')
  await expect(page).toHaveScreenshot()
})

test('og image with Lighthouse data', async ({ page }) => {
  await page.goto('/__og-image__/image/atinux.com/og.png')
  await expect(page).toHaveScreenshot()
})
