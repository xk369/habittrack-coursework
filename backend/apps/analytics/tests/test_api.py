from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.habits.models import (
    Habit,
    HabitCompletion,
    HabitSchedule,
    HabitScheduleDay,
)


User = get_user_model()


class AnalyticsApiTests(APITestCase):
    password = 'HabitTrackPass123!'

    def create_user(self, email='user@example.com', **kwargs):
        defaults = {
            'password': self.password,
            'display_name': 'Habit User',
        }
        defaults.update(kwargs)
        return User.objects.create_user(email=email, **defaults)

    def authenticate(self, user):
        response = self.client.post(
            '/api/auth/login/',
            {'email': user.email, 'password': self.password},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {response.data['access']}"
        )

    def create_habit(
        self,
        owner,
        title='Read',
        days_ago=0,
        mode=HabitSchedule.Mode.DAILY,
        weekdays=None,
        archived_at_days_ago=None,
    ):
        habit = Habit.objects.create(
            owner=owner,
            title=title,
            purpose='Analytics test',
        )
        created_at = timezone.now() - timedelta(days=days_ago)
        Habit.objects.filter(id=habit.id).update(created_at=created_at)
        schedule = HabitSchedule.objects.create(habit=habit, mode=mode)
        if mode == HabitSchedule.Mode.WEEKLY_DAYS:
            HabitScheduleDay.objects.bulk_create([
                HabitScheduleDay(schedule=schedule, weekday=weekday)
                for weekday in (weekdays or [timezone.localdate().weekday()])
            ])
        if archived_at_days_ago is not None:
            archived_at = timezone.now() - timedelta(days=archived_at_days_ago)
            Habit.objects.filter(id=habit.id).update(
                state=Habit.State.ARCHIVED,
                archived_at=archived_at,
            )
        habit.refresh_from_db()
        return habit

    def add_completion(self, habit, days_ago):
        completion_date = timezone.localdate() - timedelta(days=days_ago)
        return HabitCompletion.objects.create(
            habit=habit,
            completion_date=completion_date,
        )

    def statistics_url(self, habit):
        return f'/api/habits/{habit.id}/statistics/'

    def test_daily_statistics_completion_count(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=2)
        self.add_completion(habit, 2)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['completion_count'], 2)

    def test_daily_statistics_scheduled_dates_count(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=2)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scheduled_dates_count'], 3)

    def test_daily_statistics_compliance_percent(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=2)
        self.add_completion(habit, 2)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['completed_scheduled_dates_count'], 2)
        self.assertEqual(response.data['compliance_percent'], 66.67)

    def test_daily_statistics_current_streak(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=3)
        self.add_completion(habit, 1)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['current_streak'], 2)

    def test_daily_statistics_streak_zero_when_latest_scheduled_date_missed(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=2)
        self.add_completion(habit, 2)
        self.add_completion(habit, 1)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['current_streak'], 0)

    def test_daily_statistics_streak_counts_after_middle_gap(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=3)
        self.add_completion(habit, 3)
        self.add_completion(habit, 1)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['current_streak'], 2)

    def test_weekly_days_statistics_scheduled_dates_count(self):
        user = self.create_user()
        today = timezone.localdate()
        habit = self.create_habit(
            user,
            days_ago=6,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[today.weekday()],
        )
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scheduled_dates_count'], 1)

    def test_weekly_days_statistics_streak_uses_scheduled_dates(self):
        user = self.create_user()
        today = timezone.localdate()
        habit = self.create_habit(
            user,
            days_ago=14,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[today.weekday()],
        )
        self.add_completion(habit, 7)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scheduled_dates_count'], 3)
        self.assertEqual(response.data['current_streak'], 2)

    def test_archived_habit_statistics_period_ends_at_archived_at(self):
        user = self.create_user()
        habit = self.create_habit(
            user,
            days_ago=4,
            archived_at_days_ago=2,
        )
        self.add_completion(habit, 4)
        self.add_completion(habit, 2)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['state'], Habit.State.ARCHIVED)
        self.assertEqual(response.data['scheduled_dates_count'], 3)
        self.assertEqual(response.data['completion_count'], 2)
        self.assertEqual(
            response.data['period_end'],
            (timezone.localdate() - timedelta(days=2)).isoformat(),
        )

    def test_archived_habit_streak_uses_archived_period_end(self):
        user = self.create_user()
        habit = self.create_habit(
            user,
            days_ago=4,
            archived_at_days_ago=2,
        )
        self.add_completion(habit, 2)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['state'], Habit.State.ARCHIVED)
        self.assertEqual(response.data['current_streak'], 1)

    def test_statistics_compliance_null_without_scheduled_dates(self):
        user = self.create_user()
        today = timezone.localdate()
        habit = self.create_habit(
            user,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[(today.weekday() + 1) % 7],
        )
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scheduled_dates_count'], 0)
        self.assertIsNone(response.data['compliance_percent'])
        self.assertEqual(response.data['current_streak'], 0)

    def test_statistics_foreign_habit_not_available(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other)
        self.authenticate(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_statistics_anonymous_user_rejected(self):
        user = self.create_user()
        habit = self.create_habit(user)

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_statistics_blocked_user_rejected(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)
        user.status = User.Status.BLOCKED
        user.save(update_fields=['status'])

        response = self.client.get(self.statistics_url(habit))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_returns_only_active_habits(self):
        user = self.create_user()
        active = self.create_habit(user, title='Active')
        self.create_habit(user, title='Archived', archived_at_days_ago=0)
        self.authenticate(user)

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['active_habits_count'], 1)
        self.assertEqual(response.data['habits'][0]['habit_id'], active.id)

    def test_dashboard_does_not_include_archived_habits(self):
        user = self.create_user()
        self.create_habit(user, title='Active')
        archived = self.create_habit(user, title='Archived', archived_at_days_ago=0)
        self.authenticate(user)

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit_ids = [item['habit_id'] for item in response.data['habits']]
        self.assertNotIn(archived.id, habit_ids)

    def test_dashboard_active_habits_count(self):
        user = self.create_user()
        self.create_habit(user, title='First')
        self.create_habit(user, title='Second')
        self.create_habit(user, title='Archived', archived_at_days_ago=0)
        self.authenticate(user)

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['active_habits_count'], 2)

    def test_dashboard_habit_items_contain_metrics(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=1)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item = response.data['habits'][0]
        self.assertEqual(item['habit_id'], habit.id)
        self.assertEqual(item['title'], habit.title)
        self.assertIn('completion_count', item)
        self.assertIn('scheduled_dates_count', item)
        self.assertIn('completed_scheduled_dates_count', item)
        self.assertIn('compliance_percent', item)
        self.assertIn('current_streak', item)

    def test_dashboard_habit_items_contain_correct_metrics(self):
        user = self.create_user()
        habit = self.create_habit(user, days_ago=2, title='Dashboard habit')
        self.add_completion(habit, 2)
        self.add_completion(habit, 0)
        self.authenticate(user)

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item = response.data['habits'][0]
        self.assertEqual(item['habit_id'], habit.id)
        self.assertEqual(item['completion_count'], 2)
        self.assertEqual(item['scheduled_dates_count'], 3)
        self.assertEqual(item['completed_scheduled_dates_count'], 2)
        self.assertEqual(item['compliance_percent'], 66.67)
        self.assertEqual(item['current_streak'], 1)

    def test_dashboard_habits_are_sorted_by_created_at_then_id(self):
        user = self.create_user()
        first = self.create_habit(user, title='First', days_ago=2)
        second = self.create_habit(user, title='Second', days_ago=2)
        third = self.create_habit(user, title='Third')
        same_created_at = timezone.now() - timedelta(days=2)
        Habit.objects.filter(id__in=[first.id, second.id]).update(
            created_at=same_created_at,
        )
        self.authenticate(user)

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit_ids = [item['habit_id'] for item in response.data['habits']]
        self.assertEqual(habit_ids, [first.id, second.id, third.id])

    def test_dashboard_anonymous_user_rejected(self):
        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_dashboard_blocked_user_rejected(self):
        user = self.create_user()
        self.authenticate(user)
        user.status = User.Status.BLOCKED
        user.save(update_fields=['status'])

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
