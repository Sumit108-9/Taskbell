import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, Pressable, StyleSheet, ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { useTheme } from '@/backend/hooks/useTheme';
import { setHasOnboarded } from '@/backend/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SLIDES = [
  { emoji: '📋', title: 'Organize Your Tasks', desc: 'Add tasks with categories, priorities, and deadlines.', color: '#DBEAFE', bg: Colors.PRIMARY_BLUE },
  { emoji: '⏰', title: 'Never Miss a Deadline', desc: 'Set deadlines and get smart reminders before tasks are due.', color: '#FFEDD5', bg: Colors.WARNING_ORANGE },
  { emoji: '🔔', title: 'Alarm Notifications', desc: 'Powerful alarm alerts notify you right on time.', color: '#FEE2E2', bg: Colors.DANGER_RED },
];

export default function Onboarding() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLast = index === SLIDES.length - 1;

  const finish = async () => {
    await setHasOnboarded(true);
    router.replace('/(tabs)/home');
  };

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setIndex(viewableItems[0].index ?? 0);
  }).current;

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg, paddingTop: insets.top + 10 }]}>
      <View style={styles.topRow}>
        {!isLast ? (
          <Pressable onPress={finish} style={styles.skip}>
            <Text style={[styles.skipText, { color: theme.muted }]}>Skip</Text>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.illust, { backgroundColor: item.color }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.desc, { color: theme.muted }]}>{item.desc}</Text>
          </View>
        )}
      />

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === index ? 26 : 8,
                  backgroundColor: i === index ? Colors.PRIMARY_BLUE : theme.border,
                },
              ]}
            />
          ))}
        </View>
        <Pressable
          onPress={() => {
            if (isLast) finish();
            else listRef.current?.scrollToIndex({ index: index + 1 });
          }}
        >
          <LinearGradient
            colors={['#2563EB', '#1d4ed8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{isLast ? 'Get Started' : 'Next'}</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  topRow: { paddingHorizontal: 20, alignItems: 'flex-end', height: 40 },
  skip: { paddingHorizontal: 10, paddingVertical: 6 },
  skipText: { fontSize: 14, fontFamily: Typography.family.semibold },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 24 },
  illust: {
    width: 220,
    height: 220,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
  },
  emoji: { fontSize: 72 },
  title: { fontSize: 26, fontFamily: Typography.family.extrabold, textAlign: 'center' },
  desc: { fontSize: 14.5, fontFamily: Typography.family.medium, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  bottom: { paddingHorizontal: 20, paddingBottom: 30, gap: 18 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 6 },
  dot: { height: 8, borderRadius: 99 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: Spacing.radius.button,
    shadowColor: Colors.PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: { color: '#fff', fontFamily: Typography.family.bold, fontSize: 15.5 },
});
