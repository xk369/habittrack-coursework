from rest_framework import status
from rest_framework.test import APITestCase


class OpenApiDocsTests(APITestCase):
    def get_schema(self):
        response = self.client.get(
            '/api/schema/',
            HTTP_ACCEPT='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data

    def test_schema_endpoint_available(self):
        response = self.client.get('/api/schema/', HTTP_ACCEPT='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_swagger_ui_available(self):
        response = self.client.get('/api/docs/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_redoc_available(self):
        response = self.client.get('/api/redoc/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schema_contains_core_api_paths(self):
        schema = self.get_schema()

        paths = schema['paths']
        for path in (
            '/api/auth/login/',
            '/api/habits/',
            '/api/dashboard/',
            '/api/admin/users/',
        ):
            self.assertIn(path, paths)

    def test_schema_contains_jwt_bearer_security_scheme(self):
        schema = self.get_schema()

        security_schemes = schema['components']['securitySchemes']
        self.assertIn('jwtAuth', security_schemes)
        self.assertEqual(security_schemes['jwtAuth']['type'], 'http')
        self.assertEqual(security_schemes['jwtAuth']['scheme'], 'bearer')
        self.assertEqual(security_schemes['jwtAuth']['bearerFormat'], 'JWT')
        self.assertEqual(
            schema['paths']['/api/habits/']['get']['security'],
            [{'jwtAuth': []}],
        )
        self.assertEqual(
            schema['paths']['/api/auth/login/']['post']['security'],
            [{}],
        )
