from django.urls import path
from apps.accounts.views import (
    AdminUserBlockView,
    AdminUserDetailView,
    AdminUserListView,
    AdminUserUnblockView,
    LoginView,
    ProfileView,
    RefreshView,
    RegisterView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', RefreshView.as_view(), name='auth-refresh'),
    path('account/profile/', ProfileView.as_view(), name='account-profile'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users-list'),
    path(
        'admin/users/<int:user_id>/',
        AdminUserDetailView.as_view(),
        name='admin-users-detail',
    ),
    path(
        'admin/users/<int:user_id>/block/',
        AdminUserBlockView.as_view(),
        name='admin-users-block',
    ),
    path(
        'admin/users/<int:user_id>/unblock/',
        AdminUserUnblockView.as_view(),
        name='admin-users-unblock',
    ),
]
