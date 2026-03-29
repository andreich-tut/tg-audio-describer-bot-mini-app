import { api } from './client'
import type { SettingKey, SettingsResponse, SectionId } from '../types'
import type { YandexDiskFolder } from './generated/models/yandexDiskFolder'

export const settingsApi = {
  getAll: () => api<SettingsResponse>('/api/v1/settings'),

  update: (key: SettingKey, value: string) =>
    api<{ key: string; saved: boolean }>(`/api/v1/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),

  delete: (key: SettingKey) =>
    api<{ key: string; deleted: boolean }>(`/api/v1/settings/${key}`, {
      method: 'DELETE',
    }),

  resetSection: (section: SectionId) =>
    api<{ section: string; cleared: boolean }>(`/api/v1/settings/reset/${section}`, {
      method: 'POST',
    }),

  getYandexOAuthUrl: () => api<{ url: string; state: string }>('/api/v1/oauth/yandex/url'),

  disconnectYandex: () =>
    api<{ disconnected: boolean }>('/api/v1/oauth/yandex', {
      method: 'DELETE',
    }),

  listYadiskFolders: (params?: { path?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.path) searchParams.set('path', params.path);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    
    const queryString = searchParams.toString();
    const url = `/api/v1/yadisk/folders${queryString ? `?${queryString}` : ''}`;
    
    return api<{ data: YandexDiskFolder[] }>(url);
  },
}
