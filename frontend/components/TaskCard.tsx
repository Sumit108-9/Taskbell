import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/backend/types';
import { useTheme } from '@/backend/hooks/useTheme';
import { Colors, priorityColors, priorityBgLight, priorityBgDark, categoryColors } from '@/frontend/constants/Colors';
import { Spacing } from '@/frontend/constants/Spacing';
import { Typography } from '@/frontend/constants/Typography';
import { formatDeadline, isOverdue } from '@/backend/taskHelpers';

interface Props {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
}

export function TaskCard({ task, onToggle, onPress }: Props) {
  const { theme, isDark } = useTheme();
  const done = task.isCompleted;
  const overdue = isOverdue(task);
  const priColor = priorityColors[task.priority];
  const priBg = (isDark ? priorityBgDark : priorityBgLight)[task.priority];
  const catColor = categoryColors[task.category] ?? Colors.PRIMARY_BLUE;

  const scale = useSharedValue(1);
  const checkScale = useSharedValue(done ? 1 : 0);

  React.useEffect(() => {
    checkScale.value = withSpring(done ? 1 : 0, { damping: 12 });
  }, [done]);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withTiming(done ? 0.65 : 1, { duration: 200 }),
  }));
  const checkAnim = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: overdue ? Colors.DANGER_RED + '44' : theme.border,
          },
          cardAnim,
          Spacing.shadow.card,
        ]}
      >
        <View style={[styles.leftBar, { backgroundColor: priColor }]} />
        <View style={styles.body}>
          <Pressable
            onPress={onToggle}
            hitSlop={10}
            style={[
              styles.checkbox,
              {
                borderColor: done ? Colors.SUCCESS_GREEN : theme.border,
                backgroundColor: done ? Colors.SUCCESS_GREEN : 'transparent',
              },
            ]}
          >
            <Animated.View style={checkAnim}>
              {done ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
            </Animated.View>
          </Pressable>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color: theme.text,
                    textDecorationLine: done ? 'line-through' : 'none',
                  },
                ]}
              >
                {task.title}
              </Text>
              <View style={[styles.priBadge, { backgroundColor: priBg }]}>
                <Text style={[styles.priText, { color: priColor }]}>{task.priority}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={[styles.catChip, { backgroundColor: catColor + '18' }]}>
                <Text style={[styles.catText, { color: catColor }]}>{task.category}</Text>
              </View>
              {task.dueDate ? (
                <View style={styles.timeRow}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={overdue ? Colors.DANGER_RED : theme.muted}
                  />
                  <Text
                    style={[
                      styles.timeText,
                      { color: overdue ? Colors.DANGER_RED : theme.muted },
                    ]}
                  >
                    {formatDeadline(task)}
                  </Text>
                </View>
              ) : null}
              {task.reminderMinutes != null ? (
                <Ionicons name="notifications-outline" size={12} color={Colors.PRIMARY_BLUE} />
              ) : null}
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  leftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  body: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingLeft: 18,
    gap: 12,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  content: { flex: 1, minWidth: 0 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: Typography.family.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  priBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.radius.pill,
  },
  priText: { fontSize: 10.5, fontFamily: Typography.family.bold, letterSpacing: 0.3 },
  catChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.radius.pill,
  },
  catText: { fontSize: 11, fontFamily: Typography.family.semibold },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 11.5, fontFamily: Typography.family.medium },
});
