export type UserRole = 'user' | 'admin';
export type AccountStatus = 'active' | 'blocked';
export type HabitState = 'active' | 'archived';
export type ScheduleMode = 'daily' | 'weekly_days';

export interface UserProfile {
  id: number;
  email: string;
  display_name: string;
  role: UserRole;
  status: AccountStatus;
}

export interface AdminUser extends UserProfile {
  date_joined: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  user: UserProfile;
}

export interface Schedule {
  mode: ScheduleMode;
  weekdays: number[];
}

export interface Habit {
  id: number;
  title: string;
  purpose: string;
  state: HabitState;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  schedule: Schedule;
}

export interface HabitPayload {
  title: string;
  purpose: string;
  schedule: Schedule;
}

export interface Completion {
  id: number;
  completion_date: string;
  created_at: string;
  updated_at: string;
}

export interface HabitStatistics {
  habit_id: number;
  state: HabitState;
  period_start: string;
  period_end: string;
  completion_count: number;
  scheduled_dates_count: number;
  completed_scheduled_dates_count: number;
  compliance_percent: number | null;
  current_streak: number;
}

export interface DashboardHabit {
  habit_id: number;
  title: string;
  completion_count: number;
  scheduled_dates_count: number;
  completed_scheduled_dates_count: number;
  compliance_percent: number | null;
  current_streak: number;
}

export interface Dashboard {
  active_habits_count: number;
  habits: DashboardHabit[];
}

export interface ApiErrorShape {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
  detail?: string;
  code?: string;
}
