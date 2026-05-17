import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import { useTheme } from '@/backend/hooks/useTheme';
import { useTasks } from '@/backend/hooks/useTasks';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { ChevronLeft, ChevronRight } from '@/frontend/components/icons';
import { TaskCard } from '@/frontend/components/TaskCard';
import { EmptyState } from '@/frontend/components/EmptyState';
import { SectionLabel } from '@/frontend/components/SectionLabel';
import { tasksOnDate } from '@/backend/taskHelpers';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarScreen() {
  const { theme } = useTheme();
  const { tasks, toggleComplete } = useTasks();
  const insets = useSafeAreaInsets();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const taskDays = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.dueDate) set.add(format(parseISO(t.dueDate), 'yyyy-MM-dd'));
    });
    return set;
  }, [tasks]);

  const dayTasks = useMemo(() => tasksOnDate(tasks, selected), [tasks, selected]);

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg, paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => setCursor(addMonths(cursor, -1))} style={styles.navBtn}>
          <ChevronLeft size={20} color={theme.text} />
        </Pressable>
        <Text style={[styles.month, { color: theme.text }]}>{format(cursor, 'MMMM yyyy')}</Text>
        <Pressable onPress={() => setCursor(addMonths(cursor, 1))} style={styles.navBtn}>
          <ChevronRight size={20} color={theme.text} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={[styles.weekday, { color: theme.muted }]}>{w}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((d) => {
          const inMonth = isSameMonth(d, cursor);
          const isSelected = isSameDay(d, selected);
          const isToday = isSameDay(d, new Date());
          const has = taskDays.has(format(d, 'yyyy-MM-dd'));
          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => setSelected(d)}
              style={[
                styles.cell,
                {
                  backgroundColor: isSelected
                    ? Colors.PRIMARY_BLUE
                    : isToday
                    ? Colors.PRIMARY_BLUE + '22'
                    : 'transparent',
                  opacity: inMonth ? 1 : 0.3,
                },
              ]}
            >
              <Text
                style={{
                  color: isSelected ? '#fff' : theme.text,
                  fontFamily: Typography.family.semibold,
                  fontSize: 13.5,
                }}
              >
                {format(d, 'd')}
              </Text>
              {has ? (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: isSelected ? '#fff' : Colors.PRIMARY_BLUE },
                  ]}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: Spacing.screenH, marginTop: 16, flex: 1 }}>
        <SectionLabel label={format(selected, 'MMM d')} count={dayTasks.length} />
        <FlatList
          data={dayTasks}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={() => toggleComplete(item.id)}
              onPress={() => router.push(`/task/${item.id}` as any)}
            />
          )}
          ListEmptyComponent={<EmptyState emoji="🗓️" title="No tasks on this day." />}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>
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
    marginBottom: 14,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  month: { fontSize: 18, fontFamily: Typography.family.bold },
  weekRow: { flexDirection: 'row', paddingHorizontal: Spacing.screenH, marginBottom: 8 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: Typography.family.bold, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.screenH - 4 },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 2,
  },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
});
