import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import * as habitsApi from '../api/habits';
import type { HabitPayload } from '../api/types';
import { HabitForm } from '../features/habits/HabitForm';
import { PageTitle } from '../shared/ui/primitives';
import { useToast } from '../shared/ui/Toast';

export function HabitCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: habitsApi.createHabit,
    onSuccess: (habit) => {
      showToast('Привычка создана', 'success');
      navigate(`/habits/${habit.id}`);
    },
  });

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="Новая привычка" title="Создать привычку" description="Опишите, что и когда вы хотите делать." />
      <HabitForm submitLabel="Создать привычку" onSubmit={(payload: HabitPayload) => mutation.mutateAsync(payload)} />
    </div>
  );
}
