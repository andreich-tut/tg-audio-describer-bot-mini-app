import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import 'jsdom-worker'

// Suppress console warnings for "Query data cannot be undefined"
// This is a known issue with React Query in test environments
vi.spyOn(console, 'warn').mockImplementation(() => {})

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Telegram WebApp
const mockTelegramWebApp = {
  initData: 'test_init_data',
  initDataUnsafe: {
    user: {
      id: 123456,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
    },
  },
  themeParams: {
    bg_color: '#020617',
    text_color: '#f8fafc',
    hint_color: '#64748b',
    link_color: '#8b5cf6',
    button_color: '#8b5cf6',
    button_text_color: '#ffffff',
  },
  expand: vi.fn(),
  close: vi.fn(),
  openLink: vi.fn(),
  openTelegramLink: vi.fn(),
  confirmAlert: vi.fn(),
  showPopup: vi.fn(),
  showAlert: vi.fn(),
  showConfirm: vi.fn(),
  enableClosingConfirmation: vi.fn(),
  setHeaderColor: vi.fn(),
  setBackgroundColor: vi.fn(),
  onEvent: vi.fn(),
  offEvent: vi.fn(),
  ready: vi.fn(),
  MainButton: {
    text: '',
    color: '',
    textColor: '',
    isVisible: false,
    isActive: false,
    isProgressVisible: false,
    show: vi.fn(),
    hide: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    showProgress: vi.fn(),
    hideProgress: vi.fn(),
    onClick: vi.fn(),
    offClick: vi.fn(),
  },
  BackButton: {
    isVisible: false,
    show: vi.fn(),
    hide: vi.fn(),
    onClick: vi.fn(),
    offClick: vi.fn(),
  },
  HapticFeedback: {
    impactOccurred: vi.fn(),
    notificationOccurred: vi.fn(),
    selectionChanged: vi.fn(),
  },
}

// Mock window.Telegram
Object.defineProperty(window, 'Telegram', {
  value: {
    WebApp: mockTelegramWebApp,
  },
  writable: true,
  configurable: true,
})

// Mock EventSource for SSE
class MockEventSource {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2
  
  readonly CONNECTING = 0
  readonly OPEN = 1
  readonly CLOSED = 2

  url: string
  readyState: number
  onopen: (() => void) | null = null
  onerror: ((event: unknown) => void) | null = null

  private listeners: Map<string, Set<(event: unknown) => void>> = new Map()

  constructor(url: string) {
    this.url = url
    this.readyState = MockEventSource.CONNECTING

    // Simulate connection delay
    setTimeout(() => {
      this.readyState = MockEventSource.OPEN
      this.onopen?.()
    }, 0)
  }

  addEventListener(event: string, listener: (event: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  removeEventListener(event: string, listener: (event: unknown) => void) {
    this.listeners.get(event)?.delete(listener)
  }

  dispatchEvent(event: string, data: unknown) {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach(listener => listener({ data, type: event }))
    }
  }
  
  close() {
    this.readyState = MockEventSource.CLOSED
  }
}

Object.defineProperty(window, 'EventSource', {
  value: MockEventSource,
  writable: true,
  configurable: true,
})

// Mock fetch
Object.defineProperty(globalThis, 'fetch', {
  value: vi.fn(),
  writable: true,
  configurable: true,
})

// Helper to create mock fetch responses
export function createFetchResponse<T>(data: T, options?: { ok?: boolean; status?: number }) {
  return {
    ok: options?.ok ?? true,
    status: options?.status ?? 200,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  }
}

// Export mock Telegram for tests to use
export const mockTelegram = mockTelegramWebApp
