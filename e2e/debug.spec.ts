import { test, expect } from '@playwright/test'
import { initTelegramMock } from '../tests/mocks/telegram'

test.describe('Debug', () => {
  test('verify baseURL issue', async ({ page, context, browserName }) => {
    console.log('Browser:', browserName)
    console.log('Page URL before navigation:', page.url())
    
    await initTelegramMock(page)
    
    // Mock ALL API requests
    await context.route('**/api/v1/**', (route) => {
      console.log('API Request:', route.request().url())
      route.fulfill({
        status: 200,
        json: {
          settings: {},
          oauth: { yandex: { connected: false, login: null } },
        },
      })
    })

    // Navigate with explicit URL
    console.log('Navigating to http://localhost:5173/...')
    await page.goto('http://localhost:5173/')
    console.log('Page URL after navigation:', page.url())
    
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)
    
    // Check if app loaded
    const modeVisible = await page.getByText('Mode').isVisible().catch(() => false)
    console.log('Mode visible:', modeVisible)
    
    // Take screenshot
    await page.screenshot({ path: 'test-screenshots/debug-explicit-url.png', fullPage: true })
    
    expect(modeVisible).toBe(true)
  })
})
