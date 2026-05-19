import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import * as completionsApi from '../../api/completions';
import { firstError, normalizeApiError } from '../../shared/lib/errors';
import { todayIso } from '../../shared/lib/format';
import { Button } from '../../shared/ui/primitives';
import { useToast } from '../../shared/ui/Toast';

export function MarkTodayButton({ habitId, disabled }: { habitId: number; disabled?: boolean }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: () => completionsApi.createCompletion(habitId, todayIso()),
    onSuccess: async () => {
      showToast('Отметка за сегодня добавлена', 'success');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['habit', habitId] }),
        queryClient.invalidateQueries({ queryKey: ['statistics', habitId] }),
        queryClient.invalidateQueries({ queryKey: ['completions', habitId] }),
      ]);
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      const isDuplicateCompletion = axios.isAxiosError(error)
        && error.response?.status === 400
        && Boolean(normalized.fieldErrors.completion_date?.length);
      showToast(isDuplicateCompletion ? 'Отметка за сегодня уже есть' : firstError(error), 'error');
    },
  });

  return (
    <Button
      variant="accent"
      loading={mutation.isPending}
      disabled={disabled}
      onClick={() => mutation.mutate()}
    >
      Отметить сегодня
    </Button>
  );
}
