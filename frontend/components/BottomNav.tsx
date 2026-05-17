import React from 'react';
import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/backend/hooks/useTheme';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: 'home',
  calendar: 'calendar',
  stats: 'stats-chart',
  settings: 'settings-sharp',
};

const LABELS: Record<string, string> = {
  home: 'Home',
  calendar: 'Calendar',
  stats: 'Stats',
  settings: 'Settings',
};

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Order: home, calendar, add(FAB), stats, settings
  const order = ['home', 'calendar', 'add', 'stats', 'settings'];
  const routes = order
    .map((n) => state.routes.find((r) => r.name === n))
    .filter(Boolean) as typeof state.routes;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.navBg,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
      ]}
    >
      {routes.map((route) => {
        const idxInState = state.routes.findIndex((r) => r.key === route.key);
        const isFocused = state.index === idxInState;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        if (route.name === 'add') {
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.fabWrap}>
              <LinearGradient
                colors={['#1d4ed8', '#2563EB', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.fab, Spacing.shadow.fab]}
              >
                <Ionicons name="add" size={28} color="#fff" />
              </LinearGradient>
            </Pressable>
          );
        }

        const iconName = ICONS[route.name];
        const color = isFocused ? Colors.PRIMARY_BLUE : theme.muted;
        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            {iconName ? <Ionicons name={iconName} size={22} color={color} /> : null}
            <Text style={[styles.label, { color }]}>{LABELS[route.name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    minHeight: 72,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontSize: 10.5, fontFamily: Typography.family.semibold },
  fabWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -8 }],
  },
});
