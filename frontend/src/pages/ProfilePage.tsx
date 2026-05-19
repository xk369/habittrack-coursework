import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import * as authApi from '../api/auth';
import { useAuth } from '../features/auth/AuthProvider';
import { firstError } from '../shared/lib/errors';
import { Button, Card, Input, PageTitle, Skeleton, StatusBadge } from '../shared/ui/primitives';
import { useToast } from '../shared/ui/Toast';

interface ProfileForm {
  display_name: string;
}

export function ProfilePage() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: authApi.getProfile });
  const { register, handleSubmit, reset, formState } = useForm<ProfileForm>();

  useEffect(() => {
    if (data) reset({ display_name: data.display_name });
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: authApi.patchProfile,
    onSuccess: (user) => {
      updateUser(user);
      showToast('Профиль обновлен', 'success');
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });

  if (isLoading || !data) return <Skeleton className="h-80" />;

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="Профиль" title="Учетная запись" description="Роль и статус доступны только для чтения." />
      <Card className="max-w-2xl p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="ht-eyebrow mb-2">Email</div>
            <div className="text-sm text-ink">{data.email}</div>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={data.role} />
            <StatusBadge status={data.status} />
          </div>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Display name</span>
            <Input {...register('display_name')} />
          </label>
          <Button type="submit" variant="accent" loading={formState.isSubmitting || mutation.isPending}>Сохранить</Button>
        </form>
      </Card>
    </div>
  );
}
