import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { useTheme } from '@/backend/hooks/useTheme';

interface Props {
  value: number | null;
  onChange: (mins: number | null) => void;
}

const OPTS = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hr', value: 60 },
];

export function ReminderPicker({ value, onChange }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      {OPTS.map((o) => {
        const active = value === o.value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(active ? null : o.value)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? Colors.PRIMARY_BLUE + '15' : 'transparent',
                borderColor: active ? Colors.PRIMARY_BLUE : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: active ? Colors.PRIMARY_BLUE : theme.muted,
                  fontFamily: active ? Typography.family.bold : Typography.family.medium,
                },
              ]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  text: { fontSize: 11 },
});
