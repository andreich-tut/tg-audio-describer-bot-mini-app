import { test, expect } from '@playwright/test'
import { initTelegramMock } from '../tests/mocks/telegram'

test.describe('Cloud Vault', () => {
  test.beforeEach(async ({ page, context }) => {
    await initTelegramMock(page)

    // Mock API to return disconnected state by default
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: {
            llm_api_key: 'test-key',
            llm_base_url: 'https://api.example.com',
            llm_model: 'gpt-4',
          },
          oauth: {
            yandex: { connected: false, login: null },
          },
        },
      })
    })
  })

  test('loads the app', async ({ page }) => {
    await page.goto('/')

    // Wait for app to load
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })
  })

  test('shows Settings tab', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Settings')).toBeVisible()
  })

  test('navigates to Cloud Vault from Settings', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    // Click Settings tab
    await page.getByText('Settings').click()

    // Wait for settings to load
    await expect(page.getByText('AI Engine (LLMs)')).toBeVisible()

    // Click Cloud Vault
    await page.getByText('Cloud Vault').click()

    // Verify we're on the Vault Config screen
    await expect(page.getByText('Cloud Vault')).toBeVisible()
    await expect(page.getByText('Yandex Disk', { exact: true })).toBeVisible()
  })

  test('displays Yandex Disk branding', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Check for Я logo
    await expect(page.getByText('Я')).toBeVisible()
  })

  test('back button returns to Settings', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Wait for screen to load
    await expect(page.getByText('Cloud Vault')).toBeVisible()

    // Click back button (button with ArrowLeft icon before the title)
    await page.locator('button:has(svg)').first().click()

    // Should be back at Settings Directory
    await expect(page.getByText('AI Engine (LLMs)')).toBeVisible()
  })

  test('shows disconnected state initially', async ({ page, context }) => {
    // Mock API to return disconnected state
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: {},
          oauth: {
            yandex: { connected: false, login: null },
          },
        },
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Should show disconnected state
    await expect(page.getByText('Not connected')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Connect Yandex Disk' })).toBeVisible()
  })

  test('shows Connect button when disconnected', async ({ page, context }) => {
    // Mock API to return disconnected state
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: {},
          oauth: { yandex: { connected: false, login: null } },
        },
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    await expect(page.getByRole('button', { name: 'Connect Yandex Disk' })).toBeVisible()
    await expect(page.getByText('Inactive')).toBeVisible()
  })

  test('shows connected state with mock data', async ({ page, context }) => {
    // Mock API to return connected state
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: { yadisk_path: '/vault/notes' },
          oauth: { yandex: { connected: true, login: 'test@yandex.ru' } },
        },
      })
    })

    // Mock Yandex Disk folders API
    // Backend returns array directly, not wrapped in { data: [...] }
    await context.route('**/api/v1/yadisk/folders**', (route) => {
      route.fulfill({
        status: 200,
        json: [
          { name: 'Notes', path: '/Notes', type: 'dir' },
          { name: 'Documents', path: '/Documents', type: 'dir' },
        ],
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Should show connected state
    await expect(page.getByText('test@yandex.ru')).toBeVisible()
    await expect(page.getByText('Active')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Revoke Access' })).toBeVisible()
  })

  test('shows Vault Explorer when connected', async ({ page, context }) => {
    // Mock API to return connected state
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: { yadisk_path: '/vault/notes' },
          oauth: { yandex: { connected: true, login: 'test@yandex.ru' } },
        },
      })
    })

    // Mock Yandex Disk folders API
    // Backend returns array directly, not wrapped in { data: [...] }
    await context.route('**/api/v1/yadisk/folders**', (route) => {
      route.fulfill({
        status: 200,
        json: [
          { name: 'Notes', path: '/Notes', type: 'dir' },
          { name: 'Documents', path: '/Documents', type: 'dir' },
        ],
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Should show Vault Explorer
    await expect(page.getByText('Vault Explorer')).toBeVisible()
  })

  test('vault path input shows current vault path', async ({ page, context }) => {
    // Mock API to return connected state with vault path
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: { yadisk_path: '/Notes/Obsidian' },
          oauth: { yandex: { connected: true, login: 'test@yandex.ru' } },
        },
      })
    })

    // Mock Yandex Disk folders API
    // Backend returns array directly, not wrapped in { data: [...] }
    await context.route('**/api/v1/yadisk/folders**', (route) => {
      route.fulfill({
        status: 200,
        json: [
          { name: 'Notes', path: '/Notes', type: 'dir' },
        ],
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Check input shows current vault path (by placeholder and value)
    const input = page.getByPlaceholder('Select from vault explorer below')
    await expect(input).toBeVisible()
    await expect(input).toHaveValue('/Notes/Obsidian')
  })

  test('shows current vault info when path is set', async ({ page, context }) => {
    // Mock API to return connected state with vault path
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: { yadisk_path: '/Notes' },
          oauth: { yandex: { connected: true, login: 'test@yandex.ru' } },
        },
      })
    })

    // Mock Yandex Disk folders API
    // Backend returns array directly, not wrapped in { data: [...] }
    await context.route('**/api/v1/yadisk/folders**', (route) => {
      route.fulfill({
        status: 200,
        json: [
          { name: 'Notes', path: '/Notes', type: 'dir' },
        ],
      })
    })

    // Mock vault tree API
    // Backend returns object directly, not wrapped in { data: {...} }
    await context.route('**/api/v1/yadisk/folders/tree**', (route) => {
      route.fulfill({
        status: 200,
        json: {
          name: 'Notes',
          path: '/Notes',
          children: [
            { name: 'Inbox', path: '/Notes/Inbox' },
            { name: 'Archive', path: '/Notes/Archive' },
          ],
        },
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Should show current vault info
    await expect(page.getByText(/Current vault:/)).toBeVisible()
    await expect(page.getByText('/Notes')).toBeVisible()
  })

  test('shows loading state for folders', async ({ page, context }) => {
    // Mock API to return connected state
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: { yadisk_path: '/vault/notes' },
          oauth: { yandex: { connected: true, login: 'test@yandex.ru' } },
        },
      })
    })

    // Mock Yandex Disk folders API with delay
    // Backend returns array directly, not wrapped in { data: [...] }
    await context.route('**/api/v1/yadisk/folders**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      route.fulfill({
        status: 200,
        json: [
          { name: 'Notes', path: '/Notes', type: 'dir' },
        ],
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Should show loading state initially
    await expect(page.getByText('Loading folders...')).toBeVisible()
  })

  test('shows empty state when no folders', async ({ page, context }) => {
    // Mock API to return connected state
    await context.route('**/api/v1/settings', (route) => {
      route.fulfill({
        status: 200,
        json: {
          settings: { yadisk_path: '/vault/notes' },
          oauth: { yandex: { connected: true, login: 'test@yandex.ru' } },
        },
      })
    })

    // Mock Yandex Disk folders API with empty response
    // Backend returns array directly, not wrapped in { data: [...] }
    await context.route('**/api/v1/yadisk/folders**', (route) => {
      route.fulfill({
        status: 200,
        json: [],
      })
    })

    await page.goto('/')
    await expect(page.getByText('Mode')).toBeVisible({ timeout: 10000 })

    await page.getByText('Settings').click()
    await page.getByText('Cloud Vault').click()

    // Should show empty state
    await expect(page.getByText('No folders found at root level')).toBeVisible()
  })
})
