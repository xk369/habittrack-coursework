import axios from 'axios';
import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import * as habitsApi from '../api/habits';
import type { HabitPayload } from '../api/types';
import { HabitForm } from '../features/habits/HabitForm';
import { PageTitle, Skeleton } from '../shared/ui/primitives';
import { useToast } from '../shared/ui/Toast';

export function HabitEditPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data, isLoading, error } = useQuery({ queryKey: ['habit', id], queryFn: () => habitsApi.getHabit(id), enabled: Number.isFinite(id) });
  const mutation = useMutation({
    mutationFn: (payload: HabitPayload) => habitsApi.updateHabit(id, payload),
    onSuccess: (habit) => {
      showToast('Привычка обновлена', 'success');
      navigate(`/habits/${habit.id}`);
    },
  });

  useEffect(() => {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      showToast('Привычка не найдена', 'error');
      navigate('/habits');
    }
  }, [error, navigate, showToast]);

  if (isLoading || !data) return <Skeleton className="h-80" />;

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="Редактирование" title={data.title} description="Измените название, цель или расписание привычки." />
      <HabitForm habit={data} submitLabel="Сохранить изменения" onSubmit={(payload) => mutation.mutateAsync(payload)} />
    </div>
  );
}
