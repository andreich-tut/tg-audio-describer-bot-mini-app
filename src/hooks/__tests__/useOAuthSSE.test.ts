import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOAuthSSE } from '../useOAuthSSE'

// Mock fetch
const fetchMock = vi.fn()
Object.defineProperty(globalThis, 'fetch', {
  value: fetchMock,
  writable: true,
  configurable: true,
})

describe('useOAuthSSE', () => {
  const initData = 'test_init_data'

  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock.mockReset()
  })

  it('returns loading state initially', () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        settings: {},
        oauth: { yandex: { connected: false, login: null } },
      }),
    })

    const { result } = renderHook(() => useOAuthSSE(initData))

    expect(result.current.loading).toBe(true)
    expect(result.current.state).toBeNull()
  })

  it('provides refetch function', () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        settings: {},
        oauth: { yandex: { connected: false, login: null } },
      }),
    })

    const { result } = renderHook(() => useOAuthSSE(initData))

    expect(result.current.refetch).toBeDefined()
    expect(typeof result.current.refetch).toBe('function')
  })
})
