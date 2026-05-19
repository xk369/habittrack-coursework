from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class Habit(models.Model):
    class State(models.TextChoices):
        ACTIVE = 'active', 'Active'
        ARCHIVED = 'archived', 'Archived'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='habits',
    )
    title = models.CharField(max_length=150)
    purpose = models.TextField(blank=True)
    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ('-created_at', '-id')

    def __str__(self):
        return self.title

    def archive(self):
        self.state = self.State.ARCHIVED
        self.archived_at = timezone.now()
        self.save(update_fields=('state', 'archived_at', 'updated_at'))

    def unarchive(self):
        self.state = self.State.ACTIVE
        self.archived_at = None
        self.save(update_fields=('state', 'archived_at', 'updated_at'))


class HabitSchedule(models.Model):
    class Mode(models.TextChoices):
        DAILY = 'daily', 'Daily'
        WEEKLY_DAYS = 'weekly_days', 'Weekly days'

    habit = models.OneToOneField(
        Habit,
        on_delete=models.CASCADE,
        related_name='schedule',
    )
    mode = models.CharField(
        max_length=20,
        choices=Mode.choices,
        default=Mode.DAILY,
    )

    def __str__(self):
        return f'{self.habit_id}: {self.mode}'


class HabitScheduleDay(models.Model):
    schedule = models.ForeignKey(
        HabitSchedule,
        on_delete=models.CASCADE,
        related_name='days',
    )
    weekday = models.PositiveSmallIntegerField(
        validators=(MinValueValidator(0), MaxValueValidator(6)),
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('schedule', 'weekday'),
                name='unique_weekday_per_schedule',
            ),
        )
        ordering = ('weekday',)

    def __str__(self):
        return f'{self.schedule_id}: {self.weekday}'

