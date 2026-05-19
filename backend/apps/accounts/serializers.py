from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
        data = super().validate(attrs)

        if self.user.status == User.Status.BLOCKED:
            raise AuthenticationFailed('Account is blocked.', code='account_blocked')

        data['user'] = UserProfileSerializer(self.user).data
        return data

