import { apiClient } from './client';
import type { AdminUser } from './types';

export async function listUsers() {
  const response = await apiClient.get<AdminUser[]>('/api/admin/users/');
  return response.data;
}

export async function getUser(id: number) {
  const response = await apiClient.get<AdminUser>(`/api/admin/users/${id}/`);
  return response.data;
}

export async function blockUser(id: number) {
  const response = await apiClient.post<AdminUser>(`/api/admin/users/${id}/block/`);
  return response.data;
}

export async function unblockUser(id: number) {
  const response = await apiClient.post<AdminUser>(`/api/admin/users/${id}/unblock/`);
  return response.data;
}
