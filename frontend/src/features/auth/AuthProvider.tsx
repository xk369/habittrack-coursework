import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';

import * as authApi from '../../api/auth';
import {
  clearSession,
  getStoredUser,
  setAuthEvents,
  setSession,
  setStoredUser,
} from '../../api/tokenStore';
import type { LoginResponse, UserProfile } from '../../api/types';

interface AuthContextValue {
  user: UserProfile | null;
  blockedBanner: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  registerAndLogin: (email: string, password: string, displayName: string) => Promise<void>;
  updateUser: (user: UserProfile) => void;
  logout: () => void;
  forceLogout: (blocked?: boolean) => void;
  dismissBlockedBanner: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [blockedBanner, setBlockedBanner] = useState(false);

  const updateUser = useCallback((nextUser: UserProfile) => {
    setUser(nextUser);
    setStoredUser(nextUser);
  }, []);

  const forceLogout = useCallback((blocked = false) => {
    clearSession();
    setUser(null);
    setBlockedBanner(blocked);
  }, []);

  useLayoutEffect(() => {
    setAuthEvents({
      onBlocked: () => forceLogout(true),
      onLogout: () => forceLogout(false),
    });
  }, [forceLogout]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login({ email, password });
    setSession(session);
    setUser(session.user);
    setBlockedBanner(false);
    return session;
  }, []);

  const registerAndLogin = useCallback(async (email: string, password: string, displayName: string) => {
    await authApi.register({ email, password, display_name: displayName });
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => forceLogout(false), [forceLogout]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    blockedBanner,
    isAuthenticated: Boolean(user),
    login,
    registerAndLogin,
    updateUser,
    logout,
    forceLogout,
    dismissBlockedBanner: () => setBlockedBanner(false),
  }), [blockedBanner, forceLogout, login, logout, registerAndLogin, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
