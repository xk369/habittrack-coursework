import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ban, Unlock } from 'lucide-react';

import * as adminApi from '../../api/admin';
import type { AdminUser } from '../../api/types';
import { useAuth } from '../auth/AuthProvider';
import { firstError } from '../../shared/lib/errors';
import { Button } from '../../shared/ui/primitives';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import { useToast } from '../../shared/ui/Toast';

export function AdminUserActions({ user }: { user: AdminUser }) {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [confirmBlock, setConfirmBlock] = useState(false);
  const isSelf = currentUser?.id === user.id;

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
      queryClient.invalidateQueries({ queryKey: ['admin-user', user.id] }),
    ]);
  };

  const block = useMutation({
    mutationFn: () => adminApi.blockUser(user.id),
    onSuccess: async () => {
      setConfirmBlock(false);
      await invalidate();
      showToast('Пользователь заблокирован', 'success');
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });

  const unblock = useMutation({
    mutationFn: () => adminApi.unblockUser(user.id),
    onSuccess: async () => {
      await invalidate();
      showToast('Пользователь разблокирован', 'success');
    },
    onError: (error) => showToast(firstError(error), 'error'),
  });

  return (
    <div className="flex flex-wrap gap-2">
      {user.status === 'blocked' ? (
        <Button variant="secondary" loading={unblock.isPending} onClick={() => unblock.mutate()}>
          <Unlock className="h-4 w-4" />
          Разблокировать
        </Button>
      ) : (
        <Button variant="danger" disabled={isSelf} loading={block.isPending} onClick={() => setConfirmBlock(true)}>
          <Ban className="h-4 w-4" />
          {isSelf ? 'Себя блокировать нельзя' : 'Заблокировать'}
        </Button>
      )}
      <ConfirmDialog
        open={confirmBlock}
        title="Заблокировать пользователя?"
        description={`Пользователь ${user.email} потеряет доступ к защищенным разделам приложения.`}
        confirmLabel="Заблокировать"
        onCancel={() => setConfirmBlock(false)}
        onConfirm={() => block.mutate()}
      />
    </div>
  );
}
