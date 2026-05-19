# План тестирования

## Назначение

Документ для будущего плана проверки MVP, пользовательских сценариев,
авторизации, CRUD, ролевой модели и регрессионных проверок.

## Проверки admin/auth contour

Для Инкремента 7 проверяется административный backend-контур управления
учетными записями и влияние блокировки на auth-flow.

Минимальный набор сценариев:

- active admin получает список пользователей и detail пользователя;
- admin API недоступен anonymous-пользователю: ожидается 401;
- admin API недоступен active regular user: ожидается 403;
- admin API недоступен blocked admin: ожидается 403;
- admin serializer возвращает только безопасные read-only поля и не раскрывает
  password, `is_active`, `is_staff`, `is_superuser`, `last_login`, `groups`,
  `user_permissions`;
- active admin блокирует active user;
- повторный block для blocked user идемпотентен;
- block для несуществующего пользователя возвращает 404;
- active admin может заблокировать другого admin;
- self-block запрещен: ожидается 400;
- regular user не может выполнять block/unblock: ожидается 403;
- active admin разблокирует blocked user;
- повторный unblock для active user идемпотентен;
- unblock для несуществующего пользователя возвращает 404;
- после block пользователь не может выполнить login: ожидается
  401 / `account_blocked`;
- после block пользователь с ранее выданным access token не получает доступ к
  protected endpoint: ожидается 403;
- после block ранее выданный refresh token не обновляется: ожидается
  401 / `account_blocked`;
- после unblock login снова работает;
- после unblock refresh token снова может выдать access token.

## Регрессионные проверки текущего backend

Перед фиксацией Инкремента 7 выполняются:

- `python backend/manage.py check`;
- `python backend/manage.py makemigrations --check --dry-run`;
- `python backend/manage.py test apps.accounts apps.habits apps.analytics --noinput`;
- проверка `GET /api/health/`.

## Статус

План дополнен сценариями admin/auth contour. Дальнейшая детализация будет
добавляться по мере реализации frontend, demo data, Docker/deploy и
фаззинг-тестирования.
