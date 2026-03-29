import { http, HttpResponse, delay } from 'msw'

const API_BASE = process.env.VITE_API_BASE || 'http://localhost:5173'

export const mockSettings = {
  settings: {
    llm_api_key: 'test-api-key',
    llm_base_url: 'https://api.openai.com/v1',
    llm_model: 'gpt-4',
    yadisk_path: '/vault/notes',
    obsidian_vault_path: '/obsidian/vault',
    obsidian_inbox_folder: 'inbox',
  },
  oauth: {
    yandex: {
      connected: true,
      login: 'testuser@yandex.ru',
    },
  },
}

export const mockDisconnectedState = {
  settings: mockSettings.settings,
  oauth: {
    yandex: {
      connected: false,
      login: null,
    },
  },
}

export const handlers = [
  // GET /api/v1/settings
  http.get(`${API_BASE}/api/v1/settings`, async () => {
    await delay(100) // Simulate network delay
    return HttpResponse.json(mockSettings)
  }),

  // PUT /api/v1/settings/:key
  http.put(`${API_BASE}/api/v1/settings/:key`, async ({ params, request }) => {
    const { key } = params
    const body = await request.json() as { value: string }
    
    await delay(100)
    
    return HttpResponse.json({
      key,
      saved: true,
      value: body.value,
    })
  }),

  // DELETE /api/v1/settings/:key
  http.delete(`${API_BASE}/api/v1/settings/:key`, async ({ params }) => {
    const { key } = params
    
    await delay(100)
    
    return HttpResponse.json({
      key,
      deleted: true,
    })
  }),

  // POST /api/v1/settings/reset/:section
  http.post(`${API_BASE}/api/v1/settings/reset/:section`, async ({ params }) => {
    const { section } = params
    
    await delay(100)
    
    return HttpResponse.json({
      section,
      cleared: true,
    })
  }),

  // GET /api/v1/oauth/yandex/url
  http.get(`${API_BASE}/api/v1/oauth/yandex/url`, async () => {
    await delay(100)
    
    return HttpResponse.json({
      url: 'https://oauth.yandex.ru/authorize?client_id=test&response_type=code',
      state: 'test-state-123',
    })
  }),

  // DELETE /api/v1/oauth/yandex
  http.delete(`${API_BASE}/api/v1/oauth/yandex`, async () => {
    await delay(100)
    
    return HttpResponse.json({
      disconnected: true,
    })
  }),

  // GET /api/v1/usage
  http.get(`${API_BASE}/api/v1/usage`, async () => {
    await delay(100)
    
    return HttpResponse.json({
      usage: {
        tokens_used: 1000,
        tokens_limit: 10000,
        requests_today: 5,
        requests_limit: 100,
      },
    })
  }),
]

// Error handlers
export const errorHandlers = [
  // Settings fetch error
  http.get(`${API_BASE}/api/v1/settings`, () => {
    return HttpResponse.json(
      { detail: 'Internal Server Error' },
      { status: 500 }
    )
  }),

  // Settings update error
  http.put(`${API_BASE}/api/v1/settings/:key`, () => {
    return HttpResponse.json(
      { detail: 'Validation Error' },
      { status: 422 }
    )
  }),

  // OAuth URL error
  http.get(`${API_BASE}/api/v1/oauth/yandex/url`, () => {
    return HttpResponse.json(
      { detail: 'OAuth configuration error' },
      { status: 500 }
    )
  }),

  // Disconnect error
  http.delete(`${API_BASE}/api/v1/oauth/yandex`, () => {
    return HttpResponse.json(
      { detail: 'Failed to disconnect' },
      { status: 500 }
    )
  }),
]
