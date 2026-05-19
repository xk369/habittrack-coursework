from datetime import timedelta

from django.utils import timezone

from apps.habits.models import Habit, HabitSchedule


def get_habit_period(habit):
    start_date = timezone.localtime(habit.created_at).date()
    if habit.state == Habit.State.ARCHIVED and habit.archived_at:
        end_date = timezone.localtime(habit.archived_at).date()
    else:
        end_date = timezone.localdate()
    return start_date, end_date


def get_scheduled_dates(habit, start_date=None, end_date=None):
    if start_date is None or end_date is None:
        start_date, end_date = get_habit_period(habit)

    if end_date < start_date:
        return []

    schedule = habit.schedule
    if schedule.mode == HabitSchedule.Mode.WEEKLY_DAYS:
        allowed_weekdays = {day.weekday for day in schedule.days.all()}
    else:
        allowed_weekdays = None

    scheduled_dates = []
    current_date = start_date
    while current_date <= end_date:
        if (
            schedule.mode == HabitSchedule.Mode.DAILY
            or current_date.weekday() in allowed_weekdays
        ):
            scheduled_dates.append(current_date)
        current_date += timedelta(days=1)

    return scheduled_dates


def calculate_habit_statistics(habit):
    start_date, end_date = get_habit_period(habit)
    scheduled_dates = get_scheduled_dates(habit, start_date, end_date)
    scheduled_set = set(scheduled_dates)

    completion_dates = {
        completion.completion_date
        for completion in habit.completions.all()
        if start_date <= completion.completion_date <= end_date
    }

    completed_scheduled_dates = scheduled_set & completion_dates
    scheduled_count = len(scheduled_dates)
    completed_scheduled_count = len(completed_scheduled_dates)

    if scheduled_count == 0:
        compliance_percent = None
    else:
        compliance_percent = round(
            completed_scheduled_count / scheduled_count * 100,
            2,
        )

    return {
        'habit_id': habit.id,
        'state': habit.state,
        'period_start': start_date,
        'period_end': end_date,
        'completion_count': len(completion_dates),
        'scheduled_dates_count': scheduled_count,
        'completed_scheduled_dates_count': completed_scheduled_count,
        'compliance_percent': compliance_percent,
        'current_streak': calculate_current_streak(
            scheduled_dates,
            completion_dates,
        ),
    }


def calculate_current_streak(scheduled_dates, completion_dates):
    streak = 0
    for scheduled_date in reversed(scheduled_dates):
        if scheduled_date not in completion_dates:
            break
        streak += 1
    return streak


def build_dashboard(habits):
    habit_items = [
        _dashboard_item(habit, calculate_habit_statistics(habit))
        for habit in habits
    ]
    return {
        'active_habits_count': len(habit_items),
        'habits': habit_items,
    }


def _dashboard_item(habit, stats):
    return {
        'habit_id': stats['habit_id'],
        'title': habit.title,
        'completion_count': stats['completion_count'],
        'scheduled_dates_count': stats['scheduled_dates_count'],
        'completed_scheduled_dates_count': stats['completed_scheduled_dates_count'],
        'compliance_percent': stats['compliance_percent'],
        'current_streak': stats['current_streak'],
    }
