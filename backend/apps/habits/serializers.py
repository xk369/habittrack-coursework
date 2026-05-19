from django.db import transaction
from rest_framework import serializers

from apps.habits.models import Habit, HabitSchedule, HabitScheduleDay


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
        return list(obj.days.values_list('weekday', flat=True))


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
