from dataclasses import dataclass
from datetime import date, datetime, time, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.habits.models import (
    Habit,
    HabitCompletion,
    HabitSchedule,
    HabitScheduleDay,
)


ADMIN_EMAIL = 'admin@habittrack.local'
DEMO_EMAIL = 'demo@habittrack.local'
BLOCKED_EMAIL = 'blocked@habittrack.local'

DEMO_PASSWORDS = {
    ADMIN_EMAIL: 'AdminDemo!2026',
    DEMO_EMAIL: 'DemoUser!2026',
    BLOCKED_EMAIL: 'BlockedDemo!2026',
}


@dataclass(frozen=True)
class DemoHabitSpec:
    title: str
    purpose: str
    mode: str
    weekdays: tuple[int, ...]
    created_days_ago: int
    archived_days_ago: int | None
    pattern: str


DEMO_HABITS = (
    DemoHabitSpec(
        title='Читать 20 минут',
        purpose='Поддерживать регулярное чтение без перегруза.',
        mode=HabitSchedule.Mode.DAILY,
        weekdays=(),
        created_days_ago=70,
        archived_days_ago=None,
        pattern='strong_daily',
    ),
    DemoHabitSpec(
        title='Тренировка',
        purpose='Три короткие тренировки в неделю.',
        mode=HabitSchedule.Mode.WEEKLY_DAYS,
        weekdays=(0, 2, 4),
        created_days_ago=75,
        archived_days_ago=None,
        pattern='miss_latest',
    ),
    DemoHabitSpec(
        title='Планирование недели',
        purpose='Рабочая привычка на будние дни.',
        mode=HabitSchedule.Mode.WEEKLY_DAYS,
        weekdays=(0, 1, 2, 3, 4),
        created_days_ago=60,
        archived_days_ago=None,
        pattern='weekday_focus',
    ),
    DemoHabitSpec(
        title='Вода утром',
        purpose='Мягкая привычка с нерегулярной историей.',
        mode=HabitSchedule.Mode.DAILY,
        weekdays=(),
        created_days_ago=45,
        archived_days_ago=None,
        pattern='low_compliance',
    ),
    DemoHabitSpec(
        title='Медитация',
        purpose='Архивная привычка с богатой историей выполнения.',
        mode=HabitSchedule.Mode.DAILY,
        weekdays=(),
        created_days_ago=90,
        archived_days_ago=20,
        pattern='archived_rich',
    ),
    DemoHabitSpec(
        title='Испанский словарь',
        purpose='Архивная привычка с короткой смешанной историей.',
        mode=HabitSchedule.Mode.WEEKLY_DAYS,
        weekdays=(1, 3, 5),
        created_days_ago=80,
        archived_days_ago=10,
        pattern='archived_mixed',
    ),
)


class Command(BaseCommand):
    help = 'Seed deterministic demo accounts, habits, schedules, and completions.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.verbosity = options.get('verbosity', 1)
        User = get_user_model()
        admin = self._upsert_user(
            User,
            email=ADMIN_EMAIL,
            display_name='Администратор HabitTrack',
            role=User.Role.ADMIN,
        )
        demo_user = self._upsert_user(
            User,
            email=DEMO_EMAIL,
            display_name='Алексей Демонстрационный',
            role=User.Role.USER,
        )
        blocked_user = self._upsert_user(
            User,
            email=BLOCKED_EMAIL,
            display_name='Заблокированный пользователь',
            role=User.Role.USER,
        )
        # Keep the blocked demo account transition on the domain method.
        blocked_user.block()

        demo_titles = [spec.title for spec in DEMO_HABITS]
        Habit.objects.filter(owner=demo_user, title__in=demo_titles).delete()

        today = timezone.localdate()
        created_habits = []
        completion_count = 0

        for spec in DEMO_HABITS:
            habit = self._create_habit(demo_user, spec, today)
            created_habits.append(habit)
            completion_count += self._create_completions(habit, spec, today)

        self._write(self.style.SUCCESS('Demo data seeded.'))
        self._write(f'Accounts: {admin.email}, {demo_user.email}, {blocked_user.email}')
        self._write(f'Habits recreated for {demo_user.email}: {len(created_habits)}')
        self._write(f'Completions created: {completion_count}')

    def _upsert_user(self, User, *, email, display_name, role):
        user, created = User.objects.get_or_create(email=email)
        user.display_name = display_name
        user.role = role
        user.is_staff = False
        user.is_superuser = False
        user.set_password(DEMO_PASSWORDS[email])
        user.status = User.Status.ACTIVE
        user.is_active = True

        user.save()
        if created:
            self._write(f'Created demo account: {email}')
        else:
            self._write(f'Updated demo account: {email}')
        return user

    def _write(self, message):
        if getattr(self, 'verbosity', 1) > 0:
            self.stdout.write(message)

    def _create_habit(self, owner, spec: DemoHabitSpec, today: date):
        created_at = timezone.make_aware(
            datetime.combine(today - timedelta(days=spec.created_days_ago), time.min)
        )
        archived_at = None
        state = Habit.State.ACTIVE
        if spec.archived_days_ago is not None:
            state = Habit.State.ARCHIVED
            archived_at = timezone.make_aware(
                datetime.combine(today - timedelta(days=spec.archived_days_ago), time.min)
            )

        # Archived demo habits are inserted as a reproducible historical
        # snapshot; the product archive flow still uses Habit.archive().
        habit = Habit.objects.create(
            owner=owner,
            title=spec.title,
            purpose=spec.purpose,
            state=state,
            archived_at=archived_at,
        )
        Habit.objects.filter(pk=habit.pk).update(
            created_at=created_at,
            updated_at=archived_at or created_at,
        )
        habit.refresh_from_db()

        schedule = HabitSchedule.objects.create(habit=habit, mode=spec.mode)
        if spec.mode == HabitSchedule.Mode.WEEKLY_DAYS:
            HabitScheduleDay.objects.bulk_create([
                HabitScheduleDay(schedule=schedule, weekday=weekday)
                for weekday in spec.weekdays
            ])

        return habit

    def _create_completions(self, habit: Habit, spec: DemoHabitSpec, today: date):
        start = timezone.localtime(habit.created_at).date()
        end = timezone.localtime(habit.archived_at).date() if habit.archived_at else today
        planned_dates = [
            current
            for current in self._date_range(start, end)
            if self._is_planned(current, spec)
        ]
        if not planned_dates:
            return 0

        selected_dates = self._select_completion_dates(planned_dates, spec.pattern)
        completions = [
            HabitCompletion(habit=habit, completion_date=completion_date)
            for completion_date in selected_dates
        ]
        HabitCompletion.objects.bulk_create(completions, ignore_conflicts=True)
        return len(selected_dates)

    def _date_range(self, start: date, end: date):
        current = start
        while current <= end:
            yield current
            current += timedelta(days=1)

    def _is_planned(self, current: date, spec: DemoHabitSpec):
        if spec.mode == HabitSchedule.Mode.DAILY:
            return True
        return current.weekday() in spec.weekdays

    def _select_completion_dates(self, planned_dates: list[date], pattern: str):
        if pattern == 'strong_daily':
            return [
                day
                for index, day in enumerate(planned_dates)
                if day in planned_dates[-14:] or index % 3 != 1
            ]

        if pattern == 'miss_latest':
            return [
                day
                for index, day in enumerate(planned_dates[:-1])
                if index % 3 != 0
            ]

        if pattern == 'weekday_focus':
            return [
                day
                for index, day in enumerate(planned_dates)
                if day in planned_dates[-5:] or index % 4 in {0, 1, 3}
            ]

        if pattern == 'low_compliance':
            return [
                day
                for index, day in enumerate(planned_dates[:-1])
                if index % 4 == 0
            ]

        if pattern == 'archived_rich':
            return [
                day
                for index, day in enumerate(planned_dates)
                if day in planned_dates[-10:] or index % 5 != 2
            ]

        if pattern == 'archived_mixed':
            return [
                day
                for index, day in enumerate(planned_dates)
                if index % 2 == 0 or day in planned_dates[-2:]
            ]

        return []
