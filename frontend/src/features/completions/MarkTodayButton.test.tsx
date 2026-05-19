import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import * as completionsApi from '../../api/completions';
import { renderWithProviders } from '../../test/render';
import { MarkTodayButton } from './MarkTodayButton';

vi.mock('../../api/completions', () => ({
  createCompletion: vi.fn().mockResolvedValue({ id: 1, completion_date: '2026-05-20' }),
}));

describe('MarkTodayButton', () => {
  it('calls completion mutation for today action', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarkTodayButton habitId={42} />);

    await user.click(screen.getByRole('button', { name: /Отметить сегодня/i }));

    await waitFor(() => expect(completionsApi.createCompletion).toHaveBeenCalledWith(42, expect.stringMatching(/\d{4}-\d{2}-\d{2}/)));
  });
});
