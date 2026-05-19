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


class HabitApiTests(APITestCase):
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
        purpose='Read regularly',
        state=Habit.State.ACTIVE,
        mode=HabitSchedule.Mode.DAILY,
        weekdays=None,
    ):
        habit = Habit.objects.create(
            owner=owner,
            title=title,
            purpose=purpose,
        )
        schedule = HabitSchedule.objects.create(habit=habit, mode=mode)
        if mode == HabitSchedule.Mode.WEEKLY_DAYS:
            HabitScheduleDay.objects.bulk_create([
                HabitScheduleDay(schedule=schedule, weekday=weekday)
                for weekday in (weekdays or [0])
            ])
        if state == Habit.State.ARCHIVED:
            habit.archive()
        return habit

    def test_create_daily_habit(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'Read 20 minutes',
                'purpose': 'Build regular reading',
                'schedule': {'mode': HabitSchedule.Mode.DAILY},
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        habit = Habit.objects.get(owner=user)
        self.assertEqual(habit.schedule.mode, HabitSchedule.Mode.DAILY)
        self.assertEqual(list(habit.schedule.days.all()), [])
        self.assertEqual(response.data['schedule']['weekdays'], [])

    def test_create_weekly_days_habit(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'Workout',
                'purpose': 'Stay fit',
                'schedule': {
                    'mode': HabitSchedule.Mode.WEEKLY_DAYS,
                    'weekdays': [0, 2, 4],
                },
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        habit = Habit.objects.get(owner=user)
        self.assertEqual(habit.schedule.mode, HabitSchedule.Mode.WEEKLY_DAYS)
        self.assertEqual(
            list(habit.schedule.days.values_list('weekday', flat=True)),
            [0, 2, 4],
        )

    def test_create_rejects_daily_with_non_empty_weekdays(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'Read',
                'schedule': {
                    'mode': HabitSchedule.Mode.DAILY,
                    'weekdays': [0],
                },
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('weekdays', response.data['schedule'])

    def test_create_rejects_weekly_days_without_weekdays(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'Workout',
                'schedule': {'mode': HabitSchedule.Mode.WEEKLY_DAYS},
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('weekdays', response.data['schedule'])

    def test_create_rejects_weekly_days_with_empty_weekdays(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'Workout',
                'schedule': {
                    'mode': HabitSchedule.Mode.WEEKLY_DAYS,
                    'weekdays': [],
                },
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('weekdays', response.data['schedule'])

    def test_create_rejects_weekday_out_of_range(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'Workout',
                'schedule': {
                    'mode': HabitSchedule.Mode.WEEKLY_DAYS,
                    'weekdays': [7],
                },
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('weekdays', response.data['schedule'])

    def test_create_rejects_duplicate_weekdays(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'Workout',
                'schedule': {
                    'mode': HabitSchedule.Mode.WEEKLY_DAYS,
                    'weekdays': [1, 1],
                },
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('weekdays', response.data['schedule'])

    def test_create_rejects_empty_title(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': '',
                'schedule': {'mode': HabitSchedule.Mode.DAILY},
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_create_rejects_too_long_title(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.post(
            '/api/habits/',
            {
                'title': 'x' * 151,
                'schedule': {'mode': HabitSchedule.Mode.DAILY},
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_list_returns_only_owner_habits(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        self.create_habit(user, title='Mine')
        self.create_habit(other, title='Other')
        self.authenticate(user)

        response = self.client.get('/api/habits/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Mine')

    def test_list_defaults_to_active_habits(self):
        user = self.create_user()
        active = self.create_habit(user, title='Active')
        self.create_habit(user, title='Archived', state=Habit.State.ARCHIVED)
        self.authenticate(user)

        response = self.client.get('/api/habits/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item['id'] for item in response.data], [active.id])

    def test_list_state_archived_returns_archived_habits(self):
        user = self.create_user()
        self.create_habit(user, title='Active')
        archived = self.create_habit(user, title='Archived', state=Habit.State.ARCHIVED)
        self.authenticate(user)

        response = self.client.get('/api/habits/?state=archived')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item['id'] for item in response.data], [archived.id])

    def test_list_state_all_returns_all_habits(self):
        user = self.create_user()
        active = self.create_habit(user, title='Active')
        archived = self.create_habit(user, title='Archived', state=Habit.State.ARCHIVED)
        self.authenticate(user)

        response = self.client.get('/api/habits/?state=all')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            sorted(item['id'] for item in response.data),
            sorted([active.id, archived.id]),
        )

    def test_list_rejects_invalid_state_filter(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.get('/api/habits/?state=bad')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('state', response.data)

    def test_retrieve_owner_habit(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.get(f'/api/habits/{habit.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], habit.id)

    def test_retrieve_foreign_habit_returns_not_found(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other)
        self.authenticate(user)

        response = self.client.get(f'/api/habits/{habit.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_updates_title_and_purpose(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.patch(
            f'/api/habits/{habit.id}/',
            {'title': 'Updated', 'purpose': 'New purpose'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.refresh_from_db()
        self.assertEqual(habit.title, 'Updated')
        self.assertEqual(habit.purpose, 'New purpose')

    def test_patch_without_schedule_keeps_existing_schedule(self):
        user = self.create_user()
        habit = self.create_habit(
            user,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[1, 3],
        )
        self.authenticate(user)

        response = self.client.patch(
            f'/api/habits/{habit.id}/',
            {'title': 'Updated'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.schedule.refresh_from_db()
        self.assertEqual(habit.schedule.mode, HabitSchedule.Mode.WEEKLY_DAYS)
        self.assertEqual(
            list(habit.schedule.days.values_list('weekday', flat=True)),
            [1, 3],
        )

    def test_patch_updates_schedule_daily_to_weekly_days(self):
        user = self.create_user()
        habit = self.create_habit(user, mode=HabitSchedule.Mode.DAILY)
        self.authenticate(user)

        response = self.client.patch(
            f'/api/habits/{habit.id}/',
            {
                'schedule': {
                    'mode': HabitSchedule.Mode.WEEKLY_DAYS,
                    'weekdays': [1, 3],
                },
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.schedule.refresh_from_db()
        self.assertEqual(habit.schedule.mode, HabitSchedule.Mode.WEEKLY_DAYS)
        self.assertEqual(
            list(habit.schedule.days.values_list('weekday', flat=True)),
            [1, 3],
        )

    def test_patch_updates_schedule_weekly_days_to_daily(self):
        user = self.create_user()
        habit = self.create_habit(
            user,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[0, 2],
        )
        self.authenticate(user)

        response = self.client.patch(
            f'/api/habits/{habit.id}/',
            {'schedule': {'mode': HabitSchedule.Mode.DAILY}},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.schedule.refresh_from_db()
        self.assertEqual(habit.schedule.mode, HabitSchedule.Mode.DAILY)
        self.assertFalse(habit.schedule.days.exists())

    def test_patch_foreign_habit_returns_not_found(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other)
        self.authenticate(user)

        response = self.client.patch(
            f'/api/habits/{habit.id}/',
            {'title': 'Nope'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_archive_sets_state_and_archived_at(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.post(f'/api/habits/{habit.id}/archive/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.refresh_from_db()
        self.assertEqual(habit.state, Habit.State.ARCHIVED)
        self.assertIsNotNone(habit.archived_at)

    def test_archive_is_idempotent_and_keeps_archived_at(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)
        self.client.post(f'/api/habits/{habit.id}/archive/')
        habit.refresh_from_db()
        archived_at = habit.archived_at

        response = self.client.post(f'/api/habits/{habit.id}/archive/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.refresh_from_db()
        self.assertEqual(habit.state, Habit.State.ARCHIVED)
        self.assertEqual(habit.archived_at, archived_at)

    def test_archive_foreign_habit_returns_not_found(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other)
        self.authenticate(user)

        response = self.client.post(f'/api/habits/{habit.id}/archive/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unarchive_sets_active_and_clears_archived_at(self):
        user = self.create_user()
        habit = self.create_habit(user, state=Habit.State.ARCHIVED)
        self.authenticate(user)

        response = self.client.post(f'/api/habits/{habit.id}/unarchive/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.refresh_from_db()
        self.assertEqual(habit.state, Habit.State.ACTIVE)
        self.assertIsNone(habit.archived_at)

    def test_unarchive_is_idempotent_for_active_habit(self):
        user = self.create_user()
        habit = self.create_habit(user)
        updated_at = habit.updated_at
        self.authenticate(user)

        response = self.client.post(f'/api/habits/{habit.id}/unarchive/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.refresh_from_db()
        self.assertEqual(habit.state, Habit.State.ACTIVE)
        self.assertIsNone(habit.archived_at)
        self.assertEqual(habit.updated_at, updated_at)

    def test_unarchive_foreign_habit_returns_not_found(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other, state=Habit.State.ARCHIVED)
        self.authenticate(user)

        response = self.client.post(f'/api/habits/{habit.id}/unarchive/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_owner_habit(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.delete(f'/api/habits/{habit.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Habit.objects.filter(id=habit.id).exists())
        self.assertFalse(HabitSchedule.objects.filter(habit_id=habit.id).exists())

    def test_delete_weekly_days_habit_cascades_schedule_days(self):
        user = self.create_user()
        habit = self.create_habit(
            user,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[0, 2],
        )
        schedule_id = habit.schedule.id
        self.authenticate(user)

        response = self.client.delete(f'/api/habits/{habit.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(HabitScheduleDay.objects.filter(schedule_id=schedule_id).exists())

    def test_delete_foreign_habit_returns_not_found(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other)
        self.authenticate(user)

        response = self.client.delete(f'/api/habits/{habit.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Habit.objects.filter(id=habit.id).exists())

    def test_anonymous_user_cannot_access_habits(self):
        response = self.client.get('/api/habits/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocked_user_cannot_access_habits(self):
        user = self.create_user()
        self.authenticate(user)
        user.status = User.Status.BLOCKED
        user.save(update_fields=['status'])

        response = self.client.get('/api/habits/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class HabitCompletionApiTests(APITestCase):
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
        mode=HabitSchedule.Mode.DAILY,
        weekdays=None,
        archived=False,
    ):
        habit = Habit.objects.create(
            owner=owner,
            title=title,
            purpose='Completion test',
        )
        schedule = HabitSchedule.objects.create(habit=habit, mode=mode)
        if mode == HabitSchedule.Mode.WEEKLY_DAYS:
            HabitScheduleDay.objects.bulk_create([
                HabitScheduleDay(schedule=schedule, weekday=weekday)
                for weekday in (weekdays or [timezone.localdate().weekday()])
            ])
        if archived:
            habit.archive()
        return habit

    def completion_url(self, habit):
        return f'/api/habits/{habit.id}/completions/'

    def completion_detail_url(self, habit, completion):
        return f'/api/habits/{habit.id}/completions/{completion.id}/'

    def test_create_daily_completion_for_valid_date(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': timezone.localdate().isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            HabitCompletion.objects.filter(
                habit=habit,
                completion_date=timezone.localdate(),
            ).exists()
        )

    def test_create_weekly_days_completion_for_allowed_weekday(self):
        user = self.create_user()
        today = timezone.localdate()
        habit = self.create_habit(
            user,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[today.weekday()],
        )
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': today.isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_weekly_days_completion_rejects_unscheduled_day(self):
        user = self.create_user()
        today = timezone.localdate()
        disallowed_weekday = (today.weekday() + 1) % 7
        habit = self.create_habit(
            user,
            mode=HabitSchedule.Mode.WEEKLY_DAYS,
            weekdays=[disallowed_weekday],
        )
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': today.isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('completion_date', response.data)

    def test_create_rejects_duplicate_completion(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion_date = timezone.localdate()
        HabitCompletion.objects.create(habit=habit, completion_date=completion_date)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': completion_date.isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('completion_date', response.data)

    def test_create_rejects_date_before_habit_creation(self):
        user = self.create_user()
        habit = self.create_habit(user)
        yesterday = timezone.localdate() - timedelta(days=1)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': yesterday.isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('completion_date', response.data)

    def test_create_rejects_future_date(self):
        user = self.create_user()
        habit = self.create_habit(user)
        tomorrow = timezone.localdate() + timedelta(days=1)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': tomorrow.isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('completion_date', response.data)

    def test_create_rejects_archived_habit(self):
        user = self.create_user()
        habit = self.create_habit(user, archived=True)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': timezone.localdate().isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_rejects_foreign_habit(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': timezone.localdate().isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_user_cannot_create_completion(self):
        user = self.create_user()
        habit = self.create_habit(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': timezone.localdate().isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocked_user_cannot_create_completion(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)
        user.status = User.Status.BLOCKED
        user.save(update_fields=['status'])

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': timezone.localdate().isoformat()},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_completion_rejects_invalid_date_format(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {'completion_date': 'not-a-date'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('completion_date', response.data)

    def test_create_completion_rejects_missing_date(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.post(
            self.completion_url(habit),
            {},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('completion_date', response.data)

    def test_history_returns_user_habit_completions(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion = HabitCompletion.objects.create(
            habit=habit,
            completion_date=timezone.localdate(),
        )
        self.authenticate(user)

        response = self.client.get(self.completion_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], completion.id)

    def test_history_sorted_by_completion_date_desc(self):
        user = self.create_user()
        habit = self.create_habit(user)
        today = timezone.localdate()
        older = HabitCompletion.objects.create(
            habit=habit,
            completion_date=today - timedelta(days=2),
        )
        newer = HabitCompletion.objects.create(
            habit=habit,
            completion_date=today,
        )
        self.authenticate(user)

        response = self.client.get(self.completion_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item['id'] for item in response.data],
            [newer.id, older.id],
        )

    def test_history_available_for_archived_habit(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion = HabitCompletion.objects.create(
            habit=habit,
            completion_date=timezone.localdate(),
        )
        habit.archive()
        self.authenticate(user)

        response = self.client.get(self.completion_url(habit))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], completion.id)

    def test_history_rejects_foreign_habit(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        habit = self.create_habit(other)
        self.authenticate(user)

        response = self.client.get(self.completion_url(habit))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_user_cannot_read_completion_history(self):
        user = self.create_user()
        habit = self.create_habit(user)

        response = self.client.get(self.completion_url(habit))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocked_user_cannot_read_completion_history(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)
        user.status = User.Status.BLOCKED
        user.save(update_fields=['status'])

        response = self.client.get(self.completion_url(habit))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_completion(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion = HabitCompletion.objects.create(
            habit=habit,
            completion_date=timezone.localdate(),
        )
        self.authenticate(user)

        response = self.client.delete(self.completion_detail_url(habit, completion))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(HabitCompletion.objects.filter(id=completion.id).exists())

    def test_delete_foreign_completion_rejected(self):
        user = self.create_user()
        other = self.create_user(email='other@example.com')
        other_habit = self.create_habit(other)
        completion = HabitCompletion.objects.create(
            habit=other_habit,
            completion_date=timezone.localdate(),
        )
        self.authenticate(user)

        response = self.client.delete(
            self.completion_detail_url(other_habit, completion)
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(HabitCompletion.objects.filter(id=completion.id).exists())

    def test_delete_completion_from_another_habit_rejected(self):
        user = self.create_user()
        habit = self.create_habit(user, title='First')
        other_habit = self.create_habit(user, title='Second')
        completion = HabitCompletion.objects.create(
            habit=other_habit,
            completion_date=timezone.localdate(),
        )
        self.authenticate(user)

        response = self.client.delete(self.completion_detail_url(habit, completion))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(HabitCompletion.objects.filter(id=completion.id).exists())

    def test_delete_completion_for_archived_habit_rejected(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion = HabitCompletion.objects.create(
            habit=habit,
            completion_date=timezone.localdate(),
        )
        habit.archive()
        self.authenticate(user)

        response = self.client.delete(self.completion_detail_url(habit, completion))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(HabitCompletion.objects.filter(id=completion.id).exists())

    def test_anonymous_user_cannot_delete_completion(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion = HabitCompletion.objects.create(
            habit=habit,
            completion_date=timezone.localdate(),
        )

        response = self.client.delete(self.completion_detail_url(habit, completion))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocked_user_cannot_delete_completion(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion = HabitCompletion.objects.create(
            habit=habit,
            completion_date=timezone.localdate(),
        )
        self.authenticate(user)
        user.status = User.Status.BLOCKED
        user.save(update_fields=['status'])

        response = self.client.delete(self.completion_detail_url(habit, completion))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_habit_cascades_completions(self):
        user = self.create_user()
        habit = self.create_habit(user)
        completion = HabitCompletion.objects.create(
            habit=habit,
            completion_date=timezone.localdate(),
        )
        self.authenticate(user)

        response = self.client.delete(f'/api/habits/{habit.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(HabitCompletion.objects.filter(id=completion.id).exists())
