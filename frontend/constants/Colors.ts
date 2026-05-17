export const Colors = {
  PRIMARY_BLUE: '#2563EB',
  BG_LIGHT: '#F8FAFC',
  BG_DARK: '#0F172A',
  CARD_LIGHT: '#FFFFFF',
  CARD_DARK: '#1E293B',
  TEXT_DARK: '#0F172A',
  TEXT_LIGHT: '#F8FAFC',
  MUTED: '#64748B',
  MUTED_DARK: '#94A3B8',
  BORDER_LIGHT: '#E2E8F0',
  BORDER_DARK: '#334155',
  INPUT_BG_LIGHT: '#F1F5F9',
  INPUT_BG_DARK: '#334155',
  SUCCESS_GREEN: '#22C55E',
  WARNING_ORANGE: '#F97316',
  DANGER_RED: '#EF4444',
  PURPLE: '#8B5CF6',
};

export type ThemeTokens = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  inputBg: string;
  navBg: string;
  statCard: string;
  primary: string;
  isDark: boolean;
};

export const lightTheme: ThemeTokens = {
  bg: Colors.BG_LIGHT,
  card: Colors.CARD_LIGHT,
  text: Colors.TEXT_DARK,
  muted: Colors.MUTED,
  border: Colors.BORDER_LIGHT,
  inputBg: Colors.INPUT_BG_LIGHT,
  navBg: Colors.CARD_LIGHT,
  statCard: Colors.INPUT_BG_LIGHT,
  primary: Colors.PRIMARY_BLUE,
  isDark: false,
};

export const darkTheme: ThemeTokens = {
  bg: Colors.BG_DARK,
  card: Colors.CARD_DARK,
  text: Colors.TEXT_LIGHT,
  muted: Colors.MUTED_DARK,
  border: Colors.BORDER_DARK,
  inputBg: Colors.INPUT_BG_DARK,
  navBg: Colors.CARD_DARK,
  statCard: '#273549',
  primary: Colors.PRIMARY_BLUE,
  isDark: true,
};

export const priorityColors: Record<string, string> = {
  High: Colors.DANGER_RED,
  Medium: Colors.WARNING_ORANGE,
  Low: Colors.SUCCESS_GREEN,
};

export const priorityBgLight: Record<string, string> = {
  High: '#FEF2F2',
  Medium: '#FFF7ED',
  Low: '#F0FDF4',
};

export const priorityBgDark: Record<string, string> = {
  High: '#3B0F0F',
  Medium: '#3B1F00',
  Low: '#052E16',
};

export const categoryColors: Record<string, string> = {
  Work: Colors.PRIMARY_BLUE,
  Personal: Colors.PURPLE,
  Health: Colors.SUCCESS_GREEN,
  Finance: Colors.WARNING_ORANGE,
};

export const themeSwatches = [
  { name: 'Blue', color: Colors.PRIMARY_BLUE },
  { name: 'Purple', color: Colors.PURPLE },
  { name: 'Green', color: Colors.SUCCESS_GREEN },
  { name: 'Orange', color: Colors.WARNING_ORANGE },
];
