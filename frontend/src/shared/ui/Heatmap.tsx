import clsx from 'clsx';

export function Heatmap({ values = [], compact = false }: { values?: number[]; compact?: boolean }) {
  const cells = values.length ? values : Array.from({ length: compact ? 42 : 84 }, () => 0);
  return (
    <div className={clsx('max-w-full overflow-x-auto pb-1', compact && 'max-w-72')}>
      <div className="grid min-w-max grid-flow-col grid-rows-7 gap-1">
        {cells.map((value, index) => (
          <span
            key={index}
            className={clsx('rounded-[3px] border border-line-soft', compact ? 'h-3 w-3' : 'h-4 w-4')}
            style={{ background: `var(--heat-${Math.max(0, Math.min(4, value))})` }}
          />
        ))}
      </div>
    </div>
  );
}
