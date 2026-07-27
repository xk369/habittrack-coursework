import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, ListChecks, LogOut, Shield, UserRound } from 'lucide-react';

import { useAuth } from '../../features/auth/AuthProvider';
import { Button, InlineAlert } from '../../shared/ui/primitives';

function navClass({ isActive }: { isActive: boolean }) {
  return clsx(
    'focus-ring soft-motion flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
    isActive
      ? 'bg-sage-50 text-sage-700 shadow-[inset_0_0_0_1px_var(--sage-200)]'
      : 'text-ink-2 hover:bg-surface-inset hover:text-ink',
  );
}

function Brand() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 grid-cols-2 gap-1 rounded-md border border-sage-700 bg-sage-600 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
        <span className="rounded-[2px] bg-[#fbfffd]/85" />
        <span className="rounded-[2px] bg-[#fbfffd]/45" />
        <span className="rounded-[2px] bg-[#fbfffd]/35" />
        <span className="rounded-[2px] bg-[#fbfffd]/72" />
      </span>
      <div className="min-w-0">
        <div className="truncate text-base font-semibold">HabitTrack</div>
        <div className="ht-eyebrow">Рабочий журнал</div>
      </div>
    </Link>
  );
}

export function AppLayout() {
  const { user, logout, blockedBanner, dismissBlockedBanner } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    { to: '/', end: true, label: 'Дашборд', icon: LayoutDashboard },
    { to: '/habits', label: 'Привычки', icon: ListChecks },
    { to: '/profile', label: 'Профиль', icon: UserRound },
    ...(user?.role === 'admin' ? [{ to: '/admin/users', label: 'Админ', icon: Shield }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-page text-ink lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden border-r border-line bg-surface-card/80 px-4 py-5 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <Brand />
        <nav className="mt-7 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3">
          <Link
            to="/profile"
            className="focus-ring soft-motion flex min-w-0 items-center gap-3 rounded-md border border-line bg-surface-inset px-3 py-3 hover:border-sage-200 hover:bg-surface-card2"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface-card text-ink-2">
              {user?.role === 'admin' ? <Shield className="h-4 w-4 text-sage-700" /> : <UserRound className="h-4 w-4" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{user?.display_name || user?.email}</span>
              <span className="ht-eyebrow">{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
            </span>
          </Link>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-line bg-surface-page/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Brand />
            <Button variant="ghost" onClick={handleLogout} aria-label="Выйти">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </header>
        {blockedBanner && (
          <div className="border-b border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <span>Ваш аккаунт заблокирован администратором.</span>
              <button type="button" className="font-medium underline" onClick={dismissBlockedBanner}>Скрыть</button>
            </div>
          </div>
        )}
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-7 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function RouteError({ message = 'Не удалось загрузить данные.' }: { message?: string }) {
  return <InlineAlert>{message}</InlineAlert>;
}
