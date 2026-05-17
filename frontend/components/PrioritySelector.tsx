import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { priorityColors, priorityBgLight, priorityBgDark } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { useTheme } from '@/backend/hooks/useTheme';
import { Priority } from '@/backend/types';

interface Props {
  value: Priority;
  onChange: (p: Priority) => void;
}

const OPTS: { full: Priority; short: string }[] = [
  { full: 'High', short: 'High' },
  { full: 'Medium', short: 'Med' },
  { full: 'Low', short: 'Low' },
];

export function PrioritySelector({ value, onChange }: Props) {
  const { theme, isDark } = useTheme();
  return (
    <View style={styles.row}>
      {OPTS.map((p) => {
        const active = value === p.full;
        const color = priorityColors[p.full];
        const bgTint = (isDark ? priorityBgDark : priorityBgLight)[p.full];
        return (
          <Pressable
            key={p.full}
            onPress={() => onChange(p.full)}
            style={[
              styles.btn,
              {
                backgroundColor: active ? bgTint : 'transparent',
                borderColor: active ? color : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: active ? color : theme.muted, fontFamily: active ? Typography.family.bold : Typography.family.medium },
              ]}
            >
              {p.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 5 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
  },
  text: { fontSize: 11 },
});
