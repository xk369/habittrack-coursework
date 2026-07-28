import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Archive, ArchiveRestore, CalendarDays, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';

import * as habitsApi from '../api/habits';
import type { Habit, HabitState } from '../api/types';
import { scheduleLabel } from '../shared/lib/domain';
import { firstError } from '../shared/lib/errors';
import { Button, Card, EmptyState, PageTitle, SegmentTabs, Skeleton, StatusBadge } from '../shared/ui/primitives';
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
        description="Создавайте, архивируйте и удаляйте привычки без потери собранной статистики."
        action={<Link className="block w-full md:w-auto" to="/habits/new"><Button className="w-full md:w-auto" variant="accent"><Plus className="h-4 w-4" />Новая привычка</Button></Link>}
      />
      <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentTabs
          value={state}
          onChange={setState}
          options={[
            { value: 'active', label: 'Активные' },
            { value: 'archived', label: 'Архив' },
            { value: 'all', label: 'Все' },
          ]}
        />
        <span className="ht-eyebrow px-1">{isLoading ? 'Загрузка' : `Записей: ${data.length}`}</span>
      </Card>
      {isLoading ? (
        <Skeleton className="h-72" />
      ) : !data.length ? (
        <EmptyState
          title={state === 'archived' ? 'Архив пуст' : state === 'active' ? 'У вас пока нет активных привычек' : 'Список пуст'}
          action={<Link to="/habits/new"><Button variant="accent">Создать привычку</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((habit) => (
            <Card key={habit.id} className="soft-motion p-5 hover:border-sage-200">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link className="text-lg font-medium hover:text-sage-700" to={`/habits/${habit.id}`}>{habit.title}</Link>
                  <p className="mt-1 text-sm text-ink-2">{habit.purpose || 'Без описания'}</p>
                </div>
                <StatusBadge status={habit.state} />
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-md border border-line bg-surface-inset p-3 text-sm text-ink-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-sage-700" />
                <span>{scheduleLabel(habit.schedule)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="w-full sm:w-auto" to={`/habits/${habit.id}`}><Button className="w-full sm:w-auto" variant="secondary"><ExternalLink className="h-4 w-4" />Открыть</Button></Link>
                <Link className="w-full sm:w-auto" to={`/habits/${habit.id}/edit`}><Button className="w-full sm:w-auto" variant="ghost"><Pencil className="h-4 w-4" />Редактировать</Button></Link>
                {habit.state === 'active' ? (
                  <Button className="w-full sm:w-auto" variant="secondary" loading={archive.isPending} onClick={() => archive.mutate(habit.id)}><Archive className="h-4 w-4" />В архив</Button>
                ) : (
                  <Button className="w-full sm:w-auto" variant="secondary" loading={unarchive.isPending} onClick={() => unarchive.mutate(habit.id)}><ArchiveRestore className="h-4 w-4" />Вернуть</Button>
                )}
                <Button className="w-full sm:w-auto" variant="danger" onClick={() => setDeleteTarget(habit)}><Trash2 className="h-4 w-4" />Удалить</Button>
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
