import { createContext, useContext } from 'react';
import { AppSettings, defaultSettings } from '@/backend/types';

export interface SettingsContextValue {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  updateSetting: async () => {},
});

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
