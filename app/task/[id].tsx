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

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Task Details</Text>
        <Pressable style={styles.iconBtn}>
          <Edit size={20} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.screenH, paddingBottom: 120 }}>
        <View style={styles.metaRow}>
          <View style={[styles.priBadge, { backgroundColor: priBg }]}>
            <Text style={[styles.priText, { color: priCol }]}>{task.priority} Priority</Text>
          </View>
          <View style={[styles.catChip, { backgroundColor: catCol + '22' }]}>
            <Text style={[styles.catText, { color: catCol }]}>{task.category}</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
        {task.description ? <Text style={[styles.desc, { color: theme.muted }]}>{task.description}</Text> : null}

        <LinearGradient
          colors={cdColors[cd.tone]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.countdown}
        >
          <Text style={styles.cdLabel}>{cd.tone === 'overdue' ? 'OVERDUE' : cd.tone === 'today' ? 'DUE TODAY' : 'UPCOMING'}</Text>
          <Text style={styles.cdValue}>{cd.label}</Text>
        </LinearGradient>

        <View style={styles.infoGrid}>
          <InfoCell label="Date" value={task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : '—'} />
          <InfoCell label="Time" value={task.dueTime ? formatTime(task.dueTime) : '—'} />
          <InfoCell label="Reminder" value={task.reminderMinutes != null ? `${task.reminderMinutes} min before` : 'None'} />
          <InfoCell label="Repeat" value={REPEAT_LABEL[task.repeat] || 'Never'} />
        </View>

        <SectionLabel label="Subtasks" count={task.subtasks.length} right={
          <Text style={{ color: theme.muted, fontFamily: Typography.family.semibold, fontSize: 12 }}>
            {doneSubs}/{task.subtasks.length}
          </Text>
        } />
        <View style={[styles.progressTrack, { backgroundColor: theme.inputBg }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={{ marginTop: 8 }}>
          {task.subtasks.map((s) => (
            <SubtaskItem key={s.id} subtask={s} onToggle={() => toggleSub(s.id)} />
          ))}
          <View style={[styles.addSubRow, { backgroundColor: theme.inputBg }]}>
            <TextInput
              value={newSubtask}
              onChangeText={setNewSubtask}
              onSubmitEditing={addSubtask}
              placeholder="+ Add subtask"
              placeholderTextColor={theme.muted}
              style={[styles.addSubInput, { color: theme.text }]}
            />
          </View>
        </View>

        <Pressable onPress={() => toggleComplete(task.id)} style={{ marginTop: 24 }}>
          <LinearGradient
            colors={task.isCompleted ? ['#64748B', '#475569'] : ['#16A34A', '#22C55E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionBtn}
          >
            <Text style={styles.actionText}>{task.isCompleted ? 'Mark as Pending' : 'Mark as Done'}</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          style={[styles.outlineBtn, { borderColor: Colors.PRIMARY_BLUE }]}
          onPress={() => Alert.alert('Edit Task', 'Edit flow coming soon.')}
        >
          <Text style={[styles.outlineText, { color: Colors.PRIMARY_BLUE }]}>Edit Task</Text>
        </Pressable>

        <Pressable onPress={handleDelete} style={[styles.outlineBtn, { borderColor: Colors.DANGER_RED }]}>
          <Trash size={16} color={Colors.DANGER_RED} />
          <Text style={[styles.outlineText, { color: Colors.DANGER_RED, marginLeft: 8 }]}>Delete Task</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.infoCell, { backgroundColor: theme.card }, Spacing.shadow.card]}>
      <Text style={[styles.infoLabel, { color: theme.muted }]}>{label.toUpperCase()}</Text>
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
