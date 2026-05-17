import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/backend/hooks/useTheme';
import { Typography } from '@/frontend/constants/Typography';

interface Props {
  label: string;
  count?: number;
  right?: React.ReactNode;
}

export function SectionLabel({ label, count, right }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.muted }]}>
        {label.toUpperCase()}
        {typeof count === 'number' ? `  ·  ${count}` : ''}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontFamily: Typography.family.bold,
    letterSpacing: 1.2,
  },
});
