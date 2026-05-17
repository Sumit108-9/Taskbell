import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/backend/hooks/useTheme';
import { Colors } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';

interface Props {
  emoji?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ emoji = '📭', title, subtitle, ctaLabel, onCta }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.emojiBox, { backgroundColor: theme.inputBg }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sub, { color: theme.muted }]}>{subtitle}</Text> : null}
      {ctaLabel && onCta ? (
        <Pressable onPress={onCta} style={styles.cta}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emojiBox: {
    width: 110,
    height: 110,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 50 },
  title: { fontSize: 16, fontFamily: Typography.family.bold, marginTop: 6 },
  sub: { fontSize: 13.5, fontFamily: Typography.family.medium, textAlign: 'center', paddingHorizontal: 30 },
  cta: {
    marginTop: 8,
    backgroundColor: Colors.PRIMARY_BLUE,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: Spacing.radius.button,
  },
  ctaText: { color: '#fff', fontFamily: Typography.family.bold, fontSize: 14 },
});
