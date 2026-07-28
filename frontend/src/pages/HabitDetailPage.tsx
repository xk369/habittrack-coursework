import axios from 'axios';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, ArchiveRestore, CalendarDays, Pencil, Trash2, X } from 'lucide-react';

import * as analyticsApi from '../api/analytics';
import * as completionsApi from '../api/completions';
import * as habitsApi from '../api/habits';
import type { Completion, Habit } from '../api/types';
import { MarkTodayButton } from '../features/completions/MarkTodayButton';
import { scheduleLabel } from '../shared/lib/domain';
import { firstError } from '../shared/lib/errors';
import { formatDate, percent } from '../shared/lib/format';
import { Heatmap } from '../shared/ui/Heatmap';
import { Button, Card, PageTitle, ProgressBar, Skeleton, StatCard, StatusBadge } from '../shared/ui/primitives';
import { ConfirmDialog } from '../shared/ui/ConfirmDialog';
import { useToast } from '../shared/ui/Toast';

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
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow={`HABIT_${habit.data.id}`}
        title={habit.data.title}
        description={habit.data.purpose || 'Без описания'}
        action={
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            {!isArchived && <MarkTodayButton habitId={habit.data.id} className="col-span-2 w-full sm:col-span-1 sm:w-auto" />}
            <Link className="w-full sm:w-auto" to={`/habits/${habit.data.id}/edit`}><Button className="w-full sm:w-auto" variant="secondary"><Pencil className="h-4 w-4" />Редактировать</Button></Link>
            {isArchived ? (
              <Button className="w-full sm:w-auto" variant="secondary" loading={unarchive.isPending} onClick={() => unarchive.mutate(habit.data.id)}>
                <ArchiveRestore className="h-4 w-4" />
                Вернуть
              </Button>
            ) : (
              <Button className="w-full sm:w-auto" variant="secondary" loading={archive.isPending} onClick={() => archive.mutate(habit.data.id)}>
                <Archive className="h-4 w-4" />
                В архив
              </Button>
            )}
            <Button className="w-full sm:w-auto" variant="danger" onClick={() => setDeleteHabitTarget(habit.data)}><Trash2 className="h-4 w-4" />Удалить</Button>
          </div>
        }
      />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={habit.data.state} />
            <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-inset px-3 py-2 text-sm text-ink-2">
              <CalendarDays className="h-4 w-4 text-sage-700" />
              {scheduleLabel(habit.data.schedule)}
            </span>
          </div>
          <span className="font-mono text-xs text-ink-3">Создана {formatDate(habit.data.created_at)}</span>
        </div>
        <div className="border-b border-line bg-surface-card2 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-ink">Ключевые показатели</h2>
            <span className="ht-eyebrow">За период</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Серия" value={stats.data?.current_streak ?? '—'} unit="дн." tone="sage" />
          <StatCard label="Соблюдение" value={percent(stats.data?.compliance_percent ?? null)} tone="sage" />
          <StatCard label="Отметок" value={stats.data?.completion_count ?? '—'} />
          <StatCard label="План" value={stats.data?.scheduled_dates_count ?? '—'} />
          <StatCard label="В срок" value={stats.data?.completed_scheduled_dates_count ?? '—'} />
          </div>
        </div>
        <div className="border-t border-line p-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-ink-2">
            <span>Соблюдение расписания</span>
            <span className="ht-num text-ink">{percent(stats.data?.compliance_percent ?? null)}</span>
          </div>
          <ProgressBar value={stats.data?.compliance_percent} label={`Соблюдение привычки ${habit.data.title}`} />
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-ink">История выполнения</h2>
              <p className="mt-1 text-xs leading-5 text-ink-2">Недели идут слева направо, дни — сверху вниз.</p>
            </div>
            <span className="font-mono text-xs text-ink-3">
              {stats.data?.period_start && stats.data?.period_end
                ? `${formatDate(stats.data.period_start)} — ${formatDate(stats.data.period_end)}`
                : 'Последние 12 недель'}
            </span>
          </div>
          <div className="rounded-lg border border-line bg-surface-inset p-4">
            <Heatmap
              startDate={stats.data?.period_start}
              endDate={stats.data?.period_end}
              completedDates={(completions.data ?? []).map((completion) => completion.completion_date)}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3 text-xs text-ink-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-xs border border-line-soft" style={{ background: 'var(--heat-0)' }} />
                <span>Нет отметки</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-xs border border-line-soft" style={{ background: 'var(--heat-3)' }} />
                <span>Выполнено</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Отметки</h2>
              <p className="mt-1 text-xs text-ink-2">Последние выполненные дни</p>
            </div>
            <span className="ht-eyebrow">{completions.data?.length ?? 0} всего</span>
          </div>
          {!completions.data?.length ? (
            <div className="rounded-md border border-line bg-surface-inset p-5 text-sm text-ink-2">История пока пустая</div>
          ) : (
            <div className="space-y-2">
              {completions.data.map((completion) => (
                <div key={completion.id} className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-line bg-surface-inset px-3 py-2">
                  <span className="font-mono text-sm">{formatDate(completion.completion_date)}</span>
                  {!isArchived && (
                    <Button
                      variant="ghost"
                      className="h-10 w-10 min-h-10 min-w-10 shrink-0 px-0"
                      aria-label={`Снять отметку за ${formatDate(completion.completion_date)}`}
                      title="Снять отметку"
                      onClick={() => setDeleteCompletionTarget(completion)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
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
