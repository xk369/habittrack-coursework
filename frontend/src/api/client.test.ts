import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { apiClient } from './client';
import { setAuthEvents, setTokens } from './tokenStore';

function response<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config,
  };
}

function rejectWithStatus(config: InternalAxiosRequestConfig, status: number, data: unknown) {
  return Promise.reject({
    isAxiosError: true,
    config,
    response: response(config, data, status),
  });
}

describe('apiClient auth interceptor', () => {
  const originalAdapter = apiClient.defaults.adapter;

  beforeEach(() => {
    localStorage.clear();
    setAuthEvents({});
    apiClient.defaults.adapter = originalAdapter;
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
    setAuthEvents({});
  });

  it('uses one refresh request for parallel 401 responses', async () => {
    setTokens('old-access', 'refresh-token');
    let refreshCalls = 0;

    apiClient.defaults.adapter = vi.fn(async (config) => {
      if (config.url === '/api/auth/refresh/') {
        refreshCalls += 1;
        await new Promise((resolve) => window.setTimeout(resolve, 5));
        return response(config, { access: 'new-access' });
      }

      if (config.headers?.Authorization === 'Bearer old-access') {
        return rejectWithStatus(config, 401, { detail: 'Token is invalid' });
      }

      return response(config, { authorization: config.headers?.Authorization });
    });

    const [first, second] = await Promise.all([
      apiClient.get('/api/protected/'),
      apiClient.get('/api/protected/'),
    ]);

    expect(refreshCalls).toBe(1);
    expect(first.data.authorization).toBe('Bearer new-access');
    expect(second.data.authorization).toBe('Bearer new-access');
  });

  it('notifies blocked flow and clears tokens on account_blocked response', async () => {
    const onBlocked = vi.fn();
    setAuthEvents({ onBlocked });
    setTokens('access', 'refresh');
    apiClient.defaults.adapter = vi.fn((config) => (
      rejectWithStatus(config, 401, { detail: 'Account is blocked', code: 'account_blocked' })
    ));

    await expect(apiClient.get('/api/protected/')).rejects.toBeTruthy();

    expect(onBlocked).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('habittrack.access_token')).toBeNull();
    expect(localStorage.getItem('habittrack.refresh_token')).toBeNull();
  });
});
