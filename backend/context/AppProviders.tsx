import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Task, FilterType, AppSettings, defaultSettings } from '@/backend/types';
import { TaskContext } from '@/backend/hooks/useTasks';
import { SettingsContext } from '@/backend/hooks/useSettings';
import { ThemeContext } from '@/backend/hooks/useTheme';
import { lightTheme, darkTheme } from '@/frontend/constants/Colors';
import * as Storage from '@/backend/storage';
import { generateId } from '@/backend/uuid';
import { getTasksByFilter as filterTasks, withComputedFlags } from '@/backend/taskHelpers';
import { scheduleTaskNotification, cancelNotification } from '@/backend/notifications';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [t, s] = await Promise.all([Storage.getTasks(), Storage.getSettings()]);
      setTasks(t.map(withComputedFlags));
      setSettings(s);
      setLoading(false);
    })();
  }, []);

  const persistTasks = useCallback(async (next: Task[]) => {
    setTasks(next);
    await Storage.saveTasks(next);
  }, []);

  const addTask: import('@/backend/hooks/useTasks').TaskContextValue['addTask'] = useCallback(
    async (input) => {
      const task: Task = withComputedFlags({
        id: generateId(),
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        dueDate: input.dueDate,
        dueTime: input.dueTime,
        reminderMinutes: input.reminderMinutes,
        repeat: input.repeat,
        isCompleted: false,
        isOverdue: false,
        createdAt: new Date().toISOString(),
        subtasks: input.subtasks ?? [],
      });
      const notifId = await scheduleTaskNotification(task);
      if (notifId) task.notificationId = notifId;
      const next = [task, ...tasks];
      await persistTasks(next);
      return task;
    },
    [tasks, persistTasks],
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;
      await cancelNotification(existing.notificationId);
      const merged = withComputedFlags({ ...existing, ...updates });
      const notifId = await scheduleTaskNotification(merged);
      if (notifId) merged.notificationId = notifId;
      else merged.notificationId = undefined;
      const next = tasks.map((t) => (t.id === id ? merged : t));
      await persistTasks(next);
    },
    [tasks, persistTasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const existing = tasks.find((t) => t.id === id);
      if (existing) await cancelNotification(existing.notificationId);
      await persistTasks(tasks.filter((t) => t.id !== id));
    },
    [tasks, persistTasks],
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      const next = tasks.map((t) => {
        if (t.id !== id) return t;
        const isCompleted = !t.isCompleted;
        return withComputedFlags({
          ...t,
          isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined,
        });
      });
      await persistTasks(next);
    },
    [tasks, persistTasks],
  );

  const getTasksByFilter = useCallback(
    (filter: FilterType, date?: Date) => filterTasks(tasks.map(withComputedFlags), filter, date),
    [tasks],
  );

  const getTaskById = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks]);

  const refresh = useCallback(async () => {
    const t = await Storage.getTasks();
    setTasks(t.map(withComputedFlags));
  }, []);

  const taskValue = useMemo(
    () => ({ tasks, loading, addTask, updateTask, deleteTask, toggleComplete, getTasksByFilter, getTaskById, refresh }),
    [tasks, loading, addTask, updateTask, deleteTask, toggleComplete, getTasksByFilter, getTaskById, refresh],
  );

  const updateSetting = useCallback(
    async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      const next = { ...settings, [key]: value };
      setSettings(next);
      await Storage.saveSettings(next);
    },
    [settings],
  );

  const settingsValue = useMemo(() => ({ settings, updateSetting }), [settings, updateSetting]);

  const isDark =
    settings.darkMode === 'system' ? systemScheme === 'dark' : Boolean(settings.darkMode);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleDark = useCallback(() => {
    updateSetting('darkMode', !isDark);
  }, [isDark, updateSetting]);

  const setDarkMode = useCallback(
    (v: boolean | 'system') => {
      updateSetting('darkMode', v);
    },
    [updateSetting],
  );

  const themeValue = useMemo(() => ({ isDark, theme, toggleDark, setDarkMode }), [isDark, theme, toggleDark, setDarkMode]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <SettingsContext.Provider value={settingsValue}>
        <TaskContext.Provider value={taskValue}>{children}</TaskContext.Provider>
      </SettingsContext.Provider>
    </ThemeContext.Provider>
  );
}
