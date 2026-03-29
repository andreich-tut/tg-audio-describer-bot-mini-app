# Testing Guide

This project uses **Vitest** for unit/component tests and **Playwright** for E2E tests.

## Test Commands

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test

# Run unit tests with UI
npm run test:ui

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## Test Structure

```
tg-audio-describer-bot-mini-app/
├── src/
│   ├── __tests__/__mocks__/    # Test utilities
│   │   ├── test-utils.tsx      # Custom render with providers
│   │   └── setup.ts            # Global mocks (Telegram, EventSource)
│   ├── hooks/__tests__/        # Hook tests
│   ├── api/__tests__/          # API client tests
│   └── features/
│       └── Settings/ui/__tests__/  # Component tests
├── tests/
│   ├── mocks/
│   │   ├── api-handlers.ts     # MSW handlers
│   │   └── telegram.ts         # Telegram mock for E2E
│   ├── setup.ts                # Vitest setup
│   └── test-utils.tsx          # Test utilities
├── e2e/
│   └── cloud-vault.spec.ts     # E2E tests
├── vitest.config.ts
└── playwright.config.ts
```

## Writing Tests

### Unit Tests (Vitest)

```tsx
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMyHook } from '../useMyHook'

describe('useMyHook', () => {
  it('does something', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current).toBeDefined()
  })
})
```

### Component Tests

```tsx
import { render, screen, fireEvent } from '@/__tests__/__mocks__/test-utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles clicks', () => {
    const onClick = vi.fn()
    render(<MyComponent onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### API Tests (MSW)

```tsx
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { myApi } from '../myApi'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('fetches data', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json({ value: 'test' })
    })
  )

  const result = await myApi.getData()
  expect(result).toEqual({ value: 'test' })
})
```

## Mocks

### Telegram WebApp

Automatically mocked in `setup.ts`:
- `window.Telegram.WebApp.initData`
- `window.Telegram.WebApp.openLink()`
- `window.Telegram.WebApp.HapticFeedback`
- `window.Telegram.WebApp.MainButton`
- `window.Telegram.WebApp.BackButton`

### EventSource (SSE)

Mocked in `setup.ts` for testing OAuth SSE streams.

### API (MSW)

Use MSW handlers from `tests/mocks/api-handlers.ts`:

```tsx
import { handlers } from '../../../tests/mocks/api-handlers'
import { setupServer } from 'msw/node'

const server = setupServer(...handlers)
```

## Coverage

Coverage reports are generated in:
- `coverage/` (HTML)
- `coverage/coverage-final.json` (JSON)

Target coverage: **70%** for branches, functions, lines, and statements.

## E2E Tests

Playwright tests run against the dev server:

```bash
# Start dev server and run tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

E2E tests use the Telegram mock from `tests/mocks/telegram.ts`.

## Best Practices

1. **Test files**: Use `*.test.ts` or `*.test.tsx` extension
2. **Location**: Place tests next to the code they test (`__tests__/` folder)
3. **Mocks**: Use MSW for API mocking, not manual fetch mocks
4. **Cleanup**: Use `afterEach` to cleanup mocks and timers
5. **Async**: Use `waitFor` for async updates, not `setTimeout`
6. **Act**: Wrap state updates in `act()` when needed
