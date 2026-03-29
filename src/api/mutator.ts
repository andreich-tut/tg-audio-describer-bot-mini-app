const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

const isDev = import.meta.env.DEV

export type RequestBody = Record<string, unknown> | FormData | null

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const initData = window.Telegram?.WebApp?.initData ?? ''

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Telegram-Init-Data': initData,
  }

  const fullUrl = `${API_BASE}${url}`

  if (isDev) {
    console.log('[API] Request:', {
      method: options.method || 'GET',
      url: fullUrl,
      hasInitData: !!initData,
      initDataLength: initData.length,
    })
  }

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    body: options?.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options?.body,
  })

  if (isDev) {
    console.log('[API] Response:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
    })
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    if (isDev) {
      console.error('[API] Error:', errorData)
    }
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }

  const body = [204, 205, 304].includes(res.status)
    ? null
    : await res.text()

  return (body ? JSON.parse(body) : {}) as T
}
