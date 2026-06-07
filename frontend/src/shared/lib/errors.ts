import axios from 'axios';
import type { ApiErrorShape } from '../../api/types';

function push(target: Record<string, string[]>, key: string, value: unknown) {
  const values = Array.isArray(value) ? value : [value];
  target[key] = values.map((item) => String(item));
}

function walk(value: unknown, prefix: string, result: ApiErrorShape) {
  if (!value || typeof value !== 'object') return;
  Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (key === 'detail' && typeof nested === 'string') {
      result.detail = nested;
      return;
    }
    if (key === 'code' && typeof nested === 'string') {
      result.code = nested;
      return;
    }
    if (key === 'non_field_errors') {
      result.nonFieldErrors.push(...(Array.isArray(nested) ? nested : [nested]).map(String));
      return;
    }
    if (Array.isArray(nested) || typeof nested !== 'object' || nested === null) {
      push(result.fieldErrors, path, nested);
      return;
    }
    walk(nested, path, result);
  });
}

export function normalizeApiError(error: unknown): ApiErrorShape {
  const result: ApiErrorShape = { fieldErrors: {}, nonFieldErrors: [] };
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      result.detail = 'Не удалось связаться с сервером, попробуйте ещё раз.';
      return result;
    }
    walk(error.response.data, '', result);
    if (!result.detail && !result.nonFieldErrors.length && !Object.keys(result.fieldErrors).length) {
      result.detail = `Ошибка запроса: ${error.response.status}`;
    }
    return result;
  }
  result.detail = error instanceof Error ? error.message : 'Неизвестная ошибка.';
  return result;
}

export function firstError(error: unknown, fallback = 'Что-то пошло не так.') {
  const normalized = normalizeApiError(error);
  return (
    normalized.detail ||
    normalized.nonFieldErrors[0] ||
    Object.values(normalized.fieldErrors)[0]?.[0] ||
    fallback
  );
}

export function isAccountBlockedError(error: unknown) {
  const normalized = normalizeApiError(error);
  return normalized.code === 'account_blocked';
}
