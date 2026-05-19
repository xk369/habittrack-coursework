import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useAuth } from './AuthProvider';
import { renderWithProviders } from '../../test/render';

function Probe() {
  const { blockedBanner, forceLogout } = useAuth();
  return (
    <div>
      <button type="button" onClick={() => forceLogout(true)}>block</button>
      {blockedBanner && <span>Ваш аккаунт заблокирован администратором</span>}
    </div>
  );
}

describe('AuthProvider blocked flow', () => {
  beforeEach(() => localStorage.clear());

  it('sets blocked banner state on blocked force logout', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Probe />);

    await user.click(screen.getByRole('button', { name: 'block' }));

    expect(screen.getByText('Ваш аккаунт заблокирован администратором')).toBeInTheDocument();
  });
});
