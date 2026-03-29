import { ScreenWrapper, InputGroup } from '@/shared/ui';
import { useSettings } from '@/hooks/useSettings';

interface ObsidianConfigProps {
  onBack: () => void;
}

export function ObsidianConfig({ onBack }: ObsidianConfigProps) {
  const { data, update } = useSettings();
  const settings = data?.settings || {};

  return (
    <ScreenWrapper title="Obsidian" onBack={onBack}>
      <div className="space-y-4 pt-2">
        <InputGroup
          label="Vault Path"
          value={settings.obsidian_vault_path || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => update('obsidian_vault_path', e.target.value)}
          isGeist
        />
        <InputGroup
          label="Inbox Folder"
          value={settings.obsidian_inbox_folder || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => update('obsidian_inbox_folder', e.target.value)}
          isGeist
        />
      </div>
    </ScreenWrapper>
  );
}
