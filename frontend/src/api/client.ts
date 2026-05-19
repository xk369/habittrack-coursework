import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { firstError, isAccountBlockedError } from '../shared/lib/errors';
import {
  getAccessToken,
  getRefreshToken,
  notifyBlocked,
  notifyLogout,
  setTokens,
} from './tokenStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    const refresh = getRefreshToken();
    if (!refresh) {
      refreshPromise = Promise.reject(new Error('Refresh token is missing.'));
    } else {
      refreshPromise = apiClient
        .post<{ access: string; refresh?: string }>('/api/auth/refresh/', { refresh }, { skipAuthRefresh: true })
        .then((response) => {
          setTokens(response.data.access, response.data.refresh);
          return response.data.access;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
  }
  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
      skipAuthRefresh?: boolean;
    }) | undefined;

    if (isAccountBlockedError(error)) {
      notifyBlocked();
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.skipAuthRefresh &&
      !original.url?.includes('/api/auth/login/') &&
      !original.url?.includes('/api/auth/register/')
    ) {
      original._retry = true;
      try {
        const access = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${access}`;
        return apiClient(original);
      } catch (refreshError) {
        if (isAccountBlockedError(refreshError)) {
          notifyBlocked();
        } else {
          notifyLogout();
        }
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      error.message = firstError(error);
    }
    return Promise.reject(error);
  },
);

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}
