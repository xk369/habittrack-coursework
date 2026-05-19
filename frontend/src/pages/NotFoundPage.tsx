import { Link } from 'react-router-dom';

import { Button, Card } from '../shared/ui/primitives';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page p-4">
      <Card className="max-w-md p-8 text-center">
        <div className="ht-eyebrow mb-3">404</div>
        <h1 className="text-2xl font-medium">Страница не найдена</h1>
        <p className="mt-2 text-sm text-ink-2">Маршрут отсутствует в HabitTrack MVP.</p>
        <Link className="mt-5 inline-flex" to="/">
          <Button variant="accent">На дашборд</Button>
        </Link>
      </Card>
    </div>
  );
}
