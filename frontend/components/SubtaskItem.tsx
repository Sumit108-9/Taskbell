import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { useTheme } from '@/backend/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Subtask } from '@/backend/types';

interface Props {
  subtask: Subtask;
  onToggle: () => void;
}

export function SubtaskItem({ subtask, onToggle }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onToggle} style={styles.row}>
      <View
        style={[
          styles.box,
          {
            borderColor: subtask.done ? Colors.SUCCESS_GREEN : theme.border,
            backgroundColor: subtask.done ? Colors.SUCCESS_GREEN : 'transparent',
          },
        ]}
      >
        {subtask.done ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
      </View>
      <Text
        style={[
          styles.text,
          {
            color: theme.text,
            textDecorationLine: subtask.done ? 'line-through' : 'none',
            opacity: subtask.done ? 0.6 : 1,
          },
        ]}
      >
        {subtask.text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 14, fontFamily: Typography.family.medium, flex: 1 },
});
