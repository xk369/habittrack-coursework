from django.test import TestCase
from rest_framework.test import APIClient


class CorsConfigurationTests(TestCase):
    def test_local_frontend_origin_is_allowed(self):
        response = APIClient().get(
            '/api/health/',
            HTTP_ORIGIN='http://localhost:5173',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers.get('access-control-allow-origin'),
            'http://localhost:5173',
        )

    def test_unknown_origin_is_not_allowed(self):
        response = APIClient().get(
            '/api/health/',
            HTTP_ORIGIN='http://evil.example.com',
        )

        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.headers.get('access-control-allow-origin'))
