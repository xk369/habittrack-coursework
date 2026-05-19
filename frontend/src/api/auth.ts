import { apiClient } from './client';
import type { LoginResponse, UserProfile } from './types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  display_name: string;
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<LoginResponse>('/api/auth/login/', payload, { skipAuthRefresh: true });
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<UserProfile>('/api/auth/register/', payload, { skipAuthRefresh: true });
  return response.data;
}

export async function getProfile() {
  const response = await apiClient.get<UserProfile>('/api/account/profile/');
  return response.data;
}

export async function patchProfile(payload: Pick<UserProfile, 'display_name'>) {
  const response = await apiClient.patch<UserProfile>('/api/account/profile/', payload);
  return response.data;
}
