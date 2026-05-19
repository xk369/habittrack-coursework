from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.habits.models import Habit, HabitCompletion
from apps.habits.serializers import HabitCompletionSerializer, HabitSerializer


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


class HabitCompletionListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitCompletionSerializer

    def get_habit(self):
        if hasattr(self, '_habit'):
            return self._habit

        self._habit = get_object_or_404(
            Habit.objects
            .filter(owner=self.request.user)
            .select_related('schedule')
            .prefetch_related('schedule__days'),
            id=self.kwargs['habit_id'],
        )
        return self._habit

    def get_queryset(self):
        habit = self.get_habit()
        return habit.completions.order_by('-completion_date', '-id')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['habit'] = self.get_habit()
        return context

    def perform_create(self, serializer):
        serializer.save()


class HabitCompletionDestroyView(generics.DestroyAPIView):
    serializer_class = HabitCompletionSerializer
    lookup_url_kwarg = 'completion_id'

    def get_habit(self):
        if hasattr(self, '_habit'):
            return self._habit

        self._habit = get_object_or_404(
            Habit.objects.filter(owner=self.request.user),
            id=self.kwargs['habit_id'],
        )
        return self._habit

    def get_queryset(self):
        habit = self.get_habit()
        return HabitCompletion.objects.filter(habit=habit)

    def perform_destroy(self, instance):
        if instance.habit.state == Habit.State.ARCHIVED:
            raise ValidationError({
                'habit': 'Cannot change completions for archived habit.'
            })
        instance.delete()
