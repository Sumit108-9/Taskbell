import { createContext, useContext } from 'react';
import { Task, FilterType } from '@/backend/types';

export interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'isOverdue' | 'subtasks'> & Partial<Pick<Task, 'subtasks'>>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  getTasksByFilter: (filter: FilterType, date?: Date) => Task[];
  getTaskById: (id: string) => Task | undefined;
  refresh: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
