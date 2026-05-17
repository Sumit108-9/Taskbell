import React, { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Bell } from '@/frontend/components/icons';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { useTheme } from '@/backend/hooks/useTheme';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  onSnooze: () => void;
  onDismiss: () => void;
}

export function NotificationBanner({ visible, title, body, onSnooze, onDismiss }: Props) {
  const { theme } = useTheme();
  const translateY = useSharedValue(-200);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : -200, { duration: 280 });
  }, [visible]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.wrap,
        { backgroundColor: theme.card, borderColor: theme.border },
        Spacing.shadow.card,
        style,
      ]}
    >
      <View style={[styles.icon, { backgroundColor: Colors.PRIMARY_BLUE }]}>
        <Bell size={20} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.body, { color: theme.muted }]} numberOfLines={2}>
          {body}
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={onSnooze} style={[styles.btn, { backgroundColor: theme.inputBg }]}>
            <Text style={[styles.btnText, { color: theme.text }]}>Snooze 10 min</Text>
          </Pressable>
          <Pressable onPress={onDismiss} style={[styles.btn, { backgroundColor: Colors.PRIMARY_BLUE }]}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    padding: 14,
    borderRadius: Spacing.radius.card,
    borderWidth: 1,
    gap: 12,
    zIndex: 100,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14.5, fontFamily: Typography.family.bold },
  body: { fontSize: 12.5, fontFamily: Typography.family.medium, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnText: { fontSize: 12, fontFamily: Typography.family.bold },
});
