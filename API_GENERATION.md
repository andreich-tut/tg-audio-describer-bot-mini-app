# Auto API Client Generation Setup

## Overview

This project now uses [orval](https://orval.dev) to automatically generate TypeScript types and React Query hooks from your backend's OpenAPI/Swagger specification.

## What Was Added

### Dependencies
- `orval` - OpenAPI to TypeScript/React Query generator
- `@orval/core` - Core orval functionality

### New Scripts

```bash
# Download OpenAPI spec and generate API client
npm run generate:api

# Generate only (assumes openapi.json exists)
npm run download:openapi
```

### Configuration Files

- `orval.config.ts` - Orval configuration with React Query mode
- `openapi.sample.json` - Sample OpenAPI spec (fallback)
- `src/api/generated/` - Generated API client code

### Generated Structure

```
src/api/generated/
├── models/           # TypeScript types from OpenAPI schemas
├── settings/         # Settings API hooks (by tag)
├── usage/            # Usage API hooks (by tag)
├── oauth/            # OAuth API hooks (by tag)
├── request.ts        # Custom fetcher with Telegram auth
└── README.md         # Usage documentation
```

## Quick Start

### 1. Make sure your backend is running

Your backend should serve OpenAPI spec at `https://localhost/openapi.json`

### 2. Generate the API client

```bash
npm run generate:api
```

### 3. Use the generated hooks

```tsx
import { useGetUsageApiV1UsageGet } from '@/api/generated/usage'
import { useUpdateSettingApiV1SettingsKeyPut } from '@/api/generated/settings'

function MyComponent() {
  // Query
  const { data, isLoading } = useGetUsageApiV1UsageGet()
  
  // Mutation
  const updateSetting = useUpdateSettingApiV1SettingsKeyPut()
  
  const handleUpdate = () => {
    updateSetting.mutate({
      key: 'theme',
      data: { value: 'dark' }
    })
  }
  
  // ... render
}
```

## Configuration

### Environment Variables

Add to `.env`:

```env
VITE_API_BASE=https://localhost
VITE_SWAGGER_URL=https://localhost/openapi.json
```

### Orval Config (`orval.config.ts`)

Key settings:
- `mode: 'tags-split'` - Splits generated code by OpenAPI tags
- `client: 'react-query'` - Generates React Query hooks
- `staleTime: 5 minutes` - Default cache stale time
- `retry: 1` - Default retry count

## Customization

### Change Query Options

```tsx
const { data } = useGetUsageApiV1UsageGet({
  query: {
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    refetchInterval: 5000,
  }
})
```

### Add New API Endpoints

Simply add the endpoint to your backend's OpenAPI spec and re-run:

```bash
npm run generate:api
```

The new hooks will be automatically generated!

## Migration from Manual API Calls

### Before (Manual)

```tsx
// src/api/usage.ts
import { api } from './client'

export const usageApi = {
  getUsage: () => api<UsageResponse>('/api/v1/usage'),
}

// Component
const { data } = useQuery({
  queryKey: ['usage'],
  queryFn: usageApi.getUsage
})
```

### After (Generated)

```tsx
// Component
const { data } = useGetUsageApiV1UsageGet()
```

Much simpler! ✅

## Tips

1. **Don't edit generated files** - They will be overwritten on regeneration
2. **Run generation after backend changes** - Keep your client in sync
3. **Use the types** - Import from `@/api/generated/models` for type safety
4. **Check the README** - `src/api/generated/README.md` has detailed examples

## Troubleshooting

### SSL Certificate Issues

The download script uses `curl -k` (insecure) for development. For production:
- Use proper SSL certificates
- Or download the spec manually and commit `openapi.json`

### Backend Not Accessible

Make sure your backend is running and the OpenAPI endpoint is accessible:

```bash
curl -k https://localhost/openapi.json
```

### Types Not Updating

Delete the generated folder and regenerate:

```bash
rm -rf src/api/generated
npm run generate:api
```

## Resources

- [orval Documentation](https://orval.dev)
- [React Query Documentation](https://tanstack.com/query/latest)
- [OpenAPI Specification](https://swagger.io/specification/)
