import { useSelectLlmModelApiV1LlmModelPut } from '@/api/generated/llm/llm';
import { useQueryClient } from '@tanstack/react-query';
import { useTelegram } from '@/hooks/useTelegram';

export function useModelSelection() {
  const queryClient = useQueryClient();
  const tg = useTelegram();

  const mutation = useSelectLlmModelApiV1LlmModelPut({
    mutation: {
      onSuccess: () => {
        // Invalidate current model and settings
        queryClient.invalidateQueries({ queryKey: ['/api/v1/llm/model'] });
        queryClient.invalidateQueries({ queryKey: ['/api/v1/settings'] });
      }
    }
  });

  const selectModel = async (modelId: string) => {
    // Haptic feedback
    tg?.haptic?.impactOccurred('light');

    await mutation.mutateAsync({ data: { model_id: modelId } });
  };

  return {
    selectModel,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
}
