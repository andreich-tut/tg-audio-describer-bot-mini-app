import { ScreenWrapper, Button, InputGroup, Badge, FolderTree } from '@/shared/ui';
import type { FolderItem } from '@/shared/ui/FolderTree';
import { settingsApi } from '@/api/settings';
import { useSettings } from '@/hooks/useSettings';
import { useOAuthSSE } from '@/hooks/useOAuthSSE';
import { useTelegram } from '@/hooks/useTelegram';
import {
  useListYadiskFoldersApiV1YadiskFoldersGet,
  useGetYadiskFolderTreeApiV1YadiskFoldersTreeGet
} from '@/api/generated/yandex-disk/yandex-disk';
import type { YandexDiskFolder } from '@/api/generated/models/yandexDiskFolder';
import { useState, useCallback } from 'react';

interface VaultConfigProps {
  onBack: () => void;
  onRefresh?: () => void;
}

/**
 * Convert YandexDiskFolder API response to FolderItem for tree display
 */
function convertToFolderItem(
  folder: YandexDiskFolder, 
  selectedPath?: string,
  hasChildren?: boolean
): FolderItem {
  // Extract folder name from path (last segment)
  const name = folder.name || folder.path.split('/').filter(Boolean).pop() || folder.path;
  
  return {
    id: folder.path,
    name,
    path: folder.path,
    selected: selectedPath === folder.path,
    children: hasChildren ? [] : undefined,
  };
}

export function VaultConfig({ onBack, onRefresh }: VaultConfigProps) {
  const { data, update } = useSettings();
  const { haptic } = useTelegram();
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initData || '';
  const { state: sseState, refetch: refetchOAuth } = useOAuthSSE(initData);

  const settings = data?.settings || {};
  const oauth = data?.oauth || {};
  const currentVaultPath = settings.yadisk_path || '';

  // Merge SSE state with initial OAuth data (SSE takes precedence)
  const yandexConnected = sseState?.connected ?? oauth['yandex']?.connected ?? false;
  const yandexLogin = sseState?.login ?? oauth['yandex']?.login ?? null;

  // Track which folders are being loaded (for lazy-loading children)
  const [loadingChildren, setLoadingChildren] = useState<Set<string>>(new Set());
  // Track expanded folders and their children
  const [folderChildren, setFolderChildren] = useState<Map<string, YandexDiskFolder[]>>(new Map());

  // Fetch root folder contents
  const {
    data: rootFolders,
    isLoading: isLoadingRoot
  } = useListYadiskFoldersApiV1YadiskFoldersGet(
    yandexConnected ? { path: '/', limit: 100 } : undefined,
    { query: { enabled: yandexConnected } }
  );

  // Fetch tree for selected vault path (shallow depth for performance)
  const {
    data: vaultTree
  } = useGetYadiskFolderTreeApiV1YadiskFoldersTreeGet(
    currentVaultPath ? { root_path: currentVaultPath, depth: 1 } : undefined,
    { query: { enabled: yandexConnected && !!currentVaultPath } }
  );

  // Debug logging for development
  if (import.meta.env.DEV && rootFolders) {
    console.log('[VaultConfig] rootFolders:', rootFolders);
  }

  // Handle folder selection (set as vault path)
  const handleSelectFolder = useCallback(async (path: string) => {
    haptic?.impactOccurred('medium');
    try {
      await update('yadisk_path', path);
      haptic?.notificationOccurred('success');
    } catch (error) {
      console.error('Failed to save vault path:', error);
      haptic?.notificationOccurred('error');
    }
  }, [update, haptic]);

  // Handle folder expansion (lazy-load children)
  const handleExpandFolder = useCallback(async (path: string) => {
    // Check if we already have children loaded
    if (folderChildren.has(path)) return;

    setLoadingChildren(prev => new Set(prev).add(path));

    try {
      const response = await settingsApi.listYadiskFolders({ path, limit: 100 });
      // Response is wrapped: { data: YandexDiskFolder[] }
      const folders = response.data.filter(item => item.type === 'dir');
      setFolderChildren(prev => new Map(prev).set(path, folders));
    } catch (error) {
      console.error('Failed to load folder children:', error);
    } finally {
      setLoadingChildren(prev => {
        const next = new Set(prev);
        next.delete(path);
        return next;
      });
    }
  }, [folderChildren]);

  // Check if a folder is currently loading children
  const isLoadingChildren = useCallback((path: string) => {
    return loadingChildren.has(path);
  }, [loadingChildren]);

  // Build tree items from root folders
  const buildTreeItems = useCallback((): FolderItem[] => {
    // IMPORTANT: Orval type says rootFolders is { data: [...], status: 200 }
    // BUT at runtime, customFetch returns the raw API response (array)
    // So rootFolders is actually YandexDiskFolder[] directly
    if (!rootFolders || !Array.isArray(rootFolders)) return [];

    return rootFolders
      .filter((item: YandexDiskFolder) => item.type === 'dir')
      .map((folder: YandexDiskFolder) => {
        const children = folderChildren.get(folder.path);
        return {
          ...convertToFolderItem(folder, currentVaultPath, children !== undefined),
          children: children?.map(child => convertToFolderItem(child, currentVaultPath)),
        };
      });
  }, [rootFolders, folderChildren, currentVaultPath]);

  const handleRevoke = async () => {
    haptic?.impactOccurred('medium');
    try {
      await settingsApi.disconnectYandex();
      await refetchOAuth();
      onRefresh?.();
    } catch (error) {
      console.error('Failed to disconnect Yandex:', error);
      haptic?.notificationOccurred('error');
    }
  };

  const handleConnect = async () => {
    haptic?.impactOccurred('medium');
    try {
      const response = await settingsApi.getYandexOAuthUrl();
      if (response.url) {
        // Open OAuth URL in Telegram's built-in browser
        tg?.openLink(response.url);
      }
    } catch (error) {
      console.error('Failed to get Yandex OAuth URL:', error);
      haptic?.notificationOccurred('error');
    }
  };

  return (
    <ScreenWrapper title="Cloud Vault" onBack={onBack}>
      <div className="space-y-6 pt-2">
        {/* OAuth Connection Card */}
        <div className="p-6 rounded-3xl border border-[#1e1b4b] bg-[#030712] space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-black text-white text-2xl">
                Я
              </div>
              <div>
                <div className="text-sm font-black text-white">Yandex Disk</div>
                <div className="text-[11px] font-bold text-[#64748b]">
                  {yandexLogin || 'Not connected'}
                </div>
              </div>
            </div>
            <Badge color={yandexConnected ? 'green' : 'zinc'}>
              {yandexConnected ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {yandexConnected ? (
            <Button
              variant="destructive"
              className="w-full text-xs py-2 rounded-xl"
              onClick={handleRevoke}
            >
              Revoke Access
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full text-xs py-2 rounded-xl"
              onClick={handleConnect}
            >
              Connect Yandex Disk
            </Button>
          )}
        </div>

        {/* Vault Path Configuration */}
        <div className="space-y-4">
          {yandexConnected && (
            <>
              <InputGroup
                label="Vault Target Path"
                placeholder="Select from vault explorer below"
                value={currentVaultPath}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectFolder(e.target.value)}
                isGeist
              />

              <div className="p-5 border border-[#1e1b4b] rounded-3xl bg-[#030712] shadow-inner">
                <div className="text-[10px] uppercase font-black text-[#475569] tracking-widest mb-4">
                  Vault Explorer
                </div>
                {isLoadingRoot ? (
                  <div className="flex items-center justify-center py-8 text-[#64748b]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading folders...</span>
                    </div>
                  </div>
                ) : rootFolders && Array.isArray(rootFolders) && rootFolders.length > 0 ? (
                  <FolderTree
                    items={buildTreeItems()}
                    onFolderClick={handleSelectFolder}
                    onFolderExpand={handleExpandFolder}
                    isLoadingChildren={isLoadingChildren}
                  />
                ) : (
                  <div className="text-center py-8 text-[#64748b] text-xs">
                    No folders found at root level
                  </div>
                )}
              </div>

              {currentVaultPath && vaultTree && typeof vaultTree === 'object' && 'children' in vaultTree && Array.isArray((vaultTree as Record<string, unknown>).children) && (
                <div className="p-4 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
                  <div className="text-xs text-[#a78bfa]">
                    <span className="font-black">Current vault:</span> {currentVaultPath}
                    {((vaultTree as Record<string, unknown>).children as unknown[]).length > 0 && (
                      <span className="text-[#64748b] ml-2">
                        ({((vaultTree as Record<string, unknown>).children as unknown[]).length} subfolders)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {!yandexConnected && (
            <div className="p-4 rounded-2xl bg-[#1e1b4b]/30 border border-[#1e1b4b]">
              <div className="text-sm text-[#94a3b8]">
                Connect Yandex Disk to configure your vault path and browse folders.
              </div>
            </div>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
