import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTelegram } from '@/hooks/useTelegram';
import { customFetch } from '@/api/mutator';

export function useModelSelection() {
  const queryClient = useQueryClient();
  const tg = useTelegram();

  const mutation = useMutation({
    mutationFn: async (modelId: string) => {
      return customFetch('/api/v1/llm/model', {
        method: 'PUT',
        body: JSON.stringify({ model_id: modelId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/llm/model'] });
      queryClient.invalidateQueries({ queryKey: ['/api/v1/settings'] });
    }
  });

  const selectModel = async (modelId: string) => {
    // Haptic feedback
    tg?.haptic?.impactOccurred('light');

    await mutation.mutateAsync(modelId);
  };

  return {
    selectModel,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
}
