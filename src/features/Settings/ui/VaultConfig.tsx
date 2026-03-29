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
  const { state: sseState } = useOAuthSSE(initData);

  const settings = data?.settings || {};
  const oauth = data?.oauth || {};
  const yandex = oauth['yandex'] ?? { connected: false, login: null };

  const handleRevoke = () => {
    haptic?.impactOccurred('medium');
    settingsApi.disconnectYandex().then(() => onRefresh?.());
  };

  return (
    <ScreenWrapper title="Cloud Vault" onBack={onBack}>
      <div className="space-y-6 pt-2">
        <div className="p-6 rounded-3xl border border-[#1e1b4b] bg-[#030712] space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-black text-white text-2xl">
                Я
              </div>
              <div>
                <div className="text-sm font-black text-white">Yandex Disk</div>
                <div className="text-[11px] font-bold text-[#64748b]">
                  {sseState?.login || yandex.login || '@username'}
                </div>
              </div>
            </div>
            <Badge color="green">Active</Badge>
          </div>
          <Button
            variant="destructive"
            className="w-full text-xs py-2 rounded-xl"
            onClick={handleRevoke}
          >
            Revoke Access
          </Button>
        </div>

        <div className="space-y-4">
          <InputGroup
            label="Vault Target"
            value={settings.yadisk_path || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update('yadisk_path', e.target.value)}
            isGeist
          />
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
        </div>
      </div>
    </ScreenWrapper>
  );
}
