from rest_framework.routers import DefaultRouter

from django.urls import path

from apps.habits.views import (
    HabitCompletionDestroyView,
    HabitCompletionListCreateView,
    HabitViewSet,
)

router = DefaultRouter()
router.register('habits', HabitViewSet, basename='habit')

urlpatterns = [
    path(
        'habits/<int:habit_id>/completions/',
        HabitCompletionListCreateView.as_view(),
        name='habit-completion-list',
    ),
    path(
        'habits/<int:habit_id>/completions/<int:completion_id>/',
        HabitCompletionDestroyView.as_view(),
        name='habit-completion-detail',
    ),
    *router.urls,
]
