# План тестирования

## Назначение

Документ фиксирует фактическую стратегию проверки HabitTrack перед заморозкой
кода: backend API, frontend MVP, OpenAPI schema, demo data и локальную
упаковку.

## Уровни проверок

| Уровень | Что проверяется | Инструмент / команда | Статус |
| --- | --- | --- | --- |
| Django system check | Конфигурация backend, apps, settings. | `.venv/bin/python backend/manage.py check` | Final quality pass: 0 issues. |
| Миграции | Нет незакрепленных изменений моделей. | `.venv/bin/python backend/manage.py makemigrations --check --dry-run` | Final quality pass: No changes detected. |
| Backend API tests | Auth, роли, habits, completions, analytics, admin, Swagger docs, CORS, demo seed. | `.venv/bin/python backend/manage.py test apps.accounts apps.habits apps.analytics --noinput` | Final quality pass: 134 tests OK. |
| OpenAPI validation | Генерация и валидность schema. | `.venv/bin/python backend/manage.py spectacular --file /tmp/habittrack-schema.yml --validate` | Final quality pass: OK. |
| Seed demo smoke | Demo accounts, привычки, completions, идемпотентность. | `.venv/bin/python backend/manage.py seed_demo` + API/DB tests | Final quality pass: command OK, 194 completions при контрольном запуске 2026-05-20. |
| Frontend build | TypeScript и production build. | `cd frontend && npm run build` | Final quality pass: OK. |
| Frontend smoke/regression | Guards, auth blocked flow, forms, mutations, admin action, axios refresh. | `cd frontend && npm run test -- --run` | Final quality pass: 9 tests OK. |
| Frontend dependency audit | Runtime dependencies и общий npm audit. | `cd frontend && npm audit --omit=dev --audit-level=moderate`; `npm audit --audit-level=moderate` | Runtime audit: 0 moderate+ vulnerabilities; общий audit: 5 moderate dev/build-chain vulnerabilities. Dependency bump вынесен в post-defense hygiene task без `npm audit fix` в freeze-блоке. |
| Docker Compose config | Валидность локальной упаковки. | `docker compose config` | Final quality pass: OK. |
| Docker Compose build | Сборка backend/frontend images. | `docker compose build` | Повторный запуск с доступом к Docker Hub: backend/frontend images собраны. |

## Ключевые backend-сценарии

- регистрация, login, refresh и profile;
- запрет передачи `role/status` через публичные user endpoint;
- отказ blocked user в login, protected API и refresh;
- CRUD привычек, расписания `daily/weekly_days`, ownership;
- archive/unarchive/delete;
- completion create/list/delete, запрет дубликатов и неверных дат;
- статистика и dashboard по активным привычкам;
- admin users list/detail/block/unblock;
- self-block запрет;
- OpenAPI docs endpoints;
- CORS для локального frontend origin;
- seed_demo создает demo-состояние и повторно запускается без размножения
  demo-данных.

## Ключевые frontend-сценарии

- anonymous на protected route перенаправляется на login;
- regular user на admin route получает redirect и единичное сообщение об
  отказе;
- blocked account приводит к logout/banner flow;
- HabitForm валидирует weekly-days и показывает backend errors inline;
- mark today вызывает completion mutation;
- admin block action требует подтверждения или отключена для self-row;
- axios refresh использует single-flight при параллельных 401.

## Ручной smoke после demo seed

1. Войти под `demo@habittrack.local`.
2. Проверить dashboard, список привычек и detail.
3. Отметить привычку за сегодня и проверить duplicate-сценарий.
4. Открыть history/statistics.
5. Войти под `admin@habittrack.local`.
6. Открыть admin users и выполнить block/unblock.
7. Проверить отказ для `blocked@habittrack.local`.

## Статус

План отражает фактический уровень проверок перед финальным техническим ревью.
Результаты запусков фиксируются в `docs/evidence-register.md`.
