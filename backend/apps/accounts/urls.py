from django.urls import path
from apps.accounts.views import LoginView, ProfileView, RefreshView, RegisterView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', RefreshView.as_view(), name='auth-refresh'),
    path('account/profile/', ProfileView.as_view(), name='account-profile'),
]
