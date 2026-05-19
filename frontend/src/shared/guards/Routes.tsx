import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../features/auth/AuthProvider';
import { useToast } from '../ui/Toast';

export function GuestRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return <Outlet />;
}

export function AdminRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <AccessDeniedRedirect />;
  }
  return <Outlet />;
}

function AccessDeniedRedirect() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast('Недостаточно прав', 'error');
  }, [showToast]);

  return <Navigate to="/" replace />;
}
