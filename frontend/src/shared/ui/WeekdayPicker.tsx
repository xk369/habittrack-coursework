import clsx from 'clsx';

export const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export function WeekdayPicker({
  value,
  onChange,
  disabled,
}: {
  value: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
}) {
  function toggle(day: number) {
    if (disabled) return;
    onChange(value.includes(day) ? value.filter((item) => item !== day) : [...value, day].sort());
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {WEEKDAYS.map((day, index) => {
        const active = value.includes(index);
        return (
          <button
            key={day}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => toggle(index)}
            className={clsx(
              'focus-ring soft-motion h-14 rounded-md border text-xs font-medium uppercase disabled:opacity-50',
              active
                ? 'border-sage-700 bg-sage-600 text-[#fbfffd] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
                : 'border-line-strong bg-surface-card text-ink-2 hover:border-sage-200 hover:bg-surface-card2',
            )}
          >
            <span className="font-mono">{day}</span>
          </button>
        );
      })}
    </div>
  );
}

export function WeekdayStrip({ weekdays }: { weekdays: number[] }) {
  const all = weekdays.length === 7;
  return (
    <div className="flex flex-wrap gap-1">
      {WEEKDAYS.map((day, index) => {
        const active = all || weekdays.includes(index);
        return (
          <span
            key={day}
            className={clsx(
              'inline-flex h-7 w-7 items-center justify-center rounded-sm border font-mono text-[10px] uppercase',
              active ? 'border-sage-700 bg-sage-600 text-[#fbfffd]' : 'border-line bg-surface-card text-ink-3',
            )}
          >
            {day}
          </span>
        );
      })}
    </div>
  );
}
