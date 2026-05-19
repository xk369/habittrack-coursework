from django.urls import path

from apps.analytics.views import DashboardView, HabitStatisticsView

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path(
        'habits/<int:habit_id>/statistics/',
        HabitStatisticsView.as_view(),
        name='habit-statistics',
    ),
]

