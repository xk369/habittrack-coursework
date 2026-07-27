import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import * as adminApi from '../api/admin';
import { AdminUserActions } from '../features/admin/AdminUserActions';
import { formatDate } from '../shared/lib/format';
import { Card, EmptyState, PageTitle, RoleBadge, Skeleton, StatusBadge } from '../shared/ui/primitives';

export function AdminUsersPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: adminApi.listUsers });

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="Админ-контур" title="Пользователи" description="Просмотр статуса и управление блокировкой учетных записей." />
      {isLoading ? <Skeleton className="h-80" /> : !data.length ? (
        <EmptyState title="Пользователей нет" />
      ) : (
        <>
          <Card className="hidden overflow-hidden lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface-inset text-xs uppercase tracking-wide text-ink-3">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Роль</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Создан</th>
                  <th className="px-4 py-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.id} className="border-b border-line-soft last:border-0">
                    <td className="px-4 py-3 font-mono">{user.id}</td>
                    <td className="px-4 py-3">
                      <Link className="font-medium text-ink hover:text-sage-700" to={`/admin/users/${user.id}`}>{user.email}</Link>
                      <div className="text-xs text-ink-3">{user.display_name || 'Без имени'}</div>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs">{formatDate(user.date_joined)}</td>
                    <td className="px-4 py-3"><AdminUserActions user={user} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <div className="grid gap-3 lg:hidden">
            {data.map((user) => (
              <Card key={user.id} className="p-4">
                <Link className="font-medium" to={`/admin/users/${user.id}`}>{user.email}</Link>
                <div className="mt-2 flex gap-2"><RoleBadge role={user.role} /><StatusBadge status={user.status} /></div>
                <div className="mt-3"><AdminUserActions user={user} /></div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
