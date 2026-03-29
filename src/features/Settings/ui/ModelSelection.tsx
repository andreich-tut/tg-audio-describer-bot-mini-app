import { useState, useMemo } from 'react';
import { ScreenWrapper } from '@/shared/ui';
import { useListLlmModelsApiV1LlmModelsGet, useGetLlmModelApiV1LlmModelGet } from '@/api/generated/llm/llm';
import { ModelCard } from './ModelCard';
import { useModelSelection } from '../model/useModelSelection';
import { Search, Filter } from 'lucide-react';
import type { LLMModelsResponse } from '@/api/generated/models';

interface ModelSelectionProps {
  onBack: () => void;
}

function isLLMModelsResponse(data: unknown): data is LLMModelsResponse {
  return typeof data === 'object' && data !== null && 'models' in data;
}

export function ModelSelection({ onBack }: ModelSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const { data: modelsData, isLoading: isLoadingModels } = useListLlmModelsApiV1LlmModelsGet();
  const { data: currentModelData } = useGetLlmModelApiV1LlmModelGet();
  const { selectModel, isLoading: isSelecting } = useModelSelection();

  // Extract models from the nested response structure using type guard
  const models = useMemo(
    () => (modelsData && isLLMModelsResponse(modelsData.data) ? modelsData.data.models : []),
    [modelsData]
  );
  
  // Get current model ID - handle the response structure
  const currentModelId = typeof currentModelData?.data === 'string' 
    ? currentModelData.data 
    : undefined;

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFree = !showOnlyFree || model.is_free;
      return matchesSearch && matchesFree;
    });
  }, [models, searchQuery, showOnlyFree]);

  const handleSelect = async (modelId: string) => {
    if (modelId !== currentModelId) {
      await selectModel(modelId);
    }
  };

  return (
    <ScreenWrapper
      title="Select Model"
      onBack={onBack}
      footer={
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#64748b] px-1">
            <span>Showing {filteredModels.length} of {models.length} models</span>
            {currentModelId && (
              <span className="text-[#8b5cf6]">Selected: {currentModelId}</span>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 pb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models..."
            className="w-full bg-[#030712] border border-[#1e1b4b] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/40 focus:border-[#8b5cf6] transition-all placeholder-[#334155]"
          />
        </div>

        {/* Free Filter Toggle */}
        <button
          onClick={() => setShowOnlyFree(!showOnlyFree)}
          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
            showOnlyFree
              ? 'bg-[#1e1b4b]/30 border-[#8b5cf6]/40'
              : 'bg-[#030712] border-[#1e1b4b] hover:border-[#334155]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Filter size={18} className={showOnlyFree ? 'text-[#8b5cf6]' : 'text-[#475569]'} />
            <span className={`text-sm font-semibold ${showOnlyFree ? 'text-[#f8fafc]' : 'text-[#64748b]'}`}>
              Free models only
            </span>
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${
            showOnlyFree ? 'bg-[#8b5cf6]' : 'bg-[#1e1b4b]'
          }`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
              showOnlyFree ? 'left-6' : 'left-1'
            }`} />
          </div>
        </button>

        {/* Models List */}
        {isLoadingModels ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#030712] border border-[#1e1b4b] animate-pulse">
                <div className="h-4 bg-[#1e1b4b] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#1e1b4b] rounded w-full mb-2" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 bg-[#1e1b4b] rounded w-16" />
                  <div className="h-5 bg-[#1e1b4b] rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[#475569] text-sm mb-2">No models found</div>
            <div className="text-[#64748b] text-xs">
              {searchQuery || showOnlyFree ? 'Try adjusting your filters' : 'Check your API connection'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={model.id === currentModelId}
                onSelect={handleSelect}
                isSelecting={isSelecting}
              />
            ))}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
}
