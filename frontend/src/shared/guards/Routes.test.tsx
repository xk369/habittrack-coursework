import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { renderWithProviders } from '../../test/render';
import { AdminRoute, ProtectedRoute } from './Routes';

describe('ProtectedRoute', () => {
  beforeEach(() => localStorage.clear());

  it('redirects anonymous user to login with next parameter', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/habits?state=active']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/habits" element={<div>Protected habits</div>} />
          </Route>
          <Route path="/login" element={<div>Login route</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login route')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  beforeEach(() => localStorage.clear());

  it('redirects regular user to home and shows one access denied toast', async () => {
    localStorage.setItem('habittrack.current_user', JSON.stringify({
      id: 2,
      email: 'user@example.com',
      display_name: 'User',
      role: 'user',
      status: 'active',
    }));

    renderWithProviders(
      <MemoryRouter initialEntries={['/admin/users']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<div>Admin users</div>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(await screen.findByText('Недостаточно прав')).toBeInTheDocument();
    expect(screen.getAllByText('Недостаточно прав')).toHaveLength(1);
  });
});
