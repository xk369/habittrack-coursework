import clsx from 'clsx';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { CircleDashed, Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
type BadgeTone = 'neutral' | 'active' | 'archived' | 'danger' | 'sage' | 'warning' | 'info';
type StatTone = 'neutral' | 'sage' | 'amber' | 'blue';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }>(function Button({
  variant = 'primary',
  loading,
  className,
  children,
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      className={clsx(
        'focus-ring soft-motion inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-55 disabled:shadow-none',
        variant === 'primary' && 'border-ink bg-ink text-surface-card hover:bg-surface-ink',
        variant === 'accent'
          && 'border-sage-700 bg-sage-600 text-[#fbfffd] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-sage-700',
        variant === 'secondary' && 'border-line-strong bg-surface-card text-ink hover:border-sage-200 hover:bg-surface-card2',
        variant === 'ghost' && 'border-transparent bg-transparent text-ink-1 hover:bg-surface-inset hover:text-ink',
        variant === 'danger' && 'border-danger-line bg-surface-card text-danger hover:bg-danger-soft',
        className,
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={clsx('rounded-lg border border-line bg-surface-card shadow-[var(--shadow-card)]', className)} {...props} />;
});

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-lg border border-line bg-surface-card2 shadow-[var(--shadow-card)]', className)} {...props} />;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className={clsx(
        'focus-ring soft-motion h-11 w-full rounded-md border border-line-strong bg-surface-card px-3 text-sm text-ink placeholder:text-ink-3 hover:border-sage-200 focus-visible:border-sage-500',
        props.className,
      )}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(props, ref) {
  return (
    <textarea
      {...props}
      ref={ref}
      className={clsx(
        'focus-ring soft-motion min-h-24 w-full rounded-md border border-line-strong bg-surface-card px-3 py-2 text-sm text-ink placeholder:text-ink-3 hover:border-sage-200 focus-visible:border-sage-500',
        props.className,
      )}
    />
  );
});

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        'inline-flex h-6 items-center rounded-full border px-2 text-[11px] font-medium leading-none',
        tone === 'neutral' && 'border-line bg-surface-inset text-ink-1',
        tone === 'active' && 'border-sage-200 bg-sage-50 text-sage-700',
        tone === 'archived' && 'border-line bg-surface-inset text-ink-2',
        tone === 'danger' && 'border-danger-line bg-danger-soft text-danger',
        tone === 'sage' && 'border-sage-200 bg-sage-50 text-sage-700',
        tone === 'warning' && 'border-accent-amber bg-accent-amberSoft text-ink-1',
        tone === 'info' && 'border-accent-blue bg-accent-blueSoft text-ink-1',
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    active: 'Активен',
    blocked: 'Заблокирован',
    archived: 'В архиве',
  };

  return (
    <Badge tone={status === 'active' ? 'active' : status === 'blocked' ? 'danger' : 'archived'}>
      {labels[status] ?? status}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const labels: Record<string, string> = {
    admin: 'Администратор',
    user: 'Пользователь',
  };

  return <Badge tone={role === 'admin' ? 'info' : 'neutral'}>{labels[role] ?? role}</Badge>;
}

export function SegmentTabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto rounded-md border border-line bg-surface-inset p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={clsx(
            'focus-ring soft-motion shrink-0 rounded-sm px-3 py-1.5 text-sm font-medium',
            value === option.value
              ? 'bg-surface-card text-ink shadow-[inset_0_0_0_1px_var(--line)]'
              : 'text-ink-2 hover:bg-surface-card/70 hover:text-ink',
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function InlineAlert({ children, tone = 'danger' }: { children: ReactNode; tone?: 'danger' | 'info' }) {
  return (
    <div
      className={clsx(
        'rounded-md border px-3 py-2 text-sm',
        tone === 'danger' ? 'border-danger-line bg-danger-soft text-danger' : 'border-accent-blue bg-accent-blueSoft text-ink-1',
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-line bg-surface-inset text-ink-3">
        <CircleDashed className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-base font-medium text-ink">{title}</h3>
        {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
      </div>
      {action}
    </Card>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-md bg-surface-inset', className)} />;
}

export function ProgressBar({ value, label, className }: { value: number | null | undefined; label: string; className?: string }) {
  const normalized = Number.isFinite(value) ? Math.max(0, Math.min(100, Number(value))) : 0;

  return (
    <div
      className={clsx('ht-progress-track h-2 w-full', className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
    >
      <div className="ht-progress-fill soft-motion" style={{ width: `${normalized}%` }} />
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  note,
  tone = 'neutral',
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  note?: ReactNode;
  tone?: StatTone;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'min-w-0 rounded-md border p-4',
        tone === 'neutral' && 'border-line bg-surface-card',
        tone === 'sage' && 'border-sage-200 bg-sage-50',
        tone === 'amber' && 'border-accent-amber bg-accent-amberSoft',
        tone === 'blue' && 'border-accent-blue bg-accent-blueSoft',
        className,
      )}
    >
      <div className="ht-eyebrow">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="ht-num truncate text-3xl font-medium text-ink">{value}</span>
        {unit && <span className="text-sm text-ink-3">{unit}</span>}
      </div>
      {note && <div className="mt-2 text-xs leading-5 text-ink-2">{note}</div>}
    </div>
  );
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="ht-eyebrow mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-[34px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-2">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
