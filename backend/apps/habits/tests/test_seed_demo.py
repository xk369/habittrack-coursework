from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

from apps.habits.management.commands.seed_demo import (
    ADMIN_EMAIL,
    BLOCKED_EMAIL,
    DEMO_EMAIL,
)
from apps.habits.models import Habit, HabitCompletion, HabitSchedule


class SeedDemoCommandTests(TestCase):
    def test_seed_demo_creates_expected_accounts_and_domain_data(self):
        call_command('seed_demo', verbosity=0)
        User = get_user_model()

        admin = User.objects.get(email=ADMIN_EMAIL)
        demo_user = User.objects.get(email=DEMO_EMAIL)
        blocked_user = User.objects.get(email=BLOCKED_EMAIL)

        self.assertEqual(admin.role, User.Role.ADMIN)
        self.assertEqual(admin.status, User.Status.ACTIVE)
        self.assertTrue(admin.is_active)
        self.assertFalse(admin.is_staff)
        self.assertFalse(admin.is_superuser)
        self.assertEqual(demo_user.role, User.Role.USER)
        self.assertEqual(demo_user.status, User.Status.ACTIVE)
        self.assertTrue(demo_user.is_active)
        self.assertEqual(blocked_user.status, User.Status.BLOCKED)
        self.assertFalse(blocked_user.is_active)

        self.assertEqual(Habit.objects.filter(owner=demo_user, state=Habit.State.ACTIVE).count(), 4)
        self.assertEqual(Habit.objects.filter(owner=demo_user, state=Habit.State.ARCHIVED).count(), 2)
        self.assertGreater(HabitCompletion.objects.filter(habit__owner=demo_user).count(), 0)

    def test_seed_demo_is_idempotent_for_demo_objects(self):
        call_command('seed_demo', verbosity=0)
        User = get_user_model()
        demo_user = User.objects.get(email=DEMO_EMAIL)
        first_counts = (
            User.objects.filter(email__in=[ADMIN_EMAIL, DEMO_EMAIL, BLOCKED_EMAIL]).count(),
            Habit.objects.filter(owner=demo_user).count(),
            HabitCompletion.objects.filter(habit__owner=demo_user).count(),
        )

        call_command('seed_demo', verbosity=0)
        demo_user.refresh_from_db()
        second_counts = (
            User.objects.filter(email__in=[ADMIN_EMAIL, DEMO_EMAIL, BLOCKED_EMAIL]).count(),
            Habit.objects.filter(owner=demo_user).count(),
            HabitCompletion.objects.filter(habit__owner=demo_user).count(),
        )

        self.assertEqual(second_counts, first_counts)

    def test_seed_demo_removes_manual_demo_habits(self):
        call_command('seed_demo', verbosity=0)
        User = get_user_model()
        demo_user = User.objects.get(email=DEMO_EMAIL)
        stray_habit = Habit.objects.create(
            owner=demo_user,
            title='длавдл',
            purpose='manual smoke artifact',
        )
        HabitSchedule.objects.create(habit=stray_habit, mode=HabitSchedule.Mode.DAILY)

        call_command('seed_demo', verbosity=0)

        self.assertFalse(Habit.objects.filter(owner=demo_user, title='длавдл').exists())
        self.assertEqual(Habit.objects.filter(owner=demo_user).count(), 6)
