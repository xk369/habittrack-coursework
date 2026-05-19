from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.permissions import IsAuthenticatedAndActive
from apps.accounts.serializers import (
    ActiveTokenObtainPairSerializer,
    RegistrationSerializer,
    UserProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)


class LoginView(TokenObtainPairView):
    serializer_class = ActiveTokenObtainPairSerializer
    permission_classes = (AllowAny,)


class RefreshView(TokenRefreshView):
    permission_classes = (AllowAny,)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticatedAndActive,)
    http_method_names = ('get', 'patch', 'head', 'options')

    def get_object(self):
        return self.request.user
