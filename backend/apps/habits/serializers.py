from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import serializers

from apps.habits.models import (
    Habit,
    HabitCompletion,
    HabitSchedule,
    HabitScheduleDay,
)


class HabitScheduleInputSerializer(serializers.Serializer):
    mode = serializers.ChoiceField(choices=HabitSchedule.Mode.choices)
    weekdays = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=6),
        required=False,
    )

    def validate(self, attrs):
        mode = attrs['mode']
        weekdays = attrs.get('weekdays')

        if mode == HabitSchedule.Mode.DAILY:
            if weekdays:
                raise serializers.ValidationError({
                    'weekdays': 'Daily schedule cannot include weekdays.'
                })
            attrs['weekdays'] = []
            return attrs

        if weekdays is None:
            raise serializers.ValidationError({
                'weekdays': 'Weekdays are required for weekly_days schedule.'
            })
        if not weekdays:
            raise serializers.ValidationError({
                'weekdays': 'Weekdays cannot be empty for weekly_days schedule.'
            })
        if len(weekdays) != len(set(weekdays)):
            raise serializers.ValidationError({
                'weekdays': 'Duplicate weekdays are not allowed.'
            })

        return attrs


class HabitScheduleReadSerializer(serializers.ModelSerializer):
    weekdays = serializers.SerializerMethodField()

    class Meta:
        model = HabitSchedule
        fields = ('mode', 'weekdays')

    def get_weekdays(self, obj):
        if obj.mode == HabitSchedule.Mode.DAILY:
            return []
        return sorted(day.weekday for day in obj.days.all())


class HabitSerializer(serializers.ModelSerializer):
    schedule = HabitScheduleInputSerializer(required=False, write_only=True)

    class Meta:
        model = Habit
        fields = (
            'id',
            'title',
            'purpose',
            'state',
            'created_at',
            'updated_at',
            'archived_at',
            'schedule',
        )
        read_only_fields = ('id', 'state', 'created_at', 'updated_at', 'archived_at')

    def validate(self, attrs):
        if self.instance is None and 'schedule' not in self.initial_data:
            raise serializers.ValidationError({
                'schedule': 'Schedule is required.'
            })
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        schedule_data = validated_data.pop('schedule')
        habit = Habit.objects.create(**validated_data)
        self._replace_schedule(habit, schedule_data)
        return habit

    @transaction.atomic
    def update(self, instance, validated_data):
        schedule_data = validated_data.pop('schedule', None)

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        if schedule_data is not None:
            self._replace_schedule(instance, schedule_data)

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['schedule'] = HabitScheduleReadSerializer(instance.schedule).data
        return data

    def _replace_schedule(self, habit, schedule_data):
        schedule, _ = HabitSchedule.objects.update_or_create(
            habit=habit,
            defaults={'mode': schedule_data['mode']},
        )
        schedule.days.all().delete()

        if schedule.mode == HabitSchedule.Mode.WEEKLY_DAYS:
            HabitScheduleDay.objects.bulk_create([
                HabitScheduleDay(schedule=schedule, weekday=weekday)
                for weekday in schedule_data['weekdays']
            ])


class HabitCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitCompletion
        fields = ('id', 'completion_date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_completion_date(self, value):
        habit = self.context['habit']

        created_date = timezone.localtime(habit.created_at).date()
        if value < created_date:
            raise serializers.ValidationError(
                'Completion date cannot be earlier than habit creation date.'
            )

        if value > timezone.localdate():
            raise serializers.ValidationError(
                'Completion date cannot be in the future.'
            )

        if not is_date_allowed_by_schedule(habit, value):
            raise serializers.ValidationError(
                'Completion date does not match habit schedule.'
            )

        if HabitCompletion.objects.filter(
            habit=habit,
            completion_date=value,
        ).exists():
            raise serializers.ValidationError(
                'Completion already exists for this date.'
            )

        return value

    def validate(self, attrs):
        habit = self.context['habit']

        if habit.state == Habit.State.ARCHIVED:
            raise serializers.ValidationError(
                'Cannot change completions for archived habit.'
            )

        return attrs

    def create(self, validated_data):
        try:
            return HabitCompletion.objects.create(
                habit=self.context['habit'],
                **validated_data,
            )
        except IntegrityError as exc:
            raise serializers.ValidationError({
                'completion_date': 'Completion already exists for this date.'
            }) from exc


def is_date_allowed_by_schedule(habit, completion_date):
    schedule = habit.schedule
    if schedule.mode == HabitSchedule.Mode.DAILY:
        return True

    weekdays = {day.weekday for day in schedule.days.all()}
    return completion_date.weekday() in weekdays
