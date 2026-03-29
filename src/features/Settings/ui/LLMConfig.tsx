import { useState } from 'react';
import { ScreenWrapper, Button, InputGroup } from '@/shared/ui';
import { useSettings } from '@/hooks/useSettings';

interface LLMConfigProps {
  onBack: () => void;
}

export function LLMConfig({ onBack }: LLMConfigProps) {
  const [showKey, setShowKey] = useState(false);
  const { data, update } = useSettings();
  const settings = data?.settings || {};

  return (
    <ScreenWrapper 
      title="AI Engine" 
      onBack={onBack}
      footer={
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#64748b]">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            API Health: High Performance
          </div>
          <Button className="w-full py-4 rounded-2xl shadow-xl">Save Configuration</Button>
        </div>
      }
    >
      <div className="space-y-6 pt-2">
        <InputGroup
          label="Private API Key"
          type="password"
          value={settings.llm_api_key || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => update('llm_api_key', e.target.value)}
          isGeist
          showEye
          onToggleEye={() => setShowKey(!showKey)}
        />
        <InputGroup
          label="Endpoint Base"
          value={settings.llm_base_url || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => update('llm_base_url', e.target.value)}
          isGeist
        />
        <InputGroup
          label="Model ID"
          value={settings.llm_model || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => update('llm_model', e.target.value)}
          isGeist
        />
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1">Test Ping</Button>
          <Button variant="ghost">Help</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
