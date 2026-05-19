import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Habit, HabitPayload, ScheduleMode } from '../../api/types';
import { firstError, normalizeApiError } from '../../shared/lib/errors';
import { Button, Card, InlineAlert, Input, Textarea } from '../../shared/ui/primitives';
import { WeekdayPicker, WeekdayStrip } from '../../shared/ui/WeekdayPicker';

const schema = z.object({
  title: z.string().trim().min(1, 'Название обязательно').max(120, 'Название слишком длинное'),
  purpose: z.string().trim().max(1000, 'Описание слишком длинное').optional().default(''),
  mode: z.enum(['daily', 'weekly_days']),
  weekdays: z.array(z.number().int().min(0).max(6)),
}).superRefine((value, ctx) => {
  if (value.mode === 'daily' && value.weekdays.length > 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['weekdays'], message: 'Для ежедневного режима дни недели не выбираются' });
  }
  if (value.mode === 'weekly_days' && value.weekdays.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['weekdays'], message: 'Выберите хотя бы один день недели' });
  }
});

type HabitFormValues = z.infer<typeof schema>;

function toValues(habit?: Habit): HabitFormValues {
  return {
    title: habit?.title ?? '',
    purpose: habit?.purpose ?? '',
    mode: habit?.schedule.mode ?? 'daily',
    weekdays: habit?.schedule.mode === 'weekly_days' ? habit.schedule.weekdays : [],
  };
}

function toPayload(values: HabitFormValues): HabitPayload {
  return {
    title: values.title.trim(),
    purpose: values.purpose?.trim() ?? '',
    schedule: {
      mode: values.mode,
      weekdays: values.mode === 'weekly_days' ? values.weekdays : [],
    },
  };
}

export function HabitForm({
  habit,
  submitLabel,
  onSubmit,
}: {
  habit?: Habit;
  submitLabel: string;
  onSubmit: (payload: HabitPayload) => Promise<unknown>;
}) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toValues(habit),
  });

  const mode = watch('mode');
  const title = watch('title') || 'Новая привычка';
  const purpose = watch('purpose');
  const weekdays = watch('weekdays');

  async function submit(values: HabitFormValues) {
    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      const normalized = normalizeApiError(error);
      Object.entries(normalized.fieldErrors).forEach(([field, messages]) => {
        const target = field === 'schedule.weekdays' ? 'weekdays' : field === 'schedule.mode' ? 'mode' : field;
        setError(target as keyof HabitFormValues, { message: messages[0] });
      });
      if (normalized.detail || normalized.nonFieldErrors[0]) {
        setError('root', { message: firstError(error) });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="overflow-hidden">
        <section className="border-b border-line p-5">
          <div className="ht-eyebrow mb-2">01 · Что вы хотите делать</div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Название</span>
              <Input {...register('title')} placeholder="Например, читать 20 минут" />
              {errors.title && <p className="mt-2 text-sm text-danger">{errors.title.message}</p>}
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Цель</span>
              <Textarea {...register('purpose')} placeholder="Зачем эта привычка нужна" />
              {errors.purpose && <p className="mt-2 text-sm text-danger">{errors.purpose.message}</p>}
            </label>
          </div>
        </section>
        <section className="p-5">
          <div className="ht-eyebrow mb-2">02 · Когда выполнять</div>
          <Controller
            control={control}
            name="mode"
            render={({ field }) => (
              <div className="grid gap-3 md:grid-cols-2">
                {(['daily', 'weekly_days'] as ScheduleMode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      field.onChange(item);
                    }}
                    className={`focus-ring rounded-md border p-4 text-left soft-motion ${field.value === item ? 'border-sage-600 bg-sage-50' : 'border-line bg-surface-card'}`}
                  >
                    <div className="font-medium text-ink">{item === 'daily' ? 'Ежедневно' : 'Выбранные дни'}</div>
                    <div className="mt-1 text-sm text-ink-2">
                      {item === 'daily' ? 'Каждый день недели.' : 'Конкретные дни недели.'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          />
          {errors.mode && <p className="mt-2 text-sm text-danger">{errors.mode.message}</p>}
          {mode === 'weekly_days' && (
            <div className="mt-4 rounded-md border border-line bg-surface-inset p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="ht-eyebrow">Дни недели</span>
                <span className="font-mono text-xs text-ink-3">выбрано · {weekdays.length}/7</span>
              </div>
              <Controller
                control={control}
                name="weekdays"
                render={({ field }) => <WeekdayPicker value={field.value} onChange={field.onChange} />}
              />
              {errors.weekdays && <p className="mt-2 text-sm text-danger">{errors.weekdays.message}</p>}
            </div>
          )}
          {errors.root?.message && <div className="mt-4"><InlineAlert>{errors.root.message}</InlineAlert></div>}
          <div className="mt-5 flex justify-end">
            <Button type="submit" variant="accent" loading={isSubmitting}>{submitLabel}</Button>
          </div>
        </section>
      </Card>
      <aside className="space-y-3">
        <div className="ht-eyebrow">Предпросмотр</div>
        <Card className="p-5">
          <div className="text-lg font-medium text-ink">{title}</div>
          <p className="mt-2 min-h-10 text-sm leading-6 text-ink-2">{purpose || 'Описание появится здесь.'}</p>
          <div className="mt-4 rounded-md border border-line bg-surface-inset p-3">
            {mode === 'daily' ? <WeekdayStrip weekdays={[0, 1, 2, 3, 4, 5, 6]} /> : <WeekdayStrip weekdays={weekdays} />}
          </div>
        </Card>
      </aside>
    </form>
  );
}
