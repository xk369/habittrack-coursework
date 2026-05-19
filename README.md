# HabitTrack

HabitTrack — персональный веб-трекер формирования привычек для индивидуальных
пользователей. Приложение должно позволять пользователю регистрироваться,
вести список привычек, настраивать периодичность, отмечать выполнение по дням
и просматривать прогресс.

В продукт также входит административный контур: администратор сможет
просматривать пользователей, видеть состояние учетных записей, блокировать и
разблокировать доступ к пользовательским функциям.

## Утвержденный стек

- Backend: Django + Django REST Framework.
- Frontend: React + TypeScript + Vite.
- База данных: PostgreSQL.
- Аутентификация: JWT.
- Docker / docker-compose: запланированы к следующему инфраструктурному этапу.

## Текущая стадия проекта

Анализ предметной области, требования, архитектурная рамка, стек,
концептуальная модель данных и предварительный API-план завершены на базовом
уровне. Проект перешел к этапу реализации: создан минимальный репозиторный
каркас и подготовлен backend-каркас Django + DRF с конфигурацией через
переменные окружения, PostgreSQL-настройками и health-check endpoint.
Реализован backend foundation для аккаунтов, ролевой модели и JWT-
аутентификации. Добавлен backend-контур управления привычками и расписанием
выполнения, контур отметок выполнения и истории по привычке, а также API
статистики и пользовательского дашборда.

## Базовая структура репозитория

```text
.
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── analytics/
│   │   └── habits/
│   ├── habittrack/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
├── infra/
└── docs/
```

- `backend/` — серверная часть на Django и DRF.
- `backend/apps/accounts/` — кастомная User-модель, роли, статусы,
  регистрация, вход, JWT и профиль пользователя.
- `backend/apps/analytics/` — вычисляемая статистика по привычкам и
  пользовательский dashboard без хранения агрегатов в БД.
- `backend/apps/habits/` — привычки, расписание выполнения, выбранные дни
  недели, CRUD, архивирование и удаление привычек.
- `backend/manage.py` — стандартная точка управления Django-проектом.
- `backend/habittrack/` — настройки, URL-маршруты и базовые проектные модули
  backend.
- `backend/requirements.txt` — минимальные backend-зависимости текущего
  этапа.
- `frontend/` — будущая клиентская часть на React, TypeScript и Vite.
- `infra/` — будущие материалы инфраструктуры и deploy.
- `docs/` — проектная документация, планы, требования и доказательная база.

## Backend API текущего этапа

- `GET /api/health/` — health-check backend-сервиса.
- `POST /api/auth/register/` — регистрация обычного пользователя.
- `POST /api/auth/login/` — вход активного пользователя и получение JWT.
- `POST /api/auth/refresh/` — обновление JWT access token.
- `GET /api/account/profile/` — просмотр собственного профиля.
- `PATCH /api/account/profile/` — изменение допустимых профильных полей.
- `GET /api/habits/` — список активных привычек пользователя.
- `GET /api/habits/?state=active|archived|all` — фильтрация привычек по
  состоянию.
- `POST /api/habits/` — создание привычки с расписанием.
- `GET /api/habits/{habit_id}/` — просмотр своей привычки.
- `PATCH /api/habits/{habit_id}/` — изменение привычки и, при необходимости,
  расписания.
- `DELETE /api/habits/{habit_id}/` — необратимое удаление привычки.
- `POST /api/habits/{habit_id}/archive/` — архивирование привычки.
- `POST /api/habits/{habit_id}/unarchive/` — возврат привычки из архива.
- `GET /api/habits/{habit_id}/completions/` — история отметок выполнения
  привычки.
- `POST /api/habits/{habit_id}/completions/` — отметка выполнения привычки за
  дату.
- `DELETE /api/habits/{habit_id}/completions/{completion_id}/` — снятие
  ошибочной отметки.
- `GET /api/habits/{habit_id}/statistics/` — статистика по привычке.
- `GET /api/dashboard/` — dashboard по активным привычкам пользователя.

## Локальный запуск backend

1. Создать и активировать виртуальное окружение:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Установить backend-зависимости:

```bash
python -m pip install -r backend/requirements.txt
```

3. Подготовить локальный `.env` на основе `.env.example` и заполнить значения
   для Django и PostgreSQL.

4. Убедиться, что PostgreSQL запущен, а `POSTGRES_DB`, `POSTGRES_USER`,
   `POSTGRES_HOST` и `POSTGRES_PORT` совпадают с локальной БД. Роль должна
   иметь право создавать test database для запуска Django-тестов.

5. Применить миграции:

```bash
python backend/manage.py migrate
```

6. Запустить backend:

```bash
python backend/manage.py runserver
```

7. Текущий backend test suite:

```bash
python backend/manage.py test apps.accounts apps.habits apps.analytics --noinput
```

Подробный план реализации находится в `docs/implementation-plan.md`.
