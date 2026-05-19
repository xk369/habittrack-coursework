import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import * as analyticsApi from '../api/analytics';
import { MarkTodayButton } from '../features/completions/MarkTodayButton';
import { percent } from '../shared/lib/format';
import { Button, Card, EmptyState, PageTitle, Skeleton, StatCard } from '../shared/ui/primitives';

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

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Сегодня"
        title="Ваш журнал привычек"
        description="Теплая сводка активных привычек, серий и процента соблюдения."
        action={<Link to="/habits/new"><Button variant="accent">Создать привычку</Button></Link>}
      />
      <Card className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
          <div className="border-b border-line p-6 lg:border-b-0 lg:border-r">
            <div className="ht-eyebrow mb-2">Сводка</div>
            <h2 className="text-2xl font-medium text-ink">Активный ритм на сегодня</h2>
            <p className="mt-2 text-sm leading-6 text-ink-2">
              Все показатели в этой зоне рассчитаны из текущих данных dashboard API.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/habits"><Button variant="secondary">Открыть привычки</Button></Link>
              <Link to="/profile"><Button variant="ghost">Профиль</Button></Link>
            </div>
          </div>
          <div className="grid gap-1 bg-line p-px sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <StatCard label="Активных" value={activeHabitsCount} />
            <StatCard label="Отметок" value={totalCompletions} />
            <StatCard label="Compliance" value={percent(averageCompliance)} />
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
                <div>
                  <Link to={`/habits/${habit.habit_id}`} className="text-lg font-medium text-ink hover:text-sage-700">
                    {habit.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-2">Серия: <span className="ht-num text-sage-700">{habit.current_streak}</span> дней</p>
                </div>
                <MarkTodayButton habitId={habit.habit_id} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <StatCard label="Compliance" value={percent(habit.compliance_percent)} />
                <StatCard label="Отметок" value={habit.completion_count} />
                <StatCard label="План" value={habit.scheduled_dates_count} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
