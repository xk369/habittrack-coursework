import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../features/auth/AuthProvider';
import { firstError, normalizeApiError } from '../shared/lib/errors';
import { Button, InlineAlert, Input } from '../shared/ui/primitives';
import { AuthShell } from './LoginPage';

interface RegisterForm {
  email: string;
  display_name: string;
  password: string;
}

export function RegisterPage() {
  const { registerAndLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    formState,
  } = useForm<RegisterForm>();

  async function submit(values: RegisterForm) {
    setError(null);
    clearErrors();
    try {
      await registerAndLogin(values.email, values.password, values.display_name);
      navigate('/', { replace: true });
    } catch (err) {
      const normalized = normalizeApiError(err);
      Object.entries(normalized.fieldErrors).forEach(([field, messages]) => {
        if (field === 'email' || field === 'password' || field === 'display_name') {
          setFieldError(field, { message: messages[0] });
        }
      });
      if (normalized.detail || normalized.nonFieldErrors.length || !Object.keys(normalized.fieldErrors).length) {
        setError(firstError(err));
      }
    }
  }

  return (
    <AuthShell title="Регистрация" subtitle="Создайте учетную запись и начните вести привычки.">
      {error && <InlineAlert>{error}</InlineAlert>}
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Email</span>
          <Input type="email" autoComplete="email" {...register('email', { required: true })} />
          {formState.errors.email && <p className="mt-2 text-sm text-danger">{formState.errors.email.message}</p>}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Имя</span>
          <Input {...register('display_name')} />
          {formState.errors.display_name && <p className="mt-2 text-sm text-danger">{formState.errors.display_name.message}</p>}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Пароль</span>
          <Input type="password" autoComplete="new-password" {...register('password', { required: true })} />
          {formState.errors.password && <p className="mt-2 text-sm text-danger">{formState.errors.password.message}</p>}
        </label>
        <Button type="submit" variant="accent" loading={formState.isSubmitting} className="w-full">Создать аккаунт</Button>
      </form>
      <p className="text-center text-sm text-ink-2">
        Уже есть аккаунт? <Link className="font-medium text-sage-700" to="/login">Войти</Link>
      </p>
    </AuthShell>
  );
}
