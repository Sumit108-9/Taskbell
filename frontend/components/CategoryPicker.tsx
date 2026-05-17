import React, { useState } from 'react';
import { Modal, Pressable, Text, View, StyleSheet, TextInput } from 'react-native';
import { categoryColors, Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { useTheme } from '@/backend/hooks/useTheme';

const DEFAULT_CATS = ['Work', 'Personal', 'Health', 'Finance'];

interface Props {
  value: string;
  onChange: (c: string) => void;
}

export function CategoryPicker({ value, onChange }: Props) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');
  const color = categoryColors[value] ?? Colors.PRIMARY_BLUE;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.row, { backgroundColor: theme.inputBg }]}
      >
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.text, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.chev, { color: theme.muted }]}>›</Text>
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.card }]} onPress={() => {}}>
            <Text style={[styles.title, { color: theme.text }]}>Select Category</Text>
            {DEFAULT_CATS.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  onChange(c);
                  setOpen(false);
                }}
                style={[styles.opt, { borderBottomColor: theme.border }]}
              >
                <View style={[styles.dot, { backgroundColor: categoryColors[c] }]} />
                <Text style={[styles.optText, { color: theme.text }]}>{c}</Text>
              </Pressable>
            ))}
            <View style={styles.customRow}>
              <TextInput
                value={custom}
                onChangeText={setCustom}
                placeholder="+ Custom category"
                placeholderTextColor={theme.muted}
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
                onSubmitEditing={() => {
                  if (custom.trim()) {
                    onChange(custom.trim());
                    setCustom('');
                    setOpen(false);
                  }
                }}
              />
            </View>
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
    gap: 10,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
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
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  optText: { fontSize: 15, fontFamily: Typography.family.semibold },
  customRow: { marginTop: 14 },
  input: {
    padding: 14,
    borderRadius: Spacing.radius.input,
    fontSize: 14,
    fontFamily: Typography.family.medium,
  },
});
