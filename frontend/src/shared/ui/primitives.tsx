import clsx from 'clsx';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';

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
        'focus-ring soft-motion inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium disabled:opacity-55',
        variant === 'primary' && 'border-ink bg-ink text-surface-card',
        variant === 'accent' && 'border-sage-700 bg-sage-600 text-[#fbfbf7] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
        variant === 'secondary' && 'border-line-strong bg-surface-card text-ink',
        variant === 'ghost' && 'border-transparent bg-transparent text-ink-1',
        variant === 'danger' && 'border-danger-line bg-surface-card text-danger',
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
  return <div ref={ref} className={clsx('rounded-lg border border-line bg-surface-card', className)} {...props} />;
});

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-xl border border-line bg-surface-card', className)} {...props} />;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className={clsx(
        'focus-ring h-11 w-full rounded-md border border-line-strong bg-surface-card px-3 text-sm text-ink placeholder:text-ink-3',
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
        'focus-ring min-h-24 w-full rounded-md border border-line-strong bg-surface-card px-3 py-2 text-sm text-ink placeholder:text-ink-3',
        props.className,
      )}
    />
  );
});

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'active' | 'archived' | 'danger' | 'sage';
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-medium leading-none',
        tone === 'neutral' && 'border-line bg-surface-inset text-ink-1',
        tone === 'active' && 'border-sage-200 bg-sage-50 text-sage-700',
        tone === 'archived' && 'border-line bg-surface-inset text-ink-2',
        tone === 'danger' && 'border-danger-line bg-danger-soft text-danger',
        tone === 'sage' && 'border-sage-200 bg-sage-50 text-sage-700',
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

  return <Badge tone={role === 'admin' ? 'sage' : 'neutral'}>{labels[role] ?? role}</Badge>;
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
    <div className="inline-flex rounded-md border border-line bg-surface-inset p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={clsx(
            'focus-ring soft-motion rounded-sm px-3 py-1.5 text-sm font-medium',
            value === option.value ? 'bg-surface-card text-ink shadow-[inset_0_0_0_1px_var(--line)]' : 'text-ink-2',
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
        tone === 'danger' ? 'border-danger-line bg-danger-soft text-danger' : 'border-line bg-surface-inset text-ink-2',
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="h-14 w-14 rounded-lg border border-line bg-surface-inset" />
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

export function StatCard({ label, value, unit }: { label: string; value: ReactNode; unit?: string }) {
  return (
    <Card className="p-4">
      <div className="ht-eyebrow">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="ht-num text-3xl font-medium text-ink">{value}</span>
        {unit && <span className="text-sm text-ink-3">{unit}</span>}
      </div>
    </Card>
  );
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <div className="ht-eyebrow mb-2">{eyebrow}</div>}
        <h1 className="text-3xl font-medium tracking-normal text-ink md:text-[38px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-2">{description}</p>}
      </div>
      {action}
    </header>
  );
}
