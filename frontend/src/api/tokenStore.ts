import type { LoginResponse, UserProfile } from './types';

const ACCESS_KEY = 'habittrack.access_token';
const REFRESH_KEY = 'habittrack.refresh_token';
const USER_KEY = 'habittrack.current_user';

export interface AuthEvents {
  onBlocked?: () => void;
  onLogout?: () => void;
  onTokens?: (access: string, refresh?: string) => void;
}

let events: AuthEvents = {};

export function setAuthEvents(nextEvents: AuthEvents) {
  events = nextEvents;
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) {
    localStorage.setItem(REFRESH_KEY, refresh);
  }
  events.onTokens?.(access, refresh);
}

export function setSession(session: LoginResponse) {
  setTokens(session.access, session.refresh);
  setStoredUser(session.user);
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function notifyBlocked() {
  clearSession();
  events.onBlocked?.();
}

export function notifyLogout() {
  clearSession();
  events.onLogout?.();
}
