import clsx from 'clsx';

export function Heatmap({ values = [], compact = false }: { values?: number[]; compact?: boolean }) {
  const cells = values.length ? values : Array.from({ length: compact ? 42 : 84 }, () => 0);
  return (
    <div className={clsx('grid grid-flow-col grid-rows-7 gap-1 overflow-hidden', compact ? 'max-w-72' : 'max-w-full')}>
      {cells.map((value, index) => (
        <span
          key={index}
          className={clsx('rounded-[3px] border border-line-soft', compact ? 'h-3 w-3' : 'h-4 w-4')}
          style={{ background: `var(--heat-${Math.max(0, Math.min(4, value))})` }}
        />
      ))}
    </div>
  );
}
