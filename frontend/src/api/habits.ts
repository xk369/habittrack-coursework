import { apiClient } from './client';
import type { Habit, HabitPayload, HabitState } from './types';

export type HabitListState = HabitState | 'all';

export async function listHabits(state: HabitListState = 'active') {
  const response = await apiClient.get<Habit[]>('/api/habits/', { params: { state } });
  return response.data;
}

export async function getHabit(id: number) {
  const response = await apiClient.get<Habit>(`/api/habits/${id}/`);
  return response.data;
}

export async function createHabit(payload: HabitPayload) {
  const response = await apiClient.post<Habit>('/api/habits/', payload);
  return response.data;
}

export async function updateHabit(id: number, payload: Partial<HabitPayload>) {
  const response = await apiClient.patch<Habit>(`/api/habits/${id}/`, payload);
  return response.data;
}

export async function archiveHabit(id: number) {
  const response = await apiClient.post<Habit>(`/api/habits/${id}/archive/`);
  return response.data;
}

export async function unarchiveHabit(id: number) {
  const response = await apiClient.post<Habit>(`/api/habits/${id}/unarchive/`);
  return response.data;
}

export async function deleteHabit(id: number) {
  await apiClient.delete(`/api/habits/${id}/`);
}
