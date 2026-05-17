import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/backend/hooks/useTheme';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { FilterType } from '@/backend/types';

interface Props {
  active: FilterType;
  onChange: (f: FilterType) => void;
  options?: FilterType[];
}

const DEFAULT_OPTS: FilterType[] = ['All', 'Today', 'Upcoming', 'Completed', 'Overdue'];

export function FilterChips({ active, onChange, options = DEFAULT_OPTS }: Props) {
  const { theme } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? Colors.PRIMARY_BLUE : theme.inputBg,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: isActive ? '#fff' : theme.muted },
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingRight: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99 },
  text: { fontSize: 13, fontFamily: Typography.family.semibold },
});
