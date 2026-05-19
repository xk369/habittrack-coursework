from rest_framework import serializers


class HabitStatisticsSerializer(serializers.Serializer):
    habit_id = serializers.IntegerField()
    state = serializers.CharField()
    period_start = serializers.DateField()
    period_end = serializers.DateField()
    completion_count = serializers.IntegerField()
    scheduled_dates_count = serializers.IntegerField()
    completed_scheduled_dates_count = serializers.IntegerField()
    compliance_percent = serializers.FloatField(allow_null=True)
    current_streak = serializers.IntegerField()


class DashboardHabitSerializer(serializers.Serializer):
    habit_id = serializers.IntegerField()
    title = serializers.CharField()
    completion_count = serializers.IntegerField()
    scheduled_dates_count = serializers.IntegerField()
    completed_scheduled_dates_count = serializers.IntegerField()
    compliance_percent = serializers.FloatField(allow_null=True)
    current_streak = serializers.IntegerField()


class DashboardSerializer(serializers.Serializer):
    active_habits_count = serializers.IntegerField()
    habits = DashboardHabitSerializer(many=True)

