# План фаззинг-тестирования

## Назначение

Фаззинг в HabitTrack нужен для проверки устойчивости API к некорректным
данным, подмене ролей, ошибкам расписания, датам completion и попыткам
обхода ownership.

## Области фаззинга

| Область | Payload / воздействие | Ожидаемая реакция |
| --- | --- | --- |
| Auth/register | Невалидные email, слабые/пустые password, лишние `role/status`. | 400, пользователь не создан. |
| Auth/login/refresh | Неверные credentials, blocked user, refresh после block, malformed token. | 401/403 без выдачи access token. |
| Profile | Попытка изменить `role/status`, пустые/длинные значения. | 400 или безопасное отклонение. |
| Habits | Пустой/слишком длинный title, неверный `state`, отсутствующий schedule. | 400 без 500. |
| Schedule | `daily` с weekdays, `weekly_days` без weekdays, дубликаты, значения вне `0..6`, неверные типы. | 400, расписание не сохранено. |
| Completion date | Неверный формат, пустое поле, будущая дата, дата до создания habit, незапланированный weekday, дубликат. | 400, без IntegrityError наружу. |
| IDs / ownership | Чужие habit_id/completion_id/user_id, несуществующие id, несовпадение habit/completion. | 403/404 согласно API-политике. |
| Admin API | Anonymous, regular user, blocked admin, self-block, malformed user_id. | 401/403/404/400 без раскрытия лишних данных. |
| CORS/API docs | Неверный Origin, публичные docs endpoints. | Только разрешенные origins получают CORS header; docs доступны для smoke. |

## Что уже покрыто автоматическими тестами

- подмена `role/status` в регистрации и профиле;
- доступ regular/anonymous/blocked к admin API;
- block/unblock и self-block;
- refresh-gap для blocked user;
- основные ошибки schedule payload;
- completion date validation и duplicate race;
- ownership для habits/completions/statistics/admin;
- CORS для локального frontend origin.

## Что остается ручным/плановым негативным прогоном

Полноценный property-based fuzzing framework в MVP не внедряется, чтобы не
раздувать объем курсовой реализации. Перед финальной защитой рекомендуется
ручной smoke через Swagger UI и, при наличии времени, небольшой scripted
negative-run по OpenAPI schema для:

- случайных строк и типов в JSON payload;
- случайных `habit_id`, `completion_id`, `user_id`;
- дат вокруг границ периода привычки;
- повторных block/unblock/archive/unarchive;
- blocked-account refresh/login/profile.

## Статус

План синхронизирован с реализованным API. Автоматические negative tests уже
закрывают основные риски, а отдельный фаззинг-прогон может быть добавлен как
финальное доказательство перед отчетом.
