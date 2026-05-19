from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.analytics.serializers import (
    DashboardSerializer,
    HabitStatisticsSerializer,
)
from apps.analytics.services import build_dashboard, calculate_habit_statistics
from apps.habits.models import Habit


class HabitStatisticsView(APIView):
    def get(self, request, habit_id):
        habit = get_object_or_404(
            Habit.objects
            .filter(owner=request.user)
            .select_related('schedule')
            .prefetch_related('schedule__days', 'completions'),
            id=habit_id,
        )
        serializer = HabitStatisticsSerializer(calculate_habit_statistics(habit))
        return Response(serializer.data)


class DashboardView(APIView):
    def get(self, request):
        habits = (
            Habit.objects
            .filter(owner=request.user, state=Habit.State.ACTIVE)
            .select_related('schedule')
            .prefetch_related('schedule__days', 'completions')
            .order_by('created_at', 'id')
        )
        serializer = DashboardSerializer(build_dashboard(habits))
        return Response(serializer.data)

