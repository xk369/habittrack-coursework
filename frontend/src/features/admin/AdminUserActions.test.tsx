import { screen } from '@testing-library/react';

import type { AdminUser } from '../../api/types';
import { renderWithProviders } from '../../test/render';
import { AdminUserActions } from './AdminUserActions';

const user: AdminUser = {
  id: 7,
  email: 'admin@example.com',
  display_name: 'Admin',
  role: 'admin',
  status: 'active',
  date_joined: '2026-05-20T00:00:00Z',
  updated_at: '2026-05-20T00:00:00Z',
};

describe('AdminUserActions', () => {
  beforeEach(() => {
    localStorage.setItem('habittrack.current_user', JSON.stringify(user));
  });

  it('disables block action for self row', () => {
    renderWithProviders(<AdminUserActions user={user} />);

    expect(screen.getByRole('button', { name: 'Self-block запрещён' })).toBeDisabled();
  });
});
