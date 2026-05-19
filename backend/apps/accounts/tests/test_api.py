from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AccountApiTests(APITestCase):
    password = 'HabitTrackPass123!'

    def create_user(self, **kwargs):
        defaults = {
            'email': 'user@example.com',
            'password': self.password,
            'display_name': 'Habit User',
        }
        defaults.update(kwargs)
        return User.objects.create_user(**defaults)

    def login(self, email='user@example.com', password=None):
        response = self.client.post(
            '/api/auth/login/',
            {'email': email, 'password': password or self.password},
            format='json',
        )
        return response

    def authenticate(self, user):
        response = self.login(user.email)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {response.data['access']}"
        )

    def test_register_creates_active_user_role(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'email': 'new@example.com',
                'password': self.password,
                'display_name': 'New User',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email='new@example.com')
        self.assertEqual(user.role, User.Role.USER)
        self.assertEqual(user.status, User.Status.ACTIVE)
        self.assertEqual(response.data['role'], User.Role.USER)
        self.assertEqual(response.data['status'], User.Status.ACTIVE)
        self.assertNotIn('password', response.data)

    def test_register_rejects_role(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'email': 'new@example.com',
                'password': self.password,
                'role': User.Role.ADMIN,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('role', response.data)
        self.assertFalse(User.objects.filter(email='new@example.com').exists())

    def test_register_rejects_status(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'email': 'new@example.com',
                'password': self.password,
                'status': User.Status.BLOCKED,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('status', response.data)
        self.assertFalse(User.objects.filter(email='new@example.com').exists())

    def test_register_rejects_invalid_email(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'email': 'not-an-email',
                'password': self.password,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_register_rejects_weak_password(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'email': 'new@example.com',
                'password': '123',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_active_user(self):
        self.create_user()

        response = self.login()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_rejects_blocked_user(self):
        self.create_user(status=User.Status.BLOCKED)

        response = self.login()

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access', response.data)

    def test_login_rejects_invalid_credentials(self):
        self.create_user()

        response = self.login(password='wrong-password')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access', response.data)

    def test_profile_available_for_active_user(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.get('/api/account/profile/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], user.email)

    def test_profile_rejects_anonymous_user(self):
        response = self.client.get('/api/account/profile/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_rejects_blocked_user(self):
        user = self.create_user()
        self.authenticate(user)
        user.status = User.Status.BLOCKED
        user.save(update_fields=['status'])

        response = self.client.get('/api/account/profile/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_profile_updates_display_name(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.patch(
            '/api/account/profile/',
            {'display_name': 'Updated Name'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.display_name, 'Updated Name')

    def test_profile_rejects_role_update(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.patch(
            '/api/account/profile/',
            {'role': User.Role.ADMIN},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('role', response.data)
        user.refresh_from_db()
        self.assertEqual(user.role, User.Role.USER)

    def test_profile_rejects_status_update(self):
        user = self.create_user()
        self.authenticate(user)

        response = self.client.patch(
            '/api/account/profile/',
            {'status': User.Status.BLOCKED},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('status', response.data)
        user.refresh_from_db()
        self.assertEqual(user.status, User.Status.ACTIVE)

    def test_admin_role_exists_for_future_admin_contour(self):
        user = self.create_user(email='admin@example.com', role=User.Role.ADMIN)

        self.assertEqual(user.role, User.Role.ADMIN)

    def test_blocked_status_exists_for_future_admin_contour(self):
        user = self.create_user(status=User.Status.BLOCKED)

        self.assertEqual(user.status, User.Status.BLOCKED)

