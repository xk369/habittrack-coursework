import clsx from 'clsx';
import dayjs from 'dayjs';

const weekdayLabels = ['Пн', '', 'Ср', '', 'Пт', '', ''];

function mondayOf(value: dayjs.Dayjs) {
  return value.subtract((value.day() + 6) % 7, 'day').startOf('day');
}

export function Heatmap({
  values = [],
  compact = false,
  startDate,
  endDate,
  completedDates = [],
}: {
  values?: number[];
  compact?: boolean;
  startDate?: string;
  endDate?: string;
  completedDates?: string[];
}) {
  const hasDateRange = Boolean(startDate || endDate);
  const safeEnd = endDate && dayjs(endDate).isValid() ? dayjs(endDate) : dayjs();
  const safeStart = startDate && dayjs(startDate).isValid() ? dayjs(startDate) : safeEnd.subtract(83, 'day');
  const requestedStart = mondayOf(safeStart);
  const requestedEnd = mondayOf(safeEnd).add(6, 'day');
  const rangeDays = requestedEnd.diff(requestedStart, 'day') + 1;
  const gridEnd = rangeDays > 84 ? requestedEnd : requestedEnd;
  const gridStart = rangeDays > 84 ? gridEnd.subtract(83, 'day') : requestedStart;
  const totalDays = Math.min(84, gridEnd.diff(gridStart, 'day') + 1);
  const dayCells = Array.from({ length: totalDays }, (_, index) => {
    const date = gridStart.add(index, 'day');
    const dateKey = date.format('YYYY-MM-DD');
    const inRange = !hasDateRange || (!date.isBefore(safeStart, 'day') && !date.isAfter(safeEnd, 'day'));
    return {
      dateKey,
      inRange,
      completed: completedDates.includes(dateKey) || (!completedDates.length && Boolean(values[index])),
    };
  });
  const weeks = Array.from({ length: Math.ceil(dayCells.length / 7) }, (_, weekIndex) => (
    dayCells.slice(weekIndex * 7, weekIndex * 7 + 7)
  ));
  const cellSize = compact ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={clsx('max-w-full overflow-x-auto pb-1', compact && 'max-w-72')}>
      <div className="flex min-w-max gap-2" role="grid" aria-label="История выполнения по дням">
        {!compact && (
          <div className="grid grid-rows-7 gap-1 pt-0.5 text-[10px] leading-4 text-ink-3" aria-hidden="true">
            {weekdayLabels.map((label, index) => <span key={index}>{label}</span>)}
          </div>
        )}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1" role="row">
              {week.map((cell) => (
                <span
                  key={cell.dateKey}
                  role="gridcell"
                  aria-label={`${cell.dateKey}: ${cell.inRange && cell.completed ? 'выполнено' : 'нет отметки'}`}
                  title={`${cell.dateKey}: ${cell.inRange && cell.completed ? 'выполнено' : 'нет отметки'}`}
                  className={clsx(
                    'rounded-xs border border-line-soft',
                    cellSize,
                    !cell.inRange && 'bg-surface-card opacity-40',
                  )}
                  style={{ background: cell.inRange ? `var(--heat-${cell.completed ? 3 : 0})` : undefined }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
