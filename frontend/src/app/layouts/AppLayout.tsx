import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Shield, UserRound } from 'lucide-react';

import { useAuth } from '../../features/auth/AuthProvider';
import { Button, InlineAlert } from '../../shared/ui/primitives';

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-3 py-2 text-sm font-medium soft-motion',
    isActive ? 'bg-sage-50 text-sage-700 shadow-[inset_0_0_0_1px_var(--sage-200)]' : 'text-ink-2 hover:bg-surface-inset hover:text-ink',
  ].join(' ');
}

export function AppLayout() {
  const { user, logout, blockedBanner, dismissBlockedBanner } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-page text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-surface-page/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-7">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 grid-cols-2 gap-1 rounded-md border border-sage-700 bg-sage-600 p-1">
                <span className="rounded-[2px] bg-[#fbfbf7]/80" />
                <span className="rounded-[2px] bg-[#fbfbf7]/45" />
                <span className="rounded-[2px] bg-[#fbfbf7]/35" />
                <span className="rounded-[2px] bg-[#fbfbf7]/70" />
              </span>
              <div>
                <div className="text-base font-semibold">HabitTrack</div>
                <div className="ht-eyebrow">Soft Ledger</div>
              </div>
            </Link>
          </div>
          <nav className="flex flex-wrap gap-1">
            <NavLink to="/" end className={navClass}>Дашборд</NavLink>
            <NavLink to="/habits" className={navClass}>Привычки</NavLink>
            <NavLink to="/profile" className={navClass}>Профиль</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin/users" className={navClass}>Админ</NavLink>}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-md border border-line bg-surface-card px-3 py-2 text-sm text-ink-2 md:inline-flex">
              {user?.role === 'admin' ? <Shield className="h-4 w-4 text-sage-700" /> : <UserRound className="h-4 w-4" />}
              {user?.display_name || user?.email}
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>
      {blockedBanner && (
        <div className="border-b border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <span>Ваш аккаунт заблокирован администратором.</span>
            <button type="button" className="font-medium underline" onClick={dismissBlockedBanner}>Скрыть</button>
          </div>
        </div>
      )}
      <main className="mx-auto max-w-7xl px-4 py-7 md:px-7">
        <Outlet />
      </main>
    </div>
  );
}

export function RouteError({ message = 'Не удалось загрузить данные.' }: { message?: string }) {
  return <InlineAlert>{message}</InlineAlert>;
}
