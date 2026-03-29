const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

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

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    body: options?.body && !(options.body instanceof FormData)
      ? JSON.stringify(options.body)
      : options?.body,
  })

  if (!res.ok) {
    await res.json().catch(() => ({}))
    throw new Error(`API error ${res.status}`)
  }

  const body = [204, 205, 304].includes(res.status)
    ? null
    : await res.text()

  return (body ? JSON.parse(body) : {}) as T
}
