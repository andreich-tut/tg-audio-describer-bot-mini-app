import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: './openapi.json',
      filters: {
        // Optional: filter specific tags/paths if needed
      },
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/endpoints.ts',
      schemas: 'src/api/generated/models',
      client: 'react-query',
      mock: false,
      override: {
        fetch: {
          includeHttpResponseReturnType: true,
        },
        reactQuery: {
          useQuery: true,
          useMutation: true,
          useInfinite: true,
          useInfiniteQueryParam: 'next',
          query: {
            enabled: true,
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
          },
        },
      },
      hooks: {
        afterAllFilesWrite: 'prettier --write',
      },
    },
  },
})
