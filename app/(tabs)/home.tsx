import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, RefreshControl, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, parseISO } from 'date-fns';
import { useTheme } from '@/backend/hooks/useTheme';
import { useTasks } from '@/backend/hooks/useTasks';
import { useSettings } from '@/backend/hooks/useSettings';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { TaskCard } from '@/frontend/components/TaskCard';
import { FilterChips } from '@/frontend/components/FilterChips';
import { EmptyState } from '@/frontend/components/EmptyState';
import { FilterType, Task } from '@/backend/types';
import { isOverdue } from '@/backend/taskHelpers';

export default function Home() {
  const { theme } = useTheme();
  const { tasks, toggleComplete, getTasksByFilter, refresh } = useTasks();
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('All');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(() => {
    const today = tasks.filter((t) => t.dueDate && isToday(parseISO(t.dueDate))).length;
    const pending = tasks.filter((t) => !t.isCompleted).length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const overdue = tasks.filter((t) => isOverdue(t)).length;
    return { today, pending, completed, overdue };
  }, [tasks]);

  const filtered = useMemo(() => {
    let list = getTasksByFilter(filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, filter, search, getTasksByFilter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const stats4 = [
    { label: 'Today', count: stats.today, color: Colors.PRIMARY_BLUE },
    { label: 'Pending', count: stats.pending, color: Colors.WARNING_ORANGE },
    { label: 'Done', count: stats.completed, color: Colors.SUCCESS_GREEN },
    { label: 'Overdue', count: stats.overdue, color: Colors.DANGER_RED },
  ];

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg }]}>
      {/* Header gradient overlay */}
      <LinearGradient
        pointerEvents="none"
        colors={[Colors.PRIMARY_BLUE + (theme.isDark ? '22' : '12'), 'transparent']}
        style={[styles.headerGradient, { height: insets.top + 200 }]}
      />

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.PRIMARY_BLUE} />
        }
        ListHeaderComponent={
          <>
            {/* Greeting */}
            <View style={[styles.headerPad, { paddingHorizontal: Spacing.screenH }]}>
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.greet, { color: theme.muted }]}>{greeting} 👋</Text>
                  <Text style={[styles.name, { color: theme.text }]}>{settings.userName}</Text>
                </View>
                <LinearGradient
                  colors={[Colors.PRIMARY_BLUE, Colors.PURPLE]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>👤</Text>
                </LinearGradient>
              </View>
              <Text style={[styles.date, { color: theme.muted }]}>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </Text>

              {/* Search bar */}
              <View
                style={[
                  styles.searchWrap,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                ]}
              >
                <Ionicons name="search" size={16} color={theme.muted} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search tasks..."
                  placeholderTextColor={theme.muted}
                  style={[styles.searchInput, { color: theme.text }]}
                />
              </View>
            </View>

            {/* Stats grid */}
            <View style={[styles.statsRow, { paddingHorizontal: Spacing.screenH }]}>
              {stats4.map((s) => (
                <View
                  key={s.label}
                  style={[
                    styles.statCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    Spacing.shadow.card,
                  ]}
                >
                  <Text style={[styles.statCount, { color: s.color }]}>{s.count}</Text>
                  <Text style={[styles.statLabel, { color: theme.muted }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Filter chips */}
            <View style={styles.chipsWrap}>
              <FilterChips active={filter} onChange={setFilter} />
            </View>

            {/* Section header */}
            <View style={[styles.sectionRow, { paddingHorizontal: Spacing.screenH }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {filter === 'All' ? "Today's Tasks" : `${filter} Tasks`}
              </Text>
              <Text style={[styles.sectionCount, { color: theme.muted }]}>
                {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }: { item: Task }) => (
          <View style={{ paddingHorizontal: Spacing.screenH }}>
            <TaskCard
              task={item}
              onToggle={() => toggleComplete(item.id)}
              onPress={() => router.push(`/task/${item.id}` as any)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={{ paddingHorizontal: Spacing.screenH }}>
            <EmptyState
              emoji={filter === 'Completed' ? '🎉' : '📭'}
              title={tasks.length === 0 ? 'No tasks yet!' : `No ${filter.toLowerCase()} tasks`}
              subtitle={
                tasks.length === 0 ? 'Tap + to add your first task.' : "You're all caught up!"
              }
              ctaLabel={tasks.length === 0 ? '+ Add Task' : undefined}
              onCta={() => router.push('/(tabs)/add' as any)}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerPad: { paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  greet: { fontSize: 13, fontFamily: Typography.family.medium },
  name: { fontSize: 22, fontFamily: Typography.family.extrabold, marginTop: 2 },
  date: { fontSize: 12.5, fontFamily: Typography.family.medium, marginTop: 4, marginBottom: 16 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: Spacing.radius.input,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    fontFamily: Typography.family.medium,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statCount: { fontSize: 20, fontFamily: Typography.family.extrabold },
  statLabel: {
    fontSize: 10,
    fontFamily: Typography.family.semibold,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  chipsWrap: { paddingLeft: Spacing.screenH, marginBottom: 16 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 14, fontFamily: Typography.family.bold },
  sectionCount: { fontSize: 12, fontFamily: Typography.family.medium },
});
