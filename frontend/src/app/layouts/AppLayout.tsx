import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ListChecks, LogOut, PanelLeftClose, PanelLeftOpen, Shield, UserRound } from 'lucide-react';

import { useAuth } from '../../features/auth/AuthProvider';
import { Button, InlineAlert } from '../../shared/ui/primitives';

function navClass({ isActive }: { isActive: boolean }, collapsed = false) {
  return clsx(
    'focus-ring soft-motion flex min-h-10 items-center gap-2 rounded-md text-sm font-medium',
    collapsed ? 'justify-center px-2' : 'px-3',
    isActive
      ? 'bg-sage-50 text-sage-700 shadow-[inset_0_0_0_1px_var(--sage-200)]'
      : 'text-ink-2 hover:bg-surface-inset hover:text-ink',
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 grid-cols-2 gap-1 rounded-md border border-sage-700 bg-sage-600 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
        <span className="rounded-[2px] bg-[#fbfffd]/85" />
        <span className="rounded-[2px] bg-[#fbfffd]/45" />
        <span className="rounded-[2px] bg-[#fbfffd]/35" />
        <span className="rounded-[2px] bg-[#fbfffd]/72" />
      </span>
      <div className={clsx('min-w-0', compact && 'hidden')}>
        <div className="truncate text-base font-semibold">HabitTrack</div>
        <div className="ht-eyebrow">Рабочий журнал</div>
      </div>
    </Link>
  );
}

export function AppLayout() {
  const { user, logout, blockedBanner, dismissBlockedBanner } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('habittrack.sidebar-collapsed') === 'true';
  });
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

  useEffect(() => {
    window.localStorage.setItem('habittrack.sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className={clsx(
      'min-h-screen bg-surface-page text-ink lg:grid',
      sidebarCollapsed ? 'lg:grid-cols-[84px_minmax(0,1fr)]' : 'lg:grid-cols-[248px_minmax(0,1fr)]',
    )}>
      <aside className={clsx(
        'hidden border-r border-line bg-surface-card/80 py-5 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col',
        sidebarCollapsed ? 'px-2' : 'px-4',
      )}>
        <div className={clsx('flex min-h-9 items-center', sidebarCollapsed ? 'flex-col gap-3' : 'justify-between gap-2')}>
          <Brand compact={sidebarCollapsed} />
          <button
            type="button"
            className="focus-ring soft-motion inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-transparent text-ink-2 hover:border-line hover:bg-surface-inset hover:text-ink"
            aria-label={sidebarCollapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
            title={sidebarCollapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <nav className="mt-7 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={(args) => navClass(args, sidebarCollapsed)}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className={sidebarCollapsed ? 'sr-only' : undefined}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3">
          <Link
            to="/profile"
            className={clsx(
              'focus-ring soft-motion flex min-w-0 items-center rounded-md border border-line bg-surface-inset py-3 hover:border-sage-200 hover:bg-surface-card2',
              sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
            )}
            title={sidebarCollapsed ? (user?.display_name || user?.email || 'Профиль') : undefined}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface-card text-ink-2">
              {user?.role === 'admin' ? <Shield className="h-4 w-4 text-sage-700" /> : <UserRound className="h-4 w-4" />}
            </span>
            <span className={clsx('min-w-0', sidebarCollapsed && 'sr-only')}>
              <span className="block truncate text-sm font-medium text-ink">{user?.display_name || user?.email}</span>
              <span className="ht-eyebrow">{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            className={clsx('w-full', sidebarCollapsed ? 'px-2' : 'justify-start')}
            onClick={handleLogout}
            aria-label="Выйти"
            title={sidebarCollapsed ? 'Выйти' : undefined}
          >
            <LogOut className="h-4 w-4" />
            <span className={sidebarCollapsed ? 'sr-only' : undefined}>Выйти</span>
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-line bg-surface-page lg:hidden">
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
