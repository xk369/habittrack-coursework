from rest_framework.routers import SimpleRouter

from django.urls import path

from apps.habits.views import (
    HabitCompletionDestroyView,
    HabitCompletionListCreateView,
    HabitViewSet,
)

router = SimpleRouter(use_regex_path=False)
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
