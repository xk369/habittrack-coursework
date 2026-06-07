import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export function formatDate(value?: string | null) {
  if (!value) return '—';
  return dayjs(value).format('D MMM YYYY');
}

export function todayIso() {
  return dayjs().format('YYYY-MM-DD');
}

export function percent(value: number | null) {
  return value === null ? '—' : `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`;
}
