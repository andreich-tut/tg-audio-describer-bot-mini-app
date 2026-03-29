import { Check } from 'lucide-react';
import type { LLMModel } from '@/api/generated/models';
import { Badge } from '@/shared/ui';

interface ModelCardProps {
  model: LLMModel;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
  isSelecting: boolean;
}

export function ModelCard({ model, isSelected, onSelect, isSelecting }: ModelCardProps) {
  const formatContextLength = (length?: number | null) => {
    if (!length) return null;
    if (length >= 1000000) return `${(length / 1000000).toFixed(0)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length.toString();
  };

  const formatPrice = (price?: unknown) => {
    if (!price || typeof price !== 'string') return null;
    const num = parseFloat(price);
    if (num === 0) return 'Free';
    return `$${num.toFixed(4)}`;
  };

  // Extract pricing values safely
  const pricing = model.pricing as Record<string, unknown> | null | undefined;
  const promptPrice = pricing?.prompt as string | undefined;
  const completionPrice = pricing?.completion as string | undefined;

  return (
    <button
      onClick={() => onSelect(model.id)}
      disabled={isSelecting}
      className={`w-full p-4 rounded-2xl border transition-all text-left ${
        isSelected
          ? 'bg-[#1e1b4b]/30 border-[#8b5cf6]/60 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
          : 'bg-[#030712] border-[#1e1b4b] hover:border-[#8b5cf6]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
      } ${isSelecting ? 'opacity-70 cursor-wait' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-[#f8fafc] truncate">{model.name}</h3>
            {model.is_free && <Badge color="green">Free</Badge>}
          </div>
          
          {model.description && (
            <p className="text-xs text-[#64748b] line-clamp-2 mb-3">{model.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2">
            {model.context_length && (
              <Badge color="zinc">
                {formatContextLength(model.context_length)} context
              </Badge>
            )}
            
            {pricing && (
              <>
                {promptPrice && (
                  <Badge color="zinc">
                    Prompt: {formatPrice(promptPrice)}
                  </Badge>
                )}
                {completionPrice && (
                  <Badge color="zinc">
                    Completion: {formatPrice(completionPrice)}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {isSelected ? (
            <div className="w-6 h-6 rounded-full bg-[#8b5cf6] flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-[#334155]" />
          )}
        </div>
      </div>
      
      {isSelecting && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#8b5cf6]">
          <div className="w-3 h-3 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
          Selecting...
        </div>
      )}
    </button>
  );
}
