/* eslint-disable react-refresh/only-export-components */
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement, ReactNode } from 'react'

// Create a fresh QueryClient for each test
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity, // Prevent garbage collection during tests
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface TestWrapperProps {
  children: ReactNode
  queryClient?: QueryClient
}

function TestWrapper({ children, queryClient }: TestWrapperProps) {
  const client = queryClient ?? createTestQueryClient()
  
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

/**
 * Custom render function that wraps components with necessary providers
 */
export function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return render(ui, {
    wrapper: (props) => <TestWrapper {...props} queryClient={options?.queryClient} />,
    ...options,
  })
}

/**
 * Create a wrapper component with QueryClient provider for hook tests
 */
export function createQueryClientWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createTestQueryClient()
  
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'

// Override render with our custom version
export { customRender as render }
