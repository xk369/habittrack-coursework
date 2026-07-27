import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BarChart3, CalendarCheck2, Shield, UserRound } from 'lucide-react';

import { useAuth } from '../features/auth/AuthProvider';
import { firstError, isAccountBlockedError, normalizeApiError } from '../shared/lib/errors';
import { Button, Card, InlineAlert, Input } from '../shared/ui/primitives';

interface LoginForm {
  email: string;
  password: string;
}

const demoAccounts = [
  {
    key: 'demo',
    label: 'Демо-пользователь',
    email: 'demo@habittrack.local',
    password: 'DemoUser!2026',
    icon: UserRound,
  },
  {
    key: 'admin',
    label: 'Администратор',
    email: 'admin@habittrack.local',
    password: 'AdminDemo!2026',
    icon: Shield,
  },
] as const;

export function safeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return '/';
  }
  return next;
}

export function LoginPage() {
  const { login, blockedBanner } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [quickLoginTarget, setQuickLoginTarget] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    formState,
  } = useForm<LoginForm>();

  function handleAuthError(err: unknown) {
    const normalized = normalizeApiError(err);
    Object.entries(normalized.fieldErrors).forEach(([field, messages]) => {
      if (field === 'email' || field === 'password') {
        setFieldError(field, { message: messages[0] });
      }
    });
    if (isAccountBlockedError(err)) {
      setError('Ваш аккаунт заблокирован администратором');
    } else if (normalized.detail || normalized.nonFieldErrors.length || !Object.keys(normalized.fieldErrors).length) {
      setError(firstError(err, 'Неверный email или пароль'));
    }
  }

  async function authenticate(values: LoginForm) {
    setError(null);
    clearErrors();
    try {
      await login(values.email, values.password);
      navigate(safeNextPath(params.get('next')), { replace: true });
    } catch (err) {
      handleAuthError(err);
    }
  }

  async function submit(values: LoginForm) {
    await authenticate(values);
  }

  async function quickLogin(account: (typeof demoAccounts)[number]) {
    setQuickLoginTarget(account.key);
    try {
      await authenticate({ email: account.email, password: account.password });
    } finally {
      setQuickLoginTarget(null);
    }
  }

  return (
    <AuthShell title="Вход в HabitTrack" subtitle="Продолжите вести аккуратный учет привычек.">
      {blockedBanner && <InlineAlert>Ваш аккаунт заблокирован администратором</InlineAlert>}
      {error && <InlineAlert>{error}</InlineAlert>}
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Email</span>
          <Input type="email" autoComplete="email" {...register('email', { required: true })} />
          {formState.errors.email && <p className="mt-2 text-sm text-danger">{formState.errors.email.message}</p>}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Пароль</span>
          <Input type="password" autoComplete="current-password" {...register('password', { required: true })} />
          {formState.errors.password && <p className="mt-2 text-sm text-danger">{formState.errors.password.message}</p>}
        </label>
        <Button type="submit" variant="accent" loading={formState.isSubmitting} className="w-full">Войти</Button>
      </form>
      <div className="rounded-md border border-line bg-surface-inset p-3">
        <div className="ht-eyebrow mb-3">Демо-доступ</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <Button
                key={account.key}
                type="button"
                variant="secondary"
                loading={quickLoginTarget === account.key}
                disabled={formState.isSubmitting || Boolean(quickLoginTarget)}
                onClick={() => quickLogin(account)}
              >
                <Icon className="h-4 w-4" />
                {account.label}
              </Button>
            );
          })}
        </div>
      </div>
      <p className="text-center text-sm text-ink-2">
        Нет аккаунта? <Link className="font-medium text-sage-700" to="/register">Зарегистрироваться</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page p-4 lg:grid lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-6 lg:p-6">
      <section className="hidden min-h-[calc(100vh-48px)] flex-col justify-between rounded-lg border border-line bg-surface-card2 p-8 shadow-[var(--shadow-card)] lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 grid-cols-2 gap-1 rounded-md border border-sage-700 bg-sage-600 p-1">
              <span className="rounded-[2px] bg-[#fbfffd]/85" />
              <span className="rounded-[2px] bg-[#fbfffd]/45" />
              <span className="rounded-[2px] bg-[#fbfffd]/35" />
              <span className="rounded-[2px] bg-[#fbfffd]/72" />
            </span>
            <div>
              <div className="text-lg font-semibold text-ink">HabitTrack</div>
              <div className="ht-eyebrow">Рабочий журнал</div>
            </div>
          </div>
          <div className="mt-14 max-w-xl">
            <div className="ht-eyebrow mb-3">Демо-проект</div>
            <h2 className="text-[34px] font-semibold leading-tight text-ink">Метрики привычек без визуального шума</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-ink-2">
              Активные привычки, серии, выполнение по расписанию и история отметок собраны в одном спокойном рабочем интерфейсе.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-line bg-surface-card p-4">
            <CalendarCheck2 className="h-5 w-5 text-sage-700" />
            <div className="mt-5 ht-eyebrow">Ритм</div>
            <div className="mt-1 text-xl font-semibold text-ink">ежедневно</div>
          </div>
          <div className="rounded-md border border-line bg-surface-card p-4">
            <BarChart3 className="h-5 w-5 text-accent-blue" />
            <div className="mt-5 ht-eyebrow">Метрики</div>
            <div className="mt-1 text-xl font-semibold text-ink">серии и %</div>
          </div>
        </div>
      </section>
      <div className="flex min-h-[calc(100vh-32px)] items-center justify-center lg:min-h-[calc(100vh-48px)]">
        <Card className="w-full max-w-md overflow-hidden">
          <div className="border-b border-line bg-surface-inset p-6">
            <div className="ht-eyebrow mb-2">HabitTrack</div>
            <h1 className="text-2xl font-semibold text-ink">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-ink-2">{subtitle}</p>
          </div>
          <div className="space-y-5 p-6">{children}</div>
        </Card>
      </div>
    </div>
  );
}
