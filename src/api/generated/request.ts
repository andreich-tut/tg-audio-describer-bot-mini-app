// This file is kept for backward compatibility
// The custom fetch logic has been moved to src/api/mutator.ts
export { customFetch } from '../mutator'
export type { RequestBody } from '../mutator'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''
export const getBaseUrl = () => API_BASE

