import { ApiError } from '../client'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

export const getBaseUrl = () => API_BASE

export type RequestBody = Record<string, unknown> | FormData | null

/**
 * Custom fetcher that adds Telegram authentication headers
 * Compatible with orval's expected fetch signature
 */
export const fetcher = async <T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T; status: number; headers: Headers }> => {
  const initData = window.Telegram?.WebApp?.initData ?? ''

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Telegram-Init-Data': initData,
  }

  const res = await fetch(url, {
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
    const errorBody = await res.json().catch(() => ({}))
    throw new ApiError(res.status, errorBody)
  }

  const body = [204, 205, 304].includes(res.status) 
    ? null 
    : await res.text()

  const data: T = body ? JSON.parse(body) : {}

  return { data, status: res.status, headers: res.headers }
}

export const createRequestOptions = (
  path: string,
  method: string,
  body?: RequestBody,
  headers?: Record<string, string>,
  signal?: AbortSignal,
) => ({
  url: `${API_BASE}${path}`,
  method,
  body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  headers: {
    'Content-Type': 'application/json',
    'X-Telegram-Init-Data': window.Telegram?.WebApp?.initData ?? '',
    ...headers,
  },
  signal,
})

