import type { Schedule } from '../../api/types';
import { WEEKDAYS } from '../ui/WeekdayPicker';

export function scheduleLabel(schedule: Schedule) {
  if (schedule.mode === 'daily') return 'Ежедневно';
  return schedule.weekdays.map((day) => WEEKDAYS[day]).join(' / ').toUpperCase();
}
