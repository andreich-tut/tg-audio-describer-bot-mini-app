import { useEffect, useState, useCallback, useRef } from 'react'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

export interface OAuthState {
  provider: string
  connected: boolean
  login: string | null
}

/**
 * Hook for real-time OAuth state updates via SSE.
 * Uses fetch with custom headers since EventSource doesn't support custom headers.
 * Falls back to polling if SSE is unavailable.
 */
export function useOAuthSSE(initData: string) {
  const [state, setState] = useState<OAuthState | null>(null)
  const [loading, setLoading] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchState = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/settings`, {
        headers: {
          'X-Telegram-Init-Data': initData,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setState({
          provider: 'yandex',
          connected: !!data.oauth?.yandex?.connected,
          login: data.oauth?.yandex?.login || null,
        })
      }
    } catch (error) {
      console.error('Failed to fetch OAuth state:', error)
    } finally {
      setLoading(false)
    }
  }, [initData])

  useEffect(() => {
    // SSE with custom headers requires using fetch + ReadableStream
    // since EventSource doesn't support custom headers
    const connectSSE = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/oauth/events`, {
          method: 'GET',
          headers: {
            'X-Telegram-Init-Data': initData,
            'Accept': 'text/event-stream',
          },
        })

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('ReadableStream not supported')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              buffer += decoder.decode(value, { stream: true })
              const events = buffer.split('\n\n')
              buffer = events.pop() || ''

              for (const event of events) {
                const lines = event.split('\n')
                let eventType = 'message'
                let data = ''

                for (const line of lines) {
                  if (line.startsWith('event:')) {
                    eventType = line.slice(6).trim()
                  } else if (line.startsWith('data:')) {
                    data = line.slice(5).trim()
                  }
                }

                if (eventType === 'oauth_state' && data) {
                  const parsed = JSON.parse(data)
                  setState(parsed)
                  setLoading(false)
                }
              }
            }
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              console.warn('SSE stream error, will reconnect:', error)
              setTimeout(connectSSE, 3000)
            }
          }
        }

        processStream()
      } catch (error) {
        console.warn('SSE not available, using fallback:', error)
        fetchState()
      }
    }

    connectSSE()

    // Fallback: refetch on tab visibility change
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchState()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      abortControllerRef.current?.abort()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [initData, fetchState])

  return { state, loading, refetch: fetchState }
}
