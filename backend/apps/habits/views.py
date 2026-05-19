from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.habits.models import Habit
from apps.habits.serializers import HabitSerializer


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    http_method_names = ('get', 'post', 'patch', 'delete', 'head', 'options')

    def get_queryset(self):
        queryset = (
            Habit.objects
            .filter(owner=self.request.user)
            .select_related('schedule')
            .prefetch_related('schedule__days')
        )

        if self.action != 'list':
            return queryset

        state = self.request.query_params.get('state', Habit.State.ACTIVE)
        if state == Habit.State.ACTIVE:
            return queryset.filter(state=Habit.State.ACTIVE)
        if state == Habit.State.ARCHIVED:
            return queryset.filter(state=Habit.State.ARCHIVED)
        if state == 'all':
            return queryset

        raise ValidationError({
            'state': 'Allowed values are active, archived, all.'
        })

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=('post',))
    def archive(self, request, pk=None):
        habit = self.get_object()
        habit.archive()
        serializer = self.get_serializer(habit)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=('post',))
    def unarchive(self, request, pk=None):
        habit = self.get_object()
        habit.unarchive()
        serializer = self.get_serializer(habit)
        return Response(serializer.data, status=status.HTTP_200_OK)

