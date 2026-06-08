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

async function ogImagePathFor(page: import('@playwright/test').Page, path: string) {
  await page.goto(path)
  const url = await page.locator('meta[property="og:image"]').first().getAttribute('content')
  if (!url) throw new Error(`No og:image meta tag found on ${path}`)
  return new URL(url).pathname
}

test('og image for home page', async ({ page }) => {
  const ogPath = await ogImagePathFor(page, '/')
  await page.goto(ogPath)
  await expect(page).toHaveScreenshot()
})

test('og image with CrUX data', async ({ page }) => {
  const ogPath = await ogImagePathFor(page, '/roe.dev')
  await page.goto(ogPath)
  await expect(page).toHaveScreenshot()
})

test('og image with Lighthouse data', async ({ page }) => {
  const ogPath = await ogImagePathFor(page, '/atinux.com')
  await page.goto(ogPath)
  await expect(page).toHaveScreenshot()
})
