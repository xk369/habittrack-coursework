import { apiClient } from './client';
import type { Completion } from './types';

export async function listCompletions(habitId: number) {
  const response = await apiClient.get<Completion[]>(`/api/habits/${habitId}/completions/`);
  return response.data;
}

export async function createCompletion(habitId: number, completionDate: string) {
  const response = await apiClient.post<Completion>(`/api/habits/${habitId}/completions/`, {
    completion_date: completionDate,
  });
  return response.data;
}

export async function deleteCompletion(habitId: number, completionId: number) {
  await apiClient.delete(`/api/habits/${habitId}/completions/${completionId}/`);
}
