import { useState } from 'react';
import { ScreenWrapper, Button, InputGroup, Badge } from '@/shared/ui';
import { useSettings } from '@/hooks/useSettings';
import { useGetLlmModelApiV1LlmModelGet, useListLlmModelsApiV1LlmModelsGet, usePingLlmEndpointApiV1LlmPingPost } from '@/api/generated/llm/llm';
import { ChevronRight } from 'lucide-react';
import type { LLMModelsResponse } from '@/api/generated/models';
import type { SettingsView } from './SettingsDirectory';

interface LLMConfigProps {
  onBack: () => void;
  onNavigate?: (view: SettingsView) => void;
}

function isLLMModelsResponse(data: unknown): data is LLMModelsResponse {
  return typeof data === 'object' && data !== null && 'models' in data;
}

export function LLMConfig({ onBack, onNavigate }: LLMConfigProps) {
  const [showKey, setShowKey] = useState(false);
  const { data, update } = useSettings();
  const settings = data?.settings || {};
  
  const { data: currentModelData } = useGetLlmModelApiV1LlmModelGet();
  const { data: modelsData } = useListLlmModelsApiV1LlmModelsGet();
  const pingMutation = usePingLlmEndpointApiV1LlmPingPost();
  
  // Extract models from the nested response structure using type guard
  const models = isLLMModelsResponse(modelsData?.data) ? modelsData.data.models : [];
  
  // Get current model ID - handle the response structure
  const currentModelId = typeof currentModelData?.data === 'string' 
    ? currentModelData.data 
    : undefined;
  
  // Find current model name from the list
  const currentModelName = currentModelId && models.length > 0
    ? models.find(m => m.id === currentModelId)?.name 
    : null;
  
  const modelCount = models.length;

  const handleTestPing = async () => {
    try {
      await pingMutation.mutateAsync();
      // Success - could show toast or visual feedback
    } catch (error) {
      // Error - could show error message
      console.error('Ping failed:', error);
    }
  };

  const handleBrowseModels = () => {
    if (onNavigate) {
      onNavigate('model-selection');
    }
  };

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
        
        {/* Model Selection Section */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.15em] ml-1">
            Model
          </label>
          <button
            onClick={handleBrowseModels}
            className="w-full flex items-center justify-between p-4 bg-[#030712] border border-[#1e1b4b] rounded-xl hover:border-[#8b5cf6]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1e1b4b]/50 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#f8fafc]">
                  {currentModelName || 'Not selected'}
                </div>
                <div className="text-[11px] font-semibold text-[#475569]">
                  {modelCount > 0 ? `${modelCount} models available` : 'Loading models...'}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#334155]" />
          </button>
          
          {/* Current model ID display */}
          {currentModelId && (
            <div className="flex items-center gap-2 px-1">
              <Badge color="indigo">Current: {currentModelId}</Badge>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={handleTestPing}
            disabled={pingMutation.isPending}
          >
            {pingMutation.isPending ? 'Testing...' : 'Test Ping'}
          </Button>
          <Button variant="ghost">Help</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
