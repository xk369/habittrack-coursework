import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { renderWithProviders } from '../../test/render';
import { HabitForm } from './HabitForm';

describe('HabitForm', () => {
  it('shows validation error for weekly_days without weekdays', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HabitForm submitLabel="Создать" onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/Название/i), 'Тренировка');
    await user.click(screen.getByText('Выбранные дни'));
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(await screen.findByText('Выберите хотя бы один день недели')).toBeInTheDocument();
  });

  it('shows backend schedule.weekdays error near weekday picker', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: { schedule: { weekdays: ['Выберите корректный день недели'] } },
      },
    });

    renderWithProviders(<HabitForm submitLabel="Создать" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Название/i), 'Тренировка');
    await user.click(screen.getByText('Выбранные дни'));
    await user.click(screen.getByRole('button', { name: 'пн' }));
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(await screen.findByText('Выберите корректный день недели')).toBeInTheDocument();
  });
});
