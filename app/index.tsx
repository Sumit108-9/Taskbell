import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Typography } from '@/frontend/constants/Typography';
import { getHasOnboarded } from '@/backend/storage';

export default function Splash() {
  const d1 = useSharedValue(0.4);
  const d2 = useSharedValue(0.4);
  const d3 = useSharedValue(0.4);

  useEffect(() => {
    const opts = { duration: 500 };
    d1.value = withRepeat(withSequence(withTiming(1, opts), withTiming(0.4, opts)), -1);
    setTimeout(() => {
      d2.value = withRepeat(withSequence(withTiming(1, opts), withTiming(0.4, opts)), -1);
    }, 150);
    setTimeout(() => {
      d3.value = withRepeat(withSequence(withTiming(1, opts), withTiming(0.4, opts)), -1);
    }, 300);

    const timer = setTimeout(async () => {
      const onboarded = await getHasOnboarded();
      router.replace(onboarded ? '/(tabs)/home' : '/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: d1.value }));
  const s2 = useAnimatedStyle(() => ({ opacity: d2.value }));
  const s3 = useAnimatedStyle(() => ({ opacity: d3.value }));

  return (
    <LinearGradient
      colors={['#1d4ed8', '#2563EB', '#3b82f6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrap}
    >
      {/* Floating ring decorations */}
      <View style={[styles.ring, { top: 60, right: 30, width: 120, height: 120 }]} />
      <View style={[styles.ring, { top: 40, right: 50, width: 80, height: 80, borderColor: 'rgba(255,255,255,0.1)' }]} />
      <View style={[styles.ring, { bottom: 100, left: 20, width: 90, height: 90, borderColor: 'rgba(255,255,255,0.12)' }]} />

      <View style={styles.iconBox}>
        <Ionicons name="notifications" size={48} color="#fff" />
      </View>
      <Text style={styles.title}>TaskBell</Text>
      <Text style={styles.tagline}>Plan it. Do it. Never miss it.</Text>
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, s1]} />
        <Animated.View style={[styles.dot, styles.dotWide, s2]} />
        <Animated.View style={[styles.dot, s3]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 36,
    fontFamily: Typography.family.extrabold,
    color: '#fff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    fontFamily: Typography.family.medium,
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: 64 },
  dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.9)' },
  dotWide: { width: 20 },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});
