import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/backend/hooks/useTheme';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';

interface Props {
  count: number;
  label: string;
  color: string;
}

export function StatCard({ count, label, color }: Props) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.statCard }]}>
      <Text style={[styles.count, { color }]}>{count}</Text>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Spacing.radius.card,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  count: { fontSize: 20, fontFamily: Typography.family.extrabold },
  label: { fontSize: 10, fontFamily: Typography.family.semibold, marginTop: 2, letterSpacing: 0.4 },
});
