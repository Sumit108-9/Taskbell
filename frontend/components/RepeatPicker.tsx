import React, { useState } from 'react';
import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { useTheme } from '@/backend/hooks/useTheme';
import { RepeatType } from '@/backend/types';

const LABELS: Record<RepeatType, string> = {
  none: 'None',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

interface Props {
  value: RepeatType;
  onChange: (v: RepeatType) => void;
}

export function RepeatPicker({ value, onChange }: Props) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={[styles.row, { backgroundColor: theme.inputBg }]}>
        <Text style={[styles.text, { color: theme.text }]}>{LABELS[value]}</Text>
        <Text style={[styles.chev, { color: theme.muted }]}>›</Text>
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.card }]} onPress={() => {}}>
            <Text style={[styles.title, { color: theme.text }]}>Repeat</Text>
            {(Object.keys(LABELS) as RepeatType[]).map((k) => (
              <Pressable
                key={k}
                onPress={() => {
                  onChange(k);
                  setOpen(false);
                }}
                style={[styles.opt, { borderBottomColor: theme.border }]}
              >
                <Text style={[styles.optText, { color: theme.text }]}>{LABELS[k]}</Text>
                {value === k ? <Text style={{ color: theme.primary }}>✓</Text> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Spacing.radius.input,
  },
  text: { flex: 1, fontFamily: Typography.family.semibold, fontSize: 14.5 },
  chev: { fontSize: 22 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    padding: 20,
    borderTopLeftRadius: Spacing.radius.sheet,
    borderTopRightRadius: Spacing.radius.sheet,
    paddingBottom: 32,
  },
  title: { fontFamily: Typography.family.bold, fontSize: 18, marginBottom: 14 },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optText: { fontSize: 15, fontFamily: Typography.family.semibold },
});
