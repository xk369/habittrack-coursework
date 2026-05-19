import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../features/auth/AuthProvider';
import { firstError, isAccountBlockedError, normalizeApiError } from '../shared/lib/errors';
import { Button, Card, InlineAlert, Input } from '../shared/ui/primitives';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login, blockedBanner } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    formState,
  } = useForm<LoginForm>();

  async function submit(values: LoginForm) {
    setError(null);
    clearErrors();
    try {
      await login(values.email, values.password);
      navigate(params.get('next') || '/', { replace: true });
    } catch (err) {
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
      <p className="text-center text-sm text-ink-2">
        Нет аккаунта? <Link className="font-medium text-sage-700" to="/register">Зарегистрироваться</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="border-b border-line bg-surface-inset p-6">
          <div className="ht-eyebrow mb-2">HabitTrack · Soft Ledger</div>
          <h1 className="text-2xl font-medium text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-ink-2">{subtitle}</p>
        </div>
        <div className="space-y-5 p-6">{children}</div>
      </Card>
    </div>
  );
}
