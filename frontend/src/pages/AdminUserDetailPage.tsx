import axios from 'axios';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import * as adminApi from '../api/admin';
import { AdminUserActions } from '../features/admin/AdminUserActions';
import { formatDate } from '../shared/lib/format';
import { Card, PageTitle, RoleBadge, Skeleton, StatusBadge } from '../shared/ui/primitives';
import { useToast } from '../shared/ui/Toast';

export function AdminUserDetailPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data, isLoading, error } = useQuery({ queryKey: ['admin-user', id], queryFn: () => adminApi.getUser(id), enabled: Number.isFinite(id) });

  useEffect(() => {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      showToast('Пользователь не найден', 'error');
      navigate('/admin/users');
    }
  }, [error, navigate, showToast]);

  if (isLoading || !data) return <Skeleton className="h-80" />;

  return (
    <div className="space-y-6">
      <PageTitle eyebrow={`USER_${data.id}`} title={data.email} description="Read-only карточка пользователя." action={<AdminUserActions user={data} />} />
      <Card className="max-w-3xl p-5">
        <dl className="grid gap-4 md:grid-cols-2">
          <Info label="ID" value={data.id} />
          <Info label="Display name" value={data.display_name || '—'} />
          <Info label="Role" value={<RoleBadge role={data.role} />} />
          <Info label="Status" value={<StatusBadge status={data.status} />} />
          <Info label="Date joined" value={formatDate(data.date_joined)} />
          <Info label="Updated" value={formatDate(data.updated_at)} />
        </dl>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-surface-inset p-3">
      <dt className="ht-eyebrow mb-2">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
