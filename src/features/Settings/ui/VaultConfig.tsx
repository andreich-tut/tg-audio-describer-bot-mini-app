import { ScreenWrapper, Button, InputGroup, Badge, FolderTree } from '@/shared/ui';
import { settingsApi } from '@/api/settings';
import { useSettings } from '@/hooks/useSettings';
import { useOAuthSSE } from '@/hooks/useOAuthSSE';
import { useTelegram } from '@/hooks/useTelegram';

interface VaultConfigProps {
  onBack: () => void;
  onRefresh?: () => void;
}

export function VaultConfig({ onBack, onRefresh }: VaultConfigProps) {
  const { data, update } = useSettings();
  const { haptic } = useTelegram();
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initData || '';
  const { state: sseState, refetch: refetchOAuth } = useOAuthSSE(initData);

  const settings = data?.settings || {};
  const oauth = data?.oauth || {};
  
  // Merge SSE state with initial OAuth data (SSE takes precedence)
  const yandexConnected = sseState?.connected ?? oauth['yandex']?.connected ?? false;
  const yandexLogin = sseState?.login ?? oauth['yandex']?.login ?? null;

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

  const handleSaveVaultPath = async (value: string) => {
    haptic?.impactOccurred('light');
    try {
      await update('yadisk_path', value);
      haptic?.notificationOccurred('success');
    } catch (error) {
      console.error('Failed to save vault path:', error);
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
          <InputGroup
            label="Vault Target Path"
            placeholder="e.g., /vault/notes"
            value={settings.yadisk_path || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSaveVaultPath(e.target.value)}
            isGeist
            disabled={!yandexConnected}
          />
          
          {yandexConnected && (
            <div className="p-5 border border-[#1e1b4b] rounded-3xl bg-[#030712] shadow-inner">
              <div className="text-[10px] uppercase font-black text-[#475569] tracking-widest mb-4">
                Vault Explorer
              </div>
              <FolderTree items={[{
                id: 'root',
                name: 'Personal Vault',
                children: [
                  { id: 'notes', name: 'Research', selected: true },
                  { id: 'daily', name: 'Journal' }
                ]
              }]} />
            </div>
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
