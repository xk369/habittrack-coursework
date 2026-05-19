from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.models import User
from apps.accounts.permissions import IsAdminRole, IsAuthenticatedAndActive
from apps.accounts.serializers import (
    ActiveTokenRefreshSerializer,
    AdminUserSerializer,
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
    serializer_class = ActiveTokenRefreshSerializer
    permission_classes = (AllowAny,)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticatedAndActive,)
    http_method_names = ('get', 'patch', 'head', 'options')

    def get_object(self):
        return self.request.user


class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = (IsAuthenticatedAndActive, IsAdminRole)

    def get_queryset(self):
        return User.objects.order_by('-date_joined', 'id')


class AdminUserDetailView(generics.RetrieveAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = (IsAuthenticatedAndActive, IsAdminRole)
    queryset = User.objects.all()
    lookup_url_kwarg = 'user_id'


class AdminUserBlockView(generics.GenericAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = (IsAuthenticatedAndActive, IsAdminRole)
    queryset = User.objects.all()
    lookup_url_kwarg = 'user_id'

    @extend_schema(
        request=None,
        responses=AdminUserSerializer,
        summary='Block user account',
        description='Blocks a user account and returns the updated user.',
    )
    def post(self, request, *args, **kwargs):
        user = self.get_object()
        if user.id == request.user.id:
            return Response(
                {'detail': 'Admin cannot block own account.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.block()
        user.refresh_from_db()
        return Response(self.get_serializer(user).data)


class AdminUserUnblockView(generics.GenericAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = (IsAuthenticatedAndActive, IsAdminRole)
    queryset = User.objects.all()
    lookup_url_kwarg = 'user_id'

    @extend_schema(
        request=None,
        responses=AdminUserSerializer,
        summary='Unblock user account',
        description='Unblocks a user account and returns the updated user.',
    )
    def post(self, request, *args, **kwargs):
        user = self.get_object()
        user.unblock()
        user.refresh_from_db()
        return Response(self.get_serializer(user).data)
