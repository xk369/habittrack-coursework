import { apiClient } from './client';
import type { Dashboard, HabitStatistics } from './types';

export async function getDashboard() {
  const response = await apiClient.get<Dashboard>('/api/dashboard/');
  return response.data;
}

export async function getHabitStatistics(habitId: number) {
  const response = await apiClient.get<HabitStatistics>(`/api/habits/${habitId}/statistics/`);
  return response.data;
}
