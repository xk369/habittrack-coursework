# HabitTrack

HabitTrack — персональный веб-трекер формирования привычек для индивидуальных
пользователей. Приложение позволяет регистрироваться и входить в систему,
создавать привычки, настраивать расписание, отмечать выполнение по датам,
смотреть историю и статистику прогресса.

В продукт также входит административный контур: администратор просматривает
пользователей, видит состояние учетных записей, блокирует и разблокирует
доступ к пользовательским функциям.

## Стек

- Backend: Django 5.2 LTS + Django REST Framework.
- Backend runtime: gunicorn в Docker-окружении.
- API auth: JWT через SimpleJWT.
- API docs: drf-spectacular, Swagger UI, ReDoc.
- Database: PostgreSQL.
- Frontend: React + TypeScript + Vite.
- UI: Tailwind CSS + Soft Ledger design tokens.
- Frontend data layer: React Router, TanStack Query, axios.
- Frontend runtime: статическая Vite-сборка через nginx.
- Packaging: Dockerfile для backend/frontend и root `docker-compose.yml`.

## Реализованные возможности

- регистрация, вход, refresh token и профиль пользователя;
- быстрый demo-вход для пользователя и администратора на странице login;
- роли `user/admin`, статусы `active/blocked`;
- блокировка закрывает login, protected API и refresh;
- CRUD привычек с `daily` и `weekly_days` расписанием;
- архивирование, возврат из архива и удаление привычек;
- отметки выполнения, снятие ошибочных отметок и история;
- статистика привычки и dashboard по активным привычкам;
- admin API и admin UI для просмотра, блокировки и разблокировки пользователей;
- Swagger/OpenAPI документация;
- demo data для локальной защиты и ручной проверки.

## Структура

```text
.
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── analytics/
│   │   └── habits/
│   ├── habittrack/
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── docs/
├── infra/
├── docker-compose.yml
└── .env.example
```

`backend/apps/accounts/` содержит учетные записи, роли, статусы, JWT,
профиль и admin API. `backend/apps/habits/` содержит привычки, расписания,
отметки выполнения, историю и команду `seed_demo`. `backend/apps/analytics/`
считает статистику и dashboard на лету без сохранения агрегатов.

Frontend разделен на `src/api/`, `src/app/`, `src/features/`, `src/pages/`,
`src/shared/` и `src/styles/`.

## Env

Подготовить локальный `.env` можно на основе `.env.example`:

```bash
cp .env.example .env
```

Для локального frontend/backend соединения используются:

```text
VITE_API_BASE_URL=http://localhost:8000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Визуальная тема использует современные CSS-цвета `oklch()`, поэтому для
корректного отображения нужен актуальный браузер.

## Локальный запуск без Docker

Backend:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
python backend/manage.py migrate
python backend/manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Открыть UI: `http://localhost:5173`.

Backend API по умолчанию ожидается на `http://localhost:8000`.

## Docker Compose

Локальный full-stack запуск:

```bash
docker compose up --build
```

Сервисы:

- `postgres` — PostgreSQL с named volume;
- `backend` — Django/DRF API на `http://localhost:8000`;
- `frontend` — nginx со статической Vite-сборкой на `http://localhost:5173`.

Backend container перед запуском применяет миграции и стартует через gunicorn.
Frontend container собирает Vite-приложение на build stage и отдает готовые
assets через nginx. Demo data не запускается автоматически, чтобы не менять
состояние БД без явной команды.

Запуск demo seed в compose:

```bash
docker compose exec backend python manage.py seed_demo
```

## VPS deploy

Последняя VPS-конфигурация проекта использует сервер:

- frontend: `http://77.110.122.36:5173`;
- backend health-check: `http://77.110.122.36:8000/api/health/`;
- Swagger UI: `http://77.110.122.36:8000/api/docs/`;
- ReDoc: `http://77.110.122.36:8000/api/redoc/`.

На сервере используется каталог `/opt/habittrack` и запуск через Docker
Compose:

```bash
git clone https://github.com/xk369/habittrack-coursework.git /opt/habittrack
cd /opt/habittrack
docker compose up -d --build
docker compose exec backend python manage.py seed_demo
```

Backend-переменные:

```text
DJANGO_SECRET_KEY=<production-like-secret>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=77.110.122.36,localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://77.110.122.36:5173
CSRF_TRUSTED_ORIGINS=http://77.110.122.36:5173
POSTGRES_DB=habittrack
POSTGRES_USER=habittrack
POSTGRES_PASSWORD=<server-side-password>
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

Frontend-переменные:

```text
VITE_API_BASE_URL=http://77.110.122.36:8000
```

Если сервер был остановлен или пересоздан, повторный deploy выполняется теми же
командами. После deploy нужно проверить `GET /api/health/`, вход demo/admin
пользователей, dashboard, список привычек, admin users и blocked-account login.

## Demo data

Команда:

```bash
python backend/manage.py seed_demo
```

Demo accounts:

| Email | Пароль | Роль | Статус |
| --- | --- | --- | --- |
| `admin@habittrack.local` | `AdminDemo!2026` | `admin` | `active` |
| `demo@habittrack.local` | `DemoUser!2026` | `user` | `active` |
| `blocked@habittrack.local` | `BlockedDemo!2026` | `user` | `blocked` |

Команда создает для demo user 6 привычек: 4 активные и 2 архивные. Среди них
есть ежедневные и weekly-days привычки, разные серии, разный compliance,
история completion-записей, привычка с отметкой за сегодня и привычка без
отметки за сегодня.

Smoke-сценарий:

1. Войти как `demo@habittrack.local`.
2. Открыть dashboard.
3. Открыть список привычек.
4. Перейти в detail привычки.
5. Проверить history/statistics и heatmap.
6. Попробовать `Отметить сегодня`; для гарантированного positive-сценария
   выбрать активную ежедневную привычку без сегодняшней отметки, например
   `Вода утром`. Для уже отмеченной даты будет duplicate validation.
7. Войти как `admin@habittrack.local`.
8. Открыть admin users.
9. Открыть пользователя и выполнить block/unblock.
10. Проверить, что `blocked@habittrack.local` не получает пользовательский
    доступ.

## API

- `GET /api/health/` — health-check.
- `POST /api/auth/register/`, `POST /api/auth/login/`,
  `POST /api/auth/refresh/`.
- `GET/PATCH /api/account/profile/`.
- `GET/POST /api/habits/`.
- `GET/PATCH/DELETE /api/habits/{habit_id}/`.
- `POST /api/habits/{habit_id}/archive/`.
- `POST /api/habits/{habit_id}/unarchive/`.
- `GET/POST /api/habits/{habit_id}/completions/`.
- `DELETE /api/habits/{habit_id}/completions/{completion_id}/`.
- `GET /api/habits/{habit_id}/statistics/`.
- `GET /api/dashboard/`.
- `GET /api/admin/users/`.
- `GET /api/admin/users/{user_id}/`.
- `POST /api/admin/users/{user_id}/block/`.
- `POST /api/admin/users/{user_id}/unblock/`.

## API-документация

- Swagger UI: `http://localhost:8000/api/docs/`.
- ReDoc: `http://localhost:8000/api/redoc/`.
- OpenAPI schema: `http://localhost:8000/api/schema/`.

Ручная проверка через Swagger:

1. Выполнить `POST /api/auth/login/`.
2. Скопировать `access` token.
3. Нажать `Authorize`.
4. Вставить Bearer token.
5. Проверять protected endpoint'ы.

## Проверки

Backend:

```bash
.venv/bin/python backend/manage.py check
.venv/bin/python backend/manage.py makemigrations --check --dry-run
.venv/bin/python backend/manage.py test apps.accounts apps.habits apps.analytics --noinput
.venv/bin/python backend/manage.py spectacular --file /tmp/habittrack-schema.yml --validate
```

Frontend:

```bash
cd frontend
npm run build
npm run test -- --run
```

Docker/compose:

```bash
docker compose config
docker compose build
```

Подробный план реализации находится в `docs/implementation-plan.md`.
