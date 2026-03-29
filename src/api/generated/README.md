# Generated API Client

This directory contains auto-generated API client code created by [orval](https://orval.dev) from your backend's OpenAPI/Swagger specification.

## Structure

- `generated/models/` - TypeScript types for all API schemas
- `generated/{tag}/` - React Query hooks and API functions organized by OpenAPI tags (e.g., `settings/`, `usage/`, `oauth/`)
- `generated/request.ts` - Custom fetch wrapper with Telegram authentication

## Quick Start

### 1. Generate API Client

Make sure your backend is running, then run:

```bash
npm run generate:api
```

This will:
1. Download the OpenAPI spec from `https://localhost/openapi.json`
2. Generate TypeScript types and React Query hooks

### 2. Configure Environment Variables

Add to your `.env` file:

```env
VITE_API_BASE=https://localhost
VITE_SWAGGER_URL=https://localhost/openapi.json
```

## Usage Examples

### Query (GET requests)

```tsx
import { useGetUsageApiV1UsageGet } from '@/api/generated/usage'

function UsageComponent() {
  const { data, isLoading, error } = useGetUsageApiV1UsageGet()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <p>Usage: {data?.data.usage}</p>
      <p>Limit: {data?.data.limit}</p>
    </div>
  )
}
```

### Mutation (POST/PUT/DELETE requests)

```tsx
import { useUpdateSettingApiV1SettingsKeyPut } from '@/api/generated/settings'

function SettingsComponent() {
  const updateMutation = useUpdateSettingApiV1SettingsKeyPut()
  
  const handleUpdate = async () => {
    try {
      const result = await updateMutation.mutateAsync({
        key: 'theme',
        data: { value: 'dark' }
      })
      console.log('Updated:', result.data)
    } catch (error) {
      console.error('Update failed:', error)
    }
  }
  
  return <button onClick={handleUpdate}>Update Settings</button>
}
```

### Delete Mutation

```tsx
import { useDeleteSettingApiV1SettingsKeyDelete } from '@/api/generated/settings'

function DeleteSettingButton({ settingKey }: { settingKey: string }) {
  const deleteMutation = useDeleteSettingApiV1SettingsKeyDelete()
  
  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ key: settingKey })
  }
  
  return <button onClick={handleDelete}>Delete</button>
}
```

## Customization

### Override Query Options

```tsx
const { data } = useGetUsageApiV1UsageGet({
  query: {
    enabled: true,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    refetchInterval: 5000, // Auto-refetch every 5 seconds
  }
})
```

### Manual API Calls

```tsx
import { getUsageApiV1UsageGet } from '@/api/generated/usage'

const response = await getUsageApiV1UsageGet()
console.log(response.data) // API response data
console.log(response.status) // HTTP status code
console.log(response.headers) // Response headers
```

## Available Hooks

Based on your API tags, the following hooks are generated:

### Usage API
- `useGetUsageApiV1UsageGet()` - Get API usage information

### Settings API
- `useGetSettingsApiV1SettingsGet()` - Get all settings
- `useUpdateSettingApiV1SettingsKeyPut()` - Update a setting
- `useDeleteSettingApiV1SettingsKeyDelete()` - Delete a setting
- `useResetSectionApiV1SettingsResetSectionPost()` - Reset settings section

### OAuth API
- `useGetYandexOAuthUrlApiV1OAuthYandexUrlGet()` - Get Yandex OAuth URL
- `useDisconnectYandexApiV1OAuthYandexDelete()` - Disconnect Yandex

## Regeneration

Run the generation command whenever your backend API changes:

```bash
npm run generate:api
```

**Important:** Do not manually edit files in the `generated/` directory as they will be overwritten!

## Authentication

The custom fetcher automatically includes:
- `Content-Type: application/json` header
- `X-Telegram-Init-Data` header from `window.Telegram.WebApp.initData`

No additional setup is required for authentication.

## Troubleshooting

### "Cannot find module" errors
- Run `npm run generate:api` to regenerate the client
- Ensure your backend is running and accessible

### Type errors after regeneration
- Check that your OpenAPI spec is valid
- Review the generated types and update your component code accordingly

### SSL/Certificate errors
- The download script uses `curl -k` to skip certificate verification (for development only)
- For production, use proper SSL certificates

### Authentication issues
- Ensure `window.Telegram.WebApp.initData` is available
- The Telegram WebApp script must be loaded in your HTML
