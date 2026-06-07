# Журнал доказательной базы

## Назначение

Документ фиксирует артефакты, которые понадобятся для отчета, презентации и
защиты: коммиты, проверки, OpenAPI, demo data, локальный запуск и дизайн.

| Артефакт | Источник или ссылка | Для чего используется | Статус |
| --- | --- | --- | --- |
| Репозиторный каркас | `a542a69 chore: scaffold repository structure` | Доказательство старта реализации. | Зафиксировано. |
| Backend foundation | `0821548 feat(backend): initialize django api foundation` | Django/DRF, env, PostgreSQL, health-check. | Зафиксировано. |
| Auth/account | `05795f2 feat(auth): add account model and jwt authentication` | User model, роли, статусы, JWT, profile. | Зафиксировано. |
| Habits/schedules | `6cdaf71 feat(habits): add habit and schedule CRUD` | CRUD привычек и расписаний. | Зафиксировано. |
| Completions/history | `c18d506 feat(completions): add habit completion history workflow` | Отметки выполнения и история. | Зафиксировано. |
| Analytics/dashboard | `1ef3aa3 feat(analytics): add habit statistics and dashboard API` | Статистика и dashboard API. | Зафиксировано. |
| Admin contour | `b5dc0fd feat(admin): add user administration and blocking flow` | Admin users list/detail/block/unblock. | Зафиксировано. |
| OpenAPI docs | `66846b0 docs(api): add OpenAPI schema and Swagger UI` | Swagger UI, ReDoc, schema validation. | Зафиксировано. |
| Soft Ledger handoff | `be5ba62 docs(design): add Soft Ledger frontend handoff` | Дизайн-основание frontend. | Зафиксировано. |
| Frontend MVP | `bd249ee feat(frontend): implement user and admin MVP flows` | Пользовательский и admin UI. | Зафиксировано. |
| Backend checks | `.venv/bin/python backend/manage.py check`; `makemigrations --check --dry-run` | Конфигурация и отсутствие незакрепленных migrations. | Final quality pass: `0 issues`, `No changes detected`. |
| Backend tests | `.venv/bin/python backend/manage.py test apps.accounts apps.habits apps.analytics --noinput` | Проверка API, ролей, habits, completions, analytics, admin, docs, CORS, seed. | Final quality pass: `Ran 134 tests`, `OK`. |
| Frontend tests | `cd frontend && npm run test -- --run` | Smoke/regression frontend. | Final quality pass: `6 passed`, `9 tests passed`. |
| Frontend build | `cd frontend && npm run build` | Проверка TypeScript/Vite build. | Final quality pass: OK. |
| Frontend dependency audit | `cd frontend && npm audit --omit=dev --audit-level=moderate`; `npm audit --audit-level=moderate` | Проверка runtime и общего npm dependency риска. | Runtime audit: `0 vulnerabilities`; общий audit: `5 moderate` в dev/build-chain. Dependency bump вынесен в post-defense hygiene task, чтобы не менять lockfile перед coursework-ready фиксацией. |
| OpenAPI validation | `.venv/bin/python backend/manage.py spectacular --file /tmp/habittrack-schema.yml --validate` | Валидность API schema. | Final quality pass: OK, без warning output. |
| Demo data | `.venv/bin/python backend/manage.py seed_demo` | Локальная демонстрация на защите. | Final quality pass: созданы 3 demo accounts, 6 habits, 194 completions при контрольном запуске 2026-05-20. |
| Docker Compose config | `docker compose config` | Статическая проверка локальной упаковки backend/frontend/postgres. | Final quality pass: OK после явного `name: habittrack`. |
| Docker Compose build | `docker compose build` | Сборка backend/frontend images. | Повторный запуск с доступом к Docker Hub: `backend Built`, `frontend Built`. |
| Health-check | `GET /api/health/` через DRF test client с `HTTP_HOST=localhost` | Проверка живого health endpoint. | Final quality pass: `200 {'status': 'ok', 'service': 'habittrack-api'}`. |
| GitHub repository | https://github.com/xk369/habittrack-coursework | Публичный репозиторий с исходным кодом, Dockerfile, README и документацией. | Создан и запушен: ветка `main`, актуальный deploy commit `eed392b`. |
| VPS deploy | `http://77.110.122.36:5173`; `http://77.110.122.36:8000/api/health/` | Публичная демонстрация клиент-серверного приложения. | Выполнено на VPS через `/opt/habittrack` и `docker compose up -d --build`. |
| VPS demo seed | `docker compose exec backend python manage.py seed_demo` | Заполнение опубликованной системы демонстрационными данными. | Созданы 3 demo accounts, 6 habits, 194 completions. |
| VPS smoke-check | Public API smoke flow: demo login, dashboard, habits, admin login, admin users, blocked login | Проверка работоспособности публичного deploy. | `demo login: 200`; `dashboard: 200`; `habits: 200, count=4`; `admin users: 200, count=3`; `blocked login: 401 account_blocked`. |
| Swagger UI | `/api/docs/` | Ручная smoke-проверка API и демонстрация. | Реализовано. |
| ReDoc | `/api/redoc/` | Альтернативная API-документация. | Реализовано. |
| OpenAPI schema | `/api/schema/` | Контракт для frontend и ревью. | Реализовано. |

## Что еще нужно после технической фиксации

- при необходимости добавить скриншоты публичного пользовательского/admin
  сценария с VPS;
- после фаззинг-прогона добавить результаты negative testing.
