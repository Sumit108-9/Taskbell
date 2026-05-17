import { createContext, useContext } from 'react';
import { ThemeTokens, lightTheme } from '@/frontend/constants/Colors';

export interface ThemeContextValue {
  isDark: boolean;
  theme: ThemeTokens;
  toggleDark: () => void;
  setDarkMode: (v: boolean | 'system') => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  theme: lightTheme,
  toggleDark: () => {},
  setDarkMode: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
