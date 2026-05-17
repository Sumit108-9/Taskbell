import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useTheme } from '@/backend/hooks/useTheme';
import { useTasks } from '@/backend/hooks/useTasks';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { PrioritySelector } from '@/frontend/components/PrioritySelector';
import { CategoryPicker } from '@/frontend/components/CategoryPicker';
import { ReminderPicker } from '@/frontend/components/ReminderPicker';
import { RepeatPicker } from '@/frontend/components/RepeatPicker';
import { Priority, RepeatType } from '@/backend/types';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/frontend/constants/Colors';

export default function AddTask() {
  const { theme } = useTheme();
  const { addTask } = useTasks();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [reminder, setReminder] = useState<number | null>(15);
  const [repeat, setRepeat] = useState<RepeatType>('none');
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a task title.');
      return;
    }
    setSaving(true);
    try {
      await addTask({
        title: title.trim(),
        description: desc.trim() || undefined,
        category,
        priority,
        dueDate: date ? date.toISOString() : null,
        dueTime: time,
        reminderMinutes: reminder,
        repeat,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.wrap, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBox, { backgroundColor: theme.inputBg }]}>
          <Ionicons name="chevron-back" size={20} color={theme.muted} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add New Task</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.screenH, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Task Title">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
            placeholderTextColor={theme.muted}
            style={[styles.input, styles.titleInput, { backgroundColor: theme.inputBg, color: theme.text }]}
          />
        </Field>

        <Field label="Description">
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Add notes..."
            placeholderTextColor={theme.muted}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.descInput, { backgroundColor: theme.inputBg, color: theme.text }]}
          />
        </Field>

        <Field label="Category">
          <CategoryPicker value={category} onChange={setCategory} />
        </Field>

        <Field label="Priority">
          <PrioritySelector value={priority} onChange={setPriority} />
        </Field>

        <View style={styles.rowFields}>
          <View style={{ flex: 1 }}>
            <Field label="Date">
              <Pressable
                onPress={() => setShowDate(true)}
                style={[styles.input, styles.iconRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
              >
                <Ionicons name="calendar-outline" size={14} color={Colors.PRIMARY_BLUE} />
                <Text style={{ color: date ? theme.text : theme.muted, fontFamily: Typography.family.semibold, fontSize: 13 }}>
                  {date ? format(date, 'MMM d, yyyy') : 'Select date'}
                </Text>
              </Pressable>
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Time">
              <Pressable
                onPress={() => setShowTime(true)}
                style={[styles.input, styles.iconRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
              >
                <Ionicons name="time-outline" size={14} color={Colors.PRIMARY_BLUE} />
                <Text style={{ color: time ? theme.text : theme.muted, fontFamily: Typography.family.semibold, fontSize: 13 }}>
                  {time || 'Select time'}
                </Text>
              </Pressable>
            </Field>
          </View>
        </View>

        {showDate && (
          <DateTimePicker
            value={date ?? new Date()}
            mode="date"
            onChange={(_, d) => {
              setShowDate(Platform.OS === 'ios');
              if (d) setDate(d);
            }}
          />
        )}
        {showTime && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            onChange={(_, t) => {
              setShowTime(Platform.OS === 'ios');
              if (t) {
                const hh = String(t.getHours()).padStart(2, '0');
                const mm = String(t.getMinutes()).padStart(2, '0');
                setTime(`${hh}:${mm}`);
              }
            }}
          />
        )}

        <Field label="Reminder">
          <ReminderPicker value={reminder} onChange={setReminder} />
        </Field>

        <Field label="Repeat">
          <RepeatPicker value={repeat} onChange={setRepeat} />
        </Field>

        <Pressable onPress={save} disabled={saving} style={{ marginTop: 8 }}>
          <LinearGradient
            colors={['#2563EB', '#1d4ed8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveBtn}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Task'}</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={[styles.label, { color: theme.muted }]}>{label.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontFamily: Typography.family.extrabold },
  label: { fontSize: 12.5, fontFamily: Typography.family.bold, letterSpacing: 0.3, marginBottom: 6 },
  input: {
    borderRadius: Spacing.radius.input,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: Typography.family.medium,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  titleInput: { fontSize: 14, fontFamily: Typography.family.medium },
  descInput: { minHeight: 80, textAlignVertical: 'top', lineHeight: 21 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowFields: { flexDirection: 'row', gap: 12 },
  saveBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: Spacing.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  saveText: { color: '#fff', fontFamily: Typography.family.bold, fontSize: 15.5 },
});
