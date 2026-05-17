export type Priority = 'High' | 'Medium' | 'Low';
export type CategoryName = 'Work' | 'Personal' | 'Health' | 'Finance' | string;
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';
export type FilterType = 'All' | 'Today' | 'Upcoming' | 'Completed' | 'Overdue';

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: CategoryName;
  priority: Priority;
  dueDate: string | null; // ISO date string for serialization
  dueTime: string | null; // "HH:mm"
  reminderMinutes: number | null;
  repeat: RepeatType;
  isCompleted: boolean;
  isOverdue: boolean;
  createdAt: string;
  completedAt?: string;
  subtasks: Subtask[];
  notificationId?: string;
}

export interface AppSettings {
  darkMode: boolean | 'system';
  notificationsEnabled: boolean;
  alarmEnabled: boolean;
  reminderSound: 'Chime' | 'Bell' | 'Beep' | 'Silent';
  theme: 'Blue' | 'Purple' | 'Green' | 'Orange';
  userName: string;
  userEmail: string;
}

export const defaultSettings: AppSettings = {
  darkMode: 'system',
  notificationsEnabled: true,
  alarmEnabled: true,
  reminderSound: 'Chime',
  theme: 'Blue',
  userName: 'Alex',
  userEmail: 'alex@taskbell.app',
};
