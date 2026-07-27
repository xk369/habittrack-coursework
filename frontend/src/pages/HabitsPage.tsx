import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import * as habitsApi from '../api/habits';
import type { Habit, HabitState } from '../api/types';
import { scheduleLabel } from '../shared/lib/domain';
import { firstError } from '../shared/lib/errors';
import { Button, Card, EmptyState, PageTitle, SegmentTabs, StatusBadge } from '../shared/ui/primitives';
import { ConfirmDialog } from '../shared/ui/ConfirmDialog';
import { useToast } from '../shared/ui/Toast';

type TabState = HabitState | 'all';

export function HabitsPage() {
  const [state, setState] = useState<TabState>('active');
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data = [], isLoading } = useQuery({ queryKey: ['habits', state], queryFn: () => habitsApi.listHabits(state) });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['habits'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]);
  };

  const archive = useMutation({
    mutationFn: habitsApi.archiveHabit,
    onSuccess: async () => {
      await invalidate();
      showToast('Привычка архивирована', 'success');
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });
  const unarchive = useMutation({
    mutationFn: habitsApi.unarchiveHabit,
    onSuccess: async () => {
      await invalidate();
      showToast('Привычка возвращена из архива', 'success');
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });
  const remove = useMutation({
    mutationFn: habitsApi.deleteHabit,
    onSuccess: async () => {
      setDeleteTarget(null);
      await invalidate();
      showToast('Привычка удалена', 'success');
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Привычки"
        title="Личный список"
        description="Создавайте, архивируйте и удаляйте привычки без потери уже собранной статистики архивных записей."
        action={<Link to="/habits/new"><Button variant="accent">Новая привычка</Button></Link>}
      />
      <SegmentTabs
        value={state}
        onChange={setState}
        options={[
          { value: 'active', label: 'Активные' },
          { value: 'archived', label: 'Архив' },
          { value: 'all', label: 'Все' },
        ]}
      />
      {!isLoading && !data.length ? (
        <EmptyState
          title={state === 'archived' ? 'Архив пуст' : state === 'active' ? 'У вас пока нет активных привычек' : 'Список пуст'}
          action={<Link to="/habits/new"><Button variant="accent">Создать привычку</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((habit) => (
            <Card key={habit.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link className="text-lg font-medium hover:text-sage-700" to={`/habits/${habit.id}`}>{habit.title}</Link>
                  <p className="mt-1 text-sm text-ink-2">{habit.purpose || 'Без описания'}</p>
                </div>
                <StatusBadge status={habit.state} />
              </div>
              <div className="mt-4 rounded-md border border-line bg-surface-inset p-3 text-sm text-ink-2">{scheduleLabel(habit.schedule)}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/habits/${habit.id}`}><Button variant="secondary">Открыть</Button></Link>
                <Link to={`/habits/${habit.id}/edit`}><Button variant="ghost">Редактировать</Button></Link>
                {habit.state === 'active' ? (
                  <Button variant="secondary" loading={archive.isPending} onClick={() => archive.mutate(habit.id)}>В архив</Button>
                ) : (
                  <Button variant="secondary" loading={unarchive.isPending} onClick={() => unarchive.mutate(habit.id)}>Вернуть</Button>
                )}
                <Button variant="danger" onClick={() => setDeleteTarget(habit)}>Удалить</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить привычку?"
        description="Это действие необратимо удалит привычку, расписание и связанные отметки."
        confirmLabel="Удалить"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
      />
    </div>
  );
}
