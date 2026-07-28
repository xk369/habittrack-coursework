import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CalendarCheck2, Flame, Gauge, ListChecks, Plus } from 'lucide-react';

import * as analyticsApi from '../api/analytics';
import { MarkTodayButton } from '../features/completions/MarkTodayButton';
import { percent } from '../shared/lib/format';
import { Button, Card, EmptyState, PageTitle, ProgressBar, Skeleton, StatCard } from '../shared/ui/primitives';

export function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: analyticsApi.getDashboard });
  const habits = data?.habits ?? [];
  const activeHabitsCount = data?.active_habits_count ?? 0;
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completion_count, 0);
  const complianceValues = habits
    .map((habit) => habit.compliance_percent)
    .filter((value): value is number => value !== null);
  const averageCompliance = complianceValues.length
    ? complianceValues.reduce((sum, value) => sum + value, 0) / complianceValues.length
    : null;
  const bestStreak = habits.length ? Math.max(...habits.map((habit) => habit.current_streak)) : 0;

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Сегодня"
        title="Дашборд привычек"
        description="Текущий ритм, серии и выполнение по активным привычкам."
        action={<Link className="block w-full md:w-auto" to="/habits/new"><Button className="w-full md:w-auto" variant="accent"><Plus className="h-4 w-4" />Создать привычку</Button></Link>}
      />
      <Card className="overflow-hidden">
        <div className="grid gap-0 xl:grid-cols-[1.05fr_1fr]">
          <div className="border-b border-line p-6 lg:border-b-0 lg:border-r">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-sage-200 bg-sage-50 text-sage-700">
                <Gauge className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="ht-eyebrow mb-2">Рабочая сводка</div>
                <h2 className="text-2xl font-semibold text-ink">Активный ритм на сегодня</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-2">
                  Быстрая проверка: сколько привычек сейчас в работе, сколько отметок уже накоплено и где держится выполнение.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/habits"><Button variant="secondary"><ListChecks className="h-4 w-4" />Открыть привычки</Button></Link>
              <Link to="/profile"><Button variant="ghost">Профиль</Button></Link>
            </div>
          </div>
          <div className="grid gap-3 bg-surface-card2 p-4 sm:grid-cols-2 xl:grid-cols-2">
            <StatCard label="Активных" value={activeHabitsCount} tone="sage" note="В работе сейчас" />
            <StatCard label="Отметок" value={totalCompletions} note="За весь период" />
            <StatCard label="Лучшая серия" value={bestStreak} unit="дн." />
            <StatCard label="Соблюдение" value={percent(averageCompliance)} tone="sage" note="Среднее по активным" />
          </div>
        </div>
      </Card>
      {!habits.length ? (
        <EmptyState
          title="У вас пока нет активных привычек"
          description="Создайте первую привычку и начните собирать историю выполнения."
          action={<Link to="/habits/new"><Button variant="accent">Создать привычку</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {habits.map((habit) => (
            <Card key={habit.habit_id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/habits/${habit.habit_id}`} className="text-lg font-medium text-ink hover:text-sage-700">
                    {habit.title}
                  </Link>
                  <p className="mt-1 flex items-center gap-2 text-sm text-ink-2">
                    <Flame className="h-4 w-4 text-accent-amber" />
                    Серия: <span className="ht-num text-sage-700">{habit.current_streak}</span> дней
                  </p>
                </div>
                <MarkTodayButton habitId={habit.habit_id} className="w-full sm:w-auto" />
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs text-ink-2">
                  <span>Соблюдение</span>
                  <span className="ht-num text-ink">{percent(habit.compliance_percent)}</span>
                </div>
                <ProgressBar value={habit.compliance_percent} label={`Соблюдение привычки ${habit.title}`} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <StatCard label="Отметок" value={habit.completion_count} />
                <StatCard label="План" value={habit.scheduled_dates_count} />
                <StatCard label="В срок" value={habit.completed_scheduled_dates_count} />
              </div>
              <Link
                to={`/habits/${habit.habit_id}`}
                className="soft-motion mt-4 inline-flex items-center gap-2 text-sm font-medium text-sage-700 hover:text-sage-ink"
              >
                <CalendarCheck2 className="h-4 w-4" />
                Открыть историю
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
