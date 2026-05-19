from rest_framework.permissions import BasePermission

from apps.accounts.models import User


class IsAuthenticatedAndActive(BasePermission):
    message = 'Authentication is required and account status must be active.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, 'status', None) == User.Status.ACTIVE
        )

