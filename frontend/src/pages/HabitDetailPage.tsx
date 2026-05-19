import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';

import * as analyticsApi from '../api/analytics';
import * as completionsApi from '../api/completions';
import * as habitsApi from '../api/habits';
import type { Completion, Habit } from '../api/types';
import { MarkTodayButton } from '../features/completions/MarkTodayButton';
import { scheduleLabel } from '../shared/lib/domain';
import { firstError } from '../shared/lib/errors';
import { formatDate, percent } from '../shared/lib/format';
import { Heatmap } from '../shared/ui/Heatmap';
import { Button, Card, EmptyState, PageTitle, Skeleton, StatCard, StatusBadge } from '../shared/ui/primitives';
import { ConfirmDialog } from '../shared/ui/ConfirmDialog';
import { useToast } from '../shared/ui/Toast';

function buildCompletionHeatmapValues(completions: Completion[], periodStart?: string, periodEnd?: string) {
  const maxCells = 84;
  const completedDates = new Set(completions.map((completion) => completion.completion_date));
  const end = dayjs(periodEnd ?? undefined);
  const safeEnd = end.isValid() ? end : dayjs();
  const requestedStart = periodStart ? dayjs(periodStart) : safeEnd.subtract(maxCells - 1, 'day');
  const safeRequestedStart = requestedStart.isValid() ? requestedStart : safeEnd.subtract(maxCells - 1, 'day');
  const start = safeEnd.diff(safeRequestedStart, 'day') + 1 > maxCells
    ? safeEnd.subtract(maxCells - 1, 'day')
    : safeRequestedStart;
  const days = Math.max(0, Math.min(maxCells, safeEnd.diff(start, 'day') + 1));

  // Chronological order, oldest to newest. CSS lays cells top-to-bottom, then column-by-column.
  return Array.from({ length: days }, (_, index) => {
    const date = start.add(index, 'day').format('YYYY-MM-DD');
    return completedDates.has(date) ? 1 : 0;
  });
}

export function HabitDetailPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [deleteHabitTarget, setDeleteHabitTarget] = useState<Habit | null>(null);
  const [deleteCompletionTarget, setDeleteCompletionTarget] = useState<Completion | null>(null);

  const habit = useQuery({ queryKey: ['habit', id], queryFn: () => habitsApi.getHabit(id), enabled: Number.isFinite(id) });
  const stats = useQuery({ queryKey: ['statistics', id], queryFn: () => analyticsApi.getHabitStatistics(id), enabled: Boolean(habit.data) });
  const completions = useQuery({ queryKey: ['completions', id], queryFn: () => completionsApi.listCompletions(id), enabled: Boolean(habit.data) });

  useEffect(() => {
    if (axios.isAxiosError(habit.error) && habit.error.response?.status === 404) {
      showToast('Привычка не найдена', 'error');
      navigate('/habits');
    }
  }, [habit.error, navigate, showToast]);

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['habit', id] }),
      queryClient.invalidateQueries({ queryKey: ['statistics', id] }),
      queryClient.invalidateQueries({ queryKey: ['completions', id] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['habits'] }),
    ]);
  };

  const archive = useMutation({
    mutationFn: habitsApi.archiveHabit,
    onSuccess: async () => {
      showToast('Привычка архивирована', 'success');
      await invalidate();
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });
  const unarchive = useMutation({
    mutationFn: habitsApi.unarchiveHabit,
    onSuccess: async () => {
      showToast('Привычка возвращена из архива', 'success');
      await invalidate();
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });
  const removeHabit = useMutation({
    mutationFn: habitsApi.deleteHabit,
    onSuccess: () => {
      showToast('Привычка удалена', 'success');
      navigate('/habits');
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });
  const removeCompletion = useMutation({
    mutationFn: (completionId: number) => completionsApi.deleteCompletion(id, completionId),
    onSuccess: async () => {
      showToast('Отметка снята', 'success');
      setDeleteCompletionTarget(null);
      await invalidate();
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });

  if (habit.isLoading || !habit.data) return <Skeleton className="h-96" />;

  const isArchived = habit.data.state === 'archived';
  const heatmapValues = buildCompletionHeatmapValues(
    completions.data ?? [],
    stats.data?.period_start,
    stats.data?.period_end,
  );

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow={`HABIT_${habit.data.id}`}
        title={habit.data.title}
        description={habit.data.purpose || 'Без описания'}
        action={
          <div className="flex flex-wrap gap-2">
            {!isArchived && <MarkTodayButton habitId={habit.data.id} />}
            <Link to={`/habits/${habit.data.id}/edit`}><Button variant="secondary">Редактировать</Button></Link>
            {isArchived ? (
              <Button variant="secondary" loading={unarchive.isPending} onClick={() => unarchive.mutate(habit.data.id)}>Вернуть</Button>
            ) : (
              <Button variant="secondary" loading={archive.isPending} onClick={() => archive.mutate(habit.data.id)}>В архив</Button>
            )}
            <Button variant="danger" onClick={() => setDeleteHabitTarget(habit.data)}>Удалить</Button>
          </div>
        }
      />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={habit.data.state} />
            <span className="rounded-md border border-line bg-surface-inset px-3 py-2 text-sm text-ink-2">{scheduleLabel(habit.data.schedule)}</span>
          </div>
          <span className="font-mono text-xs text-ink-3">создана {formatDate(habit.data.created_at)}</span>
        </div>
        <div className="grid gap-1 bg-line p-px md:grid-cols-5">
          <StatCard label="Streak" value={stats.data?.current_streak ?? '—'} />
          <StatCard label="Compliance" value={percent(stats.data?.compliance_percent ?? null)} />
          <StatCard label="Отметок" value={stats.data?.completion_count ?? '—'} />
          <StatCard label="План" value={stats.data?.scheduled_dates_count ?? '—'} />
          <StatCard label="Выполнено" value={stats.data?.completed_scheduled_dates_count ?? '—'} />
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="ht-eyebrow mb-3">История выполнения</div>
          <div className="rounded-md border border-line bg-surface-inset p-4">
            <Heatmap values={heatmapValues} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Отметки</h2>
            {stats.data && <span className="font-mono text-xs text-ink-3">{stats.data.period_start} — {stats.data.period_end}</span>}
          </div>
          {!completions.data?.length ? (
            <EmptyState title="История пока пустая" />
          ) : (
            <div className="space-y-2">
              {completions.data.map((completion) => (
                <div key={completion.id} className="flex items-center justify-between rounded-md border border-line bg-surface-inset px-3 py-2">
                  <span className="font-mono text-sm">{formatDate(completion.completion_date)}</span>
                  {!isArchived && <Button variant="ghost" onClick={() => setDeleteCompletionTarget(completion)}>Снять</Button>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <ConfirmDialog
        open={Boolean(deleteHabitTarget)}
        title="Удалить привычку?"
        description="Удаление необратимо."
        confirmLabel="Удалить"
        onCancel={() => setDeleteHabitTarget(null)}
        onConfirm={() => deleteHabitTarget && removeHabit.mutate(deleteHabitTarget.id)}
      />
      <ConfirmDialog
        open={Boolean(deleteCompletionTarget)}
        title="Снять отметку?"
        description="Отметка выполнения будет удалена."
        confirmLabel="Снять"
        onCancel={() => setDeleteCompletionTarget(null)}
        onConfirm={() => deleteCompletionTarget && removeCompletion.mutate(deleteCompletionTarget.id)}
      />
    </div>
  );
}
