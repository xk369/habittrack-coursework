from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.habits.models import Habit, HabitSchedule, HabitScheduleDay


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
            state=state,
        )
        if state == Habit.State.ARCHIVED:
            habit.archive()
        schedule = HabitSchedule.objects.create(habit=habit, mode=mode)
        if mode == HabitSchedule.Mode.WEEKLY_DAYS:
            HabitScheduleDay.objects.bulk_create([
                HabitScheduleDay(schedule=schedule, weekday=weekday)
                for weekday in (weekdays or [0])
            ])
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

    def test_unarchive_sets_active_and_clears_archived_at(self):
        user = self.create_user()
        habit = self.create_habit(user, state=Habit.State.ARCHIVED)
        self.authenticate(user)

        response = self.client.post(f'/api/habits/{habit.id}/unarchive/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habit.refresh_from_db()
        self.assertEqual(habit.state, Habit.State.ACTIVE)
        self.assertIsNone(habit.archived_at)

    def test_delete_owner_habit(self):
        user = self.create_user()
        habit = self.create_habit(user)
        self.authenticate(user)

        response = self.client.delete(f'/api/habits/{habit.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Habit.objects.filter(id=habit.id).exists())
        self.assertFalse(HabitSchedule.objects.filter(habit_id=habit.id).exists())

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

