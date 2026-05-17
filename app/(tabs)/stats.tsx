import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { startOfWeek, addDays, isSameDay, format, parseISO } from 'date-fns';
import { useTheme } from '@/backend/hooks/useTheme';
import { useTasks } from '@/backend/hooks/useTasks';
import { Colors, categoryColors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { SectionLabel } from '@/frontend/components/SectionLabel';
import { isOverdue } from '@/backend/taskHelpers';

const SIZE = 160;
const STROKE = 16;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export default function Stats() {
  const { theme } = useTheme();
  const { tasks } = useTasks();
  const insets = useSafeAreaInsets();

  const completed = tasks.filter((t) => t.isCompleted).length;
  const pending = tasks.filter((t) => !t.isCompleted && !isOverdue(t)).length;
  const overdue = tasks.filter((t) => isOverdue(t)).length;
  const total = tasks.length || 1;
  const pct = Math.round((completed / total) * 100);

  const week = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, []);

  const weekCounts = useMemo(() => {
    return week.map((d) =>
      tasks.filter(
        (t) =>
          (t.completedAt && isSameDay(parseISO(t.completedAt), d)) ||
          (t.dueDate && isSameDay(parseISO(t.dueDate), d) && t.isCompleted),
      ).length,
    );
  }, [tasks, week]);
  const maxCount = Math.max(...weekCounts, 1);

  const ringProgress = useSharedValue(0);
  useEffect(() => {
    ringProgress.value = withTiming(pct / 100, { duration: 900 });
  }, [pct]);
  const animRing = useAnimatedStyle(() => ({} as any));

  const categories = ['Work', 'Personal', 'Health', 'Finance'];

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 120, paddingHorizontal: Spacing.screenH }}
    >
      <Text style={[styles.h1, { color: theme.text }]}>Insights</Text>

      <View style={[styles.ringCard, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <View style={{ alignItems: 'center' }}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={theme.inputBg} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={Colors.PRIMARY_BLUE}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${CIRC} ${CIRC}`}
              strokeDashoffset={CIRC * (1 - pct / 100)}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.pct, { color: theme.text }]}>{pct}%</Text>
            <Text style={[styles.pctLabel, { color: theme.muted }]}>Productivity</Text>
          </View>
        </View>
        <Text style={[styles.ringSub, { color: theme.muted }]}>This week · {total} tasks</Text>
        <View style={styles.trendBadge}>
          <Text style={styles.trendText}>↑ {Math.max(pct - 5, 0)}% vs last week</Text>
        </View>
      </View>

      <View style={[styles.summaryRow]}>
        <SmallStat color={Colors.SUCCESS_GREEN} label="Done" count={completed} pct={Math.round((completed / total) * 100)} />
        <SmallStat color={Colors.WARNING_ORANGE} label="Pending" count={pending} pct={Math.round((pending / total) * 100)} />
        <SmallStat color={Colors.DANGER_RED} label="Overdue" count={overdue} pct={Math.round((overdue / total) * 100)} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <SectionLabel label="This week" />
        <View style={styles.bars}>
          {week.map((d, i) => (
            <BarItem key={i} delay={i * 60} value={weekCounts[i] / maxCount} count={weekCounts[i]} day={format(d, 'EEE')} isToday={isSameDay(d, new Date())} theme={theme} />
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <SectionLabel label="Category breakdown" />
        {categories.map((c) => {
          const count = tasks.filter((t) => t.category === c).length;
          const p = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <View key={c} style={{ marginBottom: 12 }}>
              <View style={styles.catRow}>
                <Text style={[styles.catLabel, { color: theme.text }]}>{c}</Text>
                <Text style={[styles.catPct, { color: theme.muted }]}>{p}%</Text>
              </View>
              <View style={[styles.catTrack, { backgroundColor: theme.inputBg }]}>
                <View style={[styles.catFill, { width: `${p}%`, backgroundColor: categoryColors[c] }]} />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SmallStat({ color, label, count, pct }: { color: string; label: string; count: number; pct: number }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.smallCard, { backgroundColor: theme.card }, Spacing.shadow.card]}>
      <Text style={[styles.smallCount, { color }]}>{count}</Text>
      <Text style={[styles.smallLabel, { color: theme.muted }]}>{label}</Text>
      <Text style={[styles.smallPct, { color }]}>{pct}%</Text>
    </View>
  );
}

function BarItem({ delay, value, count, day, isToday, theme }: any) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(delay, withTiming(value, { duration: 600 }));
  }, [value]);
  const style = useAnimatedStyle(() => ({ height: `${Math.max(h.value * 100, 4)}%` }));
  return (
    <View style={styles.barCol}>
      <Text style={[styles.barCount, { color: theme.muted }]}>{count}</Text>
      <View style={[styles.barTrack, { backgroundColor: theme.inputBg }]}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: isToday ? Colors.PRIMARY_BLUE : theme.muted },
            style,
          ]}
        />
      </View>
      <Text style={[styles.barDay, { color: isToday ? Colors.PRIMARY_BLUE : theme.muted }]}>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 24, fontFamily: Typography.family.extrabold, marginBottom: 16 },
  ringCard: {
    borderRadius: Spacing.radius.card,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  pct: { fontSize: 34, fontFamily: Typography.family.extrabold },
  pctLabel: { fontSize: 11, fontFamily: Typography.family.semibold, letterSpacing: 1, marginTop: 2 },
  ringSub: { fontSize: 13, fontFamily: Typography.family.medium, marginTop: 8 },
  trendBadge: {
    backgroundColor: Colors.SUCCESS_GREEN + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    marginTop: 4,
  },
  trendText: { color: Colors.SUCCESS_GREEN, fontFamily: Typography.family.bold, fontSize: 12 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  smallCard: { flex: 1, padding: 14, borderRadius: Spacing.radius.card, gap: 2 },
  smallCount: { fontSize: 22, fontFamily: Typography.family.extrabold },
  smallLabel: { fontSize: 11, fontFamily: Typography.family.semibold, letterSpacing: 0.5 },
  smallPct: { fontSize: 12, fontFamily: Typography.family.bold, marginTop: 4 },
  card: { borderRadius: Spacing.radius.card, padding: 16, marginBottom: 12 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 140, gap: 8, paddingTop: 8 },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barCount: { fontSize: 11, fontFamily: Typography.family.semibold },
  barTrack: { flex: 1, width: '100%', borderRadius: 8, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 8 },
  barDay: { fontSize: 11, fontFamily: Typography.family.bold },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catLabel: { fontSize: 13.5, fontFamily: Typography.family.semibold },
  catPct: { fontSize: 12.5, fontFamily: Typography.family.bold },
  catTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: 4 },
});
