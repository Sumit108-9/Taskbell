import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/backend/hooks/useTheme';
import { useTasks } from '@/backend/hooks/useTasks';
import { Colors, categoryColors, priorityColors, priorityBgLight, priorityBgDark } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { Ionicons } from '@expo/vector-icons';
import { formatCountdown, formatTime } from '@/backend/taskHelpers';
import { format, parseISO } from 'date-fns';
import { Subtask } from '@/backend/types';
import { generateId } from '@/backend/uuid';

const REPEAT_LABEL: Record<string, string> = { none: 'Never', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, updateTask, deleteTask, toggleComplete } = useTasks();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [newSubtask, setNewSubtask] = useState('');

  const task = id ? getTaskById(id) : undefined;

  if (!task) {
    return (
      <View style={[styles.wrap, { backgroundColor: theme.bg, paddingTop: insets.top + 20, alignItems: 'center' }]}>
        <Text style={{ color: theme.text, fontFamily: Typography.family.bold }}>Task not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ color: Colors.PRIMARY_BLUE, fontFamily: Typography.family.semibold }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const cd = formatCountdown(task);
  const cdColors: Record<string, [string, string]> = {
    overdue: ['#EF4444', '#B91C1C'],
    today: ['#F97316', '#C2410C'],
    upcoming: ['#3b82f6', '#1d4ed8'],
    none: ['#64748B', '#475569'],
  };

  const handleDelete = () => {
    Alert.alert('Delete Task?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(task.id);
          router.back();
        },
      },
    ]);
  };

  const addSubtask = () => {
    const text = newSubtask.trim();
    if (!text) return;
    const s: Subtask = { id: generateId(), text, done: false };
    updateTask(task.id, { subtasks: [...task.subtasks, s] });
    setNewSubtask('');
  };

  const toggleSub = (sid: string) => {
    const subs = task.subtasks.map((s) => (s.id === sid ? { ...s, done: !s.done } : s));
    updateTask(task.id, { subtasks: subs });
  };

  const doneSubs = task.subtasks.filter((s) => s.done).length;
  const progress = task.subtasks.length > 0 ? doneSubs / task.subtasks.length : 0;
  const priBg = (isDark ? priorityBgDark : priorityBgLight)[task.priority];
  const priCol = priorityColors[task.priority];
  const catCol = categoryColors[task.category] ?? Colors.PRIMARY_BLUE;

  const countdownTitle = cd.tone === 'overdue' ? 'OVERDUE' : cd.tone === 'today' ? 'DUE TODAY' : cd.tone === 'upcoming' ? 'DEADLINE' : 'NO DEADLINE';
  const cdTint = cdColors[cd.tone][0];

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="chevron-back" size={20} color={theme.muted} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Task Details</Text>
        </View>
        <Pressable style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
          <Ionicons name="create-outline" size={18} color={Colors.PRIMARY_BLUE} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.screenH, paddingBottom: 120 }}>
        {/* Priority badge + category */}
        <View style={styles.metaRow}>
          <View style={[styles.priBadge, { backgroundColor: priBg }]}>
            <Text style={[styles.priText, { color: priCol }]}>● {task.priority} Priority</Text>
          </View>
          <View style={[styles.catChip, { backgroundColor: catCol + '18' }]}>
            <Text style={[styles.catText, { color: catCol }]}>{task.category}</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
        {task.description ? (
          <Text style={[styles.desc, { color: theme.muted }]}>{task.description}</Text>
        ) : null}

        {/* Countdown card */}
        <View
          style={[
            styles.countdown,
            { backgroundColor: cdTint + '18', borderColor: cdTint + '30' },
          ]}
        >
          <View style={[styles.cdIcon, { backgroundColor: cdTint + '20' }]}>
            <Ionicons name="alarm-outline" size={20} color={cdTint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cdLabel, { color: theme.muted }]}>{countdownTitle}</Text>
            <Text style={[styles.cdValue, { color: cdTint }]}>{cd.label}</Text>
          </View>
        </View>

        {/* Info grid 2x2 */}
        <View style={styles.infoGrid}>
          <InfoCell
            icon="calendar-outline"
            label="Date"
            value={task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : '—'}
          />
          <InfoCell
            icon="time-outline"
            label="Time"
            value={task.dueTime ? formatTime(task.dueTime) : '—'}
          />
          <InfoCell
            icon="notifications-outline"
            label="Reminder"
            value={task.reminderMinutes != null ? `${task.reminderMinutes} min before` : 'None'}
          />
          <InfoCell icon="repeat" label="Repeat" value={REPEAT_LABEL[task.repeat] || 'Never'} />
        </View>

        {/* Subtasks */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.subtaskHeader, { color: theme.text }]}>
            Subtasks ({doneSubs}/{task.subtasks.length})
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          {task.subtasks.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => toggleSub(s.id)}
              style={[styles.subtaskRow, { borderBottomColor: theme.border }]}
            >
              <View
                style={[
                  styles.subtaskCheck,
                  {
                    borderColor: s.done ? Colors.SUCCESS_GREEN : theme.border,
                    backgroundColor: s.done ? Colors.SUCCESS_GREEN : 'transparent',
                  },
                ]}
              >
                {s.done ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
              </View>
              <Text
                style={[
                  styles.subtaskText,
                  {
                    color: s.done ? theme.muted : theme.text,
                    textDecorationLine: s.done ? 'line-through' : 'none',
                  },
                ]}
              >
                {s.text}
              </Text>
            </Pressable>
          ))}
          <View style={[styles.addSubRow, { borderBottomColor: theme.border }]}>
            <Ionicons name="add" size={18} color={theme.muted} />
            <TextInput
              value={newSubtask}
              onChangeText={setNewSubtask}
              onSubmitEditing={addSubtask}
              placeholder="Add subtask"
              placeholderTextColor={theme.muted}
              style={[styles.addSubInput, { color: theme.text }]}
            />
          </View>
        </View>

        {/* Mark as Done */}
        <Pressable onPress={() => toggleComplete(task.id)} style={{ marginBottom: 10 }}>
          <LinearGradient
            colors={task.isCompleted ? ['#64748B', '#475569'] : ['#22C55E', '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionBtn}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.actionText}>
              {task.isCompleted ? 'Mark as Pending' : 'Mark as Done'}
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Edit + Delete row */}
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.outlineBtn, { borderColor: Colors.PRIMARY_BLUE }]}
            onPress={() => Alert.alert('Edit Task', 'Edit flow coming soon.')}
          >
            <Ionicons name="create-outline" size={15} color={Colors.PRIMARY_BLUE} />
            <Text style={[styles.outlineText, { color: Colors.PRIMARY_BLUE }]}>Edit Task</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={[styles.outlineBtn, { borderColor: Colors.DANGER_RED }]}
          >
            <Ionicons name="trash-outline" size={15} color={Colors.DANGER_RED} />
            <Text style={[styles.outlineText, { color: Colors.DANGER_RED }]}>Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={[styles.infoCell, { backgroundColor: theme.inputBg }]}>
      <View style={styles.infoIconRow}>
        <Ionicons name={icon} size={13} color={Colors.PRIMARY_BLUE} />
        <Text style={[styles.infoLabel, { color: theme.muted }]}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
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
    paddingBottom: 8,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: Typography.family.bold },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  priBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Spacing.radius.pill },
  priText: { fontSize: 11.5, fontFamily: Typography.family.bold },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Spacing.radius.pill },
  catText: { fontSize: 11.5, fontFamily: Typography.family.semibold },
  title: { fontSize: 24, fontFamily: Typography.family.extrabold, marginBottom: 8 },
  desc: { fontSize: 14, fontFamily: Typography.family.medium, lineHeight: 21, marginBottom: 18 },
  countdown: { padding: 18, borderRadius: Spacing.radius.card, marginVertical: 8, gap: 4 },
  cdLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: Typography.family.bold, letterSpacing: 1.2 },
  cdValue: { color: '#fff', fontSize: 18, fontFamily: Typography.family.extrabold },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 16 },
  infoCell: { width: '47%', padding: 14, borderRadius: Spacing.radius.card, flexGrow: 1 },
  infoLabel: { fontSize: 10, fontFamily: Typography.family.bold, letterSpacing: 0.8, marginBottom: 4 },
  infoValue: { fontSize: 14, fontFamily: Typography.family.semibold },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.PRIMARY_BLUE, borderRadius: 3 },
  addSubRow: { borderRadius: Spacing.radius.input, paddingHorizontal: 14, marginTop: 8 },
  addSubInput: { paddingVertical: 12, fontSize: 14, fontFamily: Typography.family.medium },
  actionBtn: { height: 54, borderRadius: Spacing.radius.button, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#fff', fontFamily: Typography.family.bold, fontSize: 15.5 },
  outlineBtn: {
    flexDirection: 'row',
    height: 50,
    borderRadius: Spacing.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginTop: 12,
  },
  outlineText: { fontFamily: Typography.family.bold, fontSize: 15 },
});
