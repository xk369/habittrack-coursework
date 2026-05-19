from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.settings import api_settings

from apps.accounts.models import User


FORBIDDEN_SELF_MANAGED_FIELDS = ('role', 'status')


class RejectRoleStatusMixin:
    def validate(self, attrs):
        errors = {
            field: 'This field cannot be set through this endpoint.'
            for field in FORBIDDEN_SELF_MANAGED_FIELDS
            if field in self.initial_data
        }
        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)


class RegistrationSerializer(RejectRoleStatusMixin, serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'display_name', 'role', 'status')
        read_only_fields = ('id', 'role', 'status')

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class UserProfileSerializer(RejectRoleStatusMixin, serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'display_name', 'role', 'status')
        read_only_fields = ('id', 'email', 'role', 'status')


class ActiveTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        user = self._get_user_with_valid_password(attrs)
        if user and user.status == User.Status.BLOCKED:
            raise AuthenticationFailed('Account is blocked.', code='account_blocked')

        data = super().validate(attrs)
        data['user'] = UserProfileSerializer(self.user).data
        return data

    def _get_user_with_valid_password(self, attrs):
        email = attrs.get(self.username_field)
        password = attrs.get('password')
        if not email or not password:
            return None

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if not user.check_password(password):
            return None
        return user


class ActiveTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = self.token_class(attrs['refresh'])
        user_id = refresh.payload.get(api_settings.USER_ID_CLAIM)
        if user_id is None:
            raise InvalidToken('Token is invalid or expired')

        try:
            user = User.objects.get(**{api_settings.USER_ID_FIELD: user_id})
        except User.DoesNotExist as exc:
            raise InvalidToken('Token is invalid or expired') from exc

        if user.status != User.Status.ACTIVE:
            raise AuthenticationFailed('Account is blocked.', code='account_blocked')

        return super().validate(attrs)


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'display_name',
            'role',
            'status',
            'date_joined',
            'updated_at',
        )
        read_only_fields = fields
