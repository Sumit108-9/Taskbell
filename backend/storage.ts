import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, AppSettings, defaultSettings } from '@/backend/types';

const KEYS = {
  TASKS: '@taskbell/tasks',
  SETTINGS: '@taskbell/settings',
  ONBOARDED: '@taskbell/hasOnboarded',
};

export async function getTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TASKS);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(s: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
}

export async function getHasOnboarded(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.ONBOARDED);
  return v === 'true';
}

export async function setHasOnboarded(v: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDED, v ? 'true' : 'false');
}

export const StorageKeys = KEYS;
