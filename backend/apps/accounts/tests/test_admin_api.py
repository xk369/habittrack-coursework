from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient, APITestCase


User = get_user_model()


class AdminAccountApiTests(APITestCase):
    password = 'HabitTrackPass123!'

    def create_user(self, email, **kwargs):
        defaults = {
            'password': self.password,
            'display_name': 'Habit User',
        }
        defaults.update(kwargs)
        return User.objects.create_user(email=email, **defaults)

    def create_admin(self, email='admin@example.com', **kwargs):
        return self.create_user(email, role=User.Role.ADMIN, **kwargs)

    def login(self, email, password=None):
        return self.client.post(
            '/api/auth/login/',
            {'email': email, 'password': password or self.password},
            format='json',
        )

    def authenticate(self, user):
        response = self.login(user.email)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {response.data['access']}"
        )
        return response

    def user_client(self, user):
        response = self.login(user.email)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        return client, response

    def list_url(self):
        return '/api/admin/users/'

    def detail_url(self, user):
        return f'/api/admin/users/{user.id}/'

    def block_url(self, user):
        return f'/api/admin/users/{user.id}/block/'

    def unblock_url(self, user):
        return f'/api/admin/users/{user.id}/unblock/'

    def test_admin_users_list_available_for_active_admin(self):
        admin = self.create_admin()
        older = self.create_user('older@example.com')
        newer = self.create_user('newer@example.com')
        same_date = timezone.now() - timedelta(days=1)
        User.objects.filter(id__in=[admin.id, older.id]).update(
            date_joined=same_date,
        )
        User.objects.filter(id=newer.id).update(date_joined=timezone.now())
        self.authenticate(admin)

        response = self.client.get(self.list_url())

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user_ids = [item['id'] for item in response.data]
        self.assertEqual(user_ids, [newer.id, admin.id, older.id])

    def test_admin_users_list_returns_safe_fields(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        self.authenticate(admin)

        response = self.client.get(self.list_url())

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item = next(user for user in response.data if user['id'] == target.id)
        self.assertEqual(
            set(item.keys()),
            {
                'id',
                'email',
                'display_name',
                'role',
                'status',
                'date_joined',
                'updated_at',
            },
        )
        for field in (
            'password',
            'is_active',
            'is_staff',
            'is_superuser',
            'last_login',
            'groups',
            'user_permissions',
        ):
            self.assertNotIn(field, item)

    def test_admin_users_list_rejects_regular_user(self):
        user = self.create_user('user@example.com')
        self.authenticate(user)

        response = self.client.get(self.list_url())

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_users_list_rejects_anonymous_user(self):
        response = self.client.get(self.list_url())

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_users_list_rejects_blocked_admin(self):
        admin = self.create_admin()
        self.authenticate(admin)
        admin.block()

        response = self.client.get(self.list_url())

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_detail_available_for_active_admin(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        self.authenticate(admin)

        response = self.client.get(self.detail_url(target))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], target.id)
        self.assertEqual(response.data['email'], target.email)

    def test_admin_user_detail_returns_404_for_missing_user(self):
        admin = self.create_admin()
        self.authenticate(admin)

        response = self.client.get('/api/admin/users/999999/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_user_detail_rejects_regular_user(self):
        user = self.create_user('user@example.com')
        target = self.create_user('target@example.com')
        self.authenticate(user)

        response = self.client.get(self.detail_url(target))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_detail_rejects_anonymous_user(self):
        target = self.create_user('target@example.com')

        response = self.client.get(self.detail_url(target))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_user_detail_rejects_blocked_admin(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        self.authenticate(admin)
        admin.block()

        response = self.client.get(self.detail_url(target))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_blocks_active_user(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        self.authenticate(admin)

        response = self.client.post(self.block_url(target))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()
        self.assertEqual(target.status, User.Status.BLOCKED)
        self.assertFalse(target.is_active)
        self.assertEqual(response.data['status'], User.Status.BLOCKED)

    def test_admin_block_is_idempotent_for_blocked_user(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        target.block()
        target.refresh_from_db()
        updated_at = target.updated_at
        self.authenticate(admin)

        response = self.client.post(self.block_url(target))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()
        self.assertEqual(target.status, User.Status.BLOCKED)
        self.assertFalse(target.is_active)
        self.assertEqual(target.updated_at, updated_at)

    def test_admin_block_missing_user_returns_404(self):
        admin = self.create_admin()
        self.authenticate(admin)

        response = self.client.post('/api/admin/users/999999/block/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_block_another_admin(self):
        admin = self.create_admin()
        other_admin = self.create_admin(email='other-admin@example.com')
        self.authenticate(admin)

        response = self.client.post(self.block_url(other_admin))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        other_admin.refresh_from_db()
        self.assertEqual(other_admin.status, User.Status.BLOCKED)
        self.assertFalse(other_admin.is_active)

    def test_admin_self_block_is_rejected(self):
        admin = self.create_admin()
        self.authenticate(admin)

        response = self.client.post(self.block_url(admin))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        admin.refresh_from_db()
        self.assertEqual(admin.status, User.Status.ACTIVE)
        self.assertTrue(admin.is_active)

    def test_regular_user_cannot_block_user(self):
        user = self.create_user('user@example.com')
        target = self.create_user('target@example.com')
        self.authenticate(user)

        response = self.client.post(self.block_url(target))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_user_cannot_block_user(self):
        target = self.create_user('target@example.com')

        response = self.client.post(self.block_url(target))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocked_admin_cannot_block_user(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        self.authenticate(admin)
        admin.block()

        response = self.client.post(self.block_url(target))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_unblocks_blocked_user(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        target.block()
        self.authenticate(admin)

        response = self.client.post(self.unblock_url(target))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()
        self.assertEqual(target.status, User.Status.ACTIVE)
        self.assertTrue(target.is_active)
        self.assertEqual(response.data['status'], User.Status.ACTIVE)

    def test_admin_unblock_is_idempotent_for_active_user(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        updated_at = target.updated_at
        self.authenticate(admin)

        response = self.client.post(self.unblock_url(target))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()
        self.assertEqual(target.status, User.Status.ACTIVE)
        self.assertTrue(target.is_active)
        self.assertEqual(target.updated_at, updated_at)

    def test_admin_unblock_missing_user_returns_404(self):
        admin = self.create_admin()
        self.authenticate(admin)

        response = self.client.post('/api/admin/users/999999/unblock/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_regular_user_cannot_unblock_user(self):
        user = self.create_user('user@example.com')
        target = self.create_user('target@example.com')
        target.block()
        self.authenticate(user)

        response = self.client.post(self.unblock_url(target))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_user_cannot_unblock_user(self):
        target = self.create_user('target@example.com')
        target.block()

        response = self.client.post(self.unblock_url(target))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocked_admin_cannot_unblock_user(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        target.block()
        self.authenticate(admin)
        admin.block()

        response = self.client.post(self.unblock_url(target))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_blocked_user_cannot_login(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        self.authenticate(admin)
        self.client.post(self.block_url(target))
        self.client.credentials()

        response = self.login(target.email)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['code'], 'account_blocked')

    def test_existing_access_token_loses_profile_access_after_block(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        target_client, _ = self.user_client(target)
        self.authenticate(admin)
        self.client.post(self.block_url(target))

        response = target_client.get('/api/account/profile/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_existing_refresh_token_is_rejected_after_block(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        _, login_response = self.user_client(target)
        self.authenticate(admin)
        self.client.post(self.block_url(target))

        response = self.client.post(
            '/api/auth/refresh/',
            {'refresh': login_response.data['refresh']},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['code'], 'account_blocked')

    def test_refresh_token_for_deleted_user_is_rejected_as_invalid_token(self):
        target = self.create_user('target@example.com')
        _, login_response = self.user_client(target)
        target.delete()

        response = self.client.post(
            '/api/auth/refresh/',
            {'refresh': login_response.data['refresh']},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['code'], 'token_not_valid')

    def test_unblocked_user_can_login_again(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        self.authenticate(admin)
        self.client.post(self.block_url(target))
        self.client.post(self.unblock_url(target))
        self.client.credentials()

        response = self.login(target.email)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_unblocked_user_can_refresh_again(self):
        admin = self.create_admin()
        target = self.create_user('target@example.com')
        _, login_response = self.user_client(target)
        self.authenticate(admin)
        self.client.post(self.block_url(target))
        self.client.post(self.unblock_url(target))

        response = self.client.post(
            '/api/auth/refresh/',
            {'refresh': login_response.data['refresh']},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
