import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '@/frontend/constants/Colors';
import { useTheme } from '@/backend/hooks/useTheme';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function Toggle({ value, onValueChange }: Props) {
  const { theme } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value > 0.5 ? Colors.PRIMARY_BLUE : theme.inputBg,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 22 }],
  }));

  return (
    <Pressable onPress={() => onValueChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 28,
    borderRadius: 99,
    padding: 3,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
  },
});
