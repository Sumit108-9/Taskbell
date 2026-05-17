import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/backend/hooks/useTheme';
import { useSettings } from '@/backend/hooks/useSettings';
import { useTasks } from '@/backend/hooks/useTasks';
import { Colors, themeSwatches } from '@/frontend/constants/Colors';
import { Typography } from '@/frontend/constants/Typography';
import { Spacing } from '@/frontend/constants/Spacing';
import { Toggle } from '@/frontend/components/Toggle';
import { Ionicons } from '@expo/vector-icons';
import { AppSettings } from '@/backend/types';
import { requestNotificationPermissions } from '@/backend/notifications';

type IconName = keyof typeof Ionicons.glyphMap;

export default function Settings() {
  const { theme, isDark, setDarkMode } = useTheme();
  const { settings, updateSetting } = useSettings();
  const { tasks } = useTasks();
  const insets = useSafeAreaInsets();

  const exportData = async () => {
    try {
      await Share.share({
        message: JSON.stringify(tasks, null, 2),
        title: 'TaskBell Tasks Backup',
      });
    } catch (e) {
      Alert.alert('Export failed');
    }
  };

  const opts: AppSettings['reminderSound'][] = ['Chime', 'Bell', 'Beep', 'Silent'];

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: Spacing.screenH, paddingBottom: 120 }}
    >
      {/* Profile header */}
      <View style={[styles.profileCard, { borderBottomColor: theme.border }]}>
        <LinearGradient
          colors={[Colors.PRIMARY_BLUE, Colors.PURPLE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarEmoji}>👤</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileName, { color: theme.text }]}>{settings.userName}</Text>
          <Text style={[styles.profileEmail, { color: theme.muted }]}>{settings.userEmail}</Text>
        </View>
        <View style={[styles.chevBox, { backgroundColor: theme.inputBg }]}>
          <Ionicons name="chevron-forward" size={16} color={theme.muted} />
        </View>
      </View>

      <Section title="NOTIFICATIONS">
        <Row
          icon="notifications-outline"
          iconColor={Colors.PRIMARY_BLUE}
          label="Push Notifications"
          isLast={false}
        >
          <Toggle
            value={settings.notificationsEnabled}
            onValueChange={async (v) => {
              if (v) await requestNotificationPermissions();
              updateSetting('notificationsEnabled', v);
            }}
          />
        </Row>
        <Row icon="alarm-outline" iconColor={Colors.WARNING_ORANGE} label="Alarm Reminders" isLast={false}>
          <Toggle value={settings.alarmEnabled} onValueChange={(v) => updateSetting('alarmEnabled', v)} />
        </Row>
        <Pressable
          onPress={() =>
            Alert.alert('Reminder Sound', undefined, [
              ...opts.map((o) => ({ text: o, onPress: () => updateSetting('reminderSound', o) })),
              { text: 'Cancel', style: 'cancel' as const },
            ])
          }
        >
          <Row icon="volume-high-outline" iconColor={Colors.PURPLE} label="Reminder Sound" isLast>
            <Text style={[styles.rowValue, { color: theme.muted }]}>{settings.reminderSound}</Text>
          </Row>
        </Pressable>
      </Section>

      <Section title="APPEARANCE">
        <Row
          icon={isDark ? 'moon-outline' : 'sunny-outline'}
          iconColor={isDark ? Colors.PURPLE : Colors.WARNING_ORANGE}
          label="Dark Mode"
          isLast={false}
        >
          <Toggle value={isDark} onValueChange={(v) => setDarkMode(v)} />
        </Row>
        <Row icon="color-palette-outline" iconColor={Colors.PRIMARY_BLUE} label="App Theme" isLast>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {themeSwatches.map((s) => (
              <Pressable
                key={s.name}
                onPress={() => updateSetting('theme', s.name as AppSettings['theme'])}
                style={[
                  styles.swatch,
                  {
                    backgroundColor: s.color,
                    borderColor: settings.theme === s.name ? theme.text : 'transparent',
                  },
                ]}
              />
            ))}
          </View>
        </Row>
      </Section>

      <Section title="DATA">
        <Pressable onPress={exportData}>
          <Row icon="cloud-upload-outline" iconColor={Colors.SUCCESS_GREEN} label="Backup & Restore" isLast={false}>
            <View style={[styles.autoPill, { backgroundColor: Colors.SUCCESS_GREEN + '18' }]}>
              <Text style={[styles.autoText, { color: Colors.SUCCESS_GREEN }]}>Auto</Text>
            </View>
          </Row>
        </Pressable>
        <Pressable onPress={() => Alert.alert('Privacy', 'Your data is stored locally on this device.')}>
          <Row icon="shield-checkmark-outline" iconColor={theme.muted} label="Privacy" isLast>
            <Ionicons name="chevron-forward" size={14} color={theme.muted} />
          </Row>
        </Pressable>
      </Section>

      <Section title="ABOUT">
        <Row icon="information-circle-outline" iconColor={theme.muted} label="App Version" isLast>
          <Text style={[styles.rowValue, { color: theme.muted }]}>v1.0.0</Text>
        </Row>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>{title}</Text>
      <View
        style={[
          styles.group,
          { backgroundColor: theme.card, borderColor: theme.border },
          Spacing.shadow.card,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  icon,
  iconColor,
  label,
  isLast,
  children,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  isLast: boolean;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 4,
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 24 },
  profileName: { fontSize: 16, fontFamily: Typography.family.extrabold },
  profileEmail: { fontSize: 12, fontFamily: Typography.family.medium, marginTop: 2 },
  chevBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  sectionTitle: {
    fontSize: 11.5,
    fontFamily: Typography.family.bold,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  group: { borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: Typography.family.semibold },
  rowValue: { fontSize: 13, fontFamily: Typography.family.semibold },

  swatch: { width: 16, height: 16, borderRadius: 99, borderWidth: 2 },

  autoPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  autoText: { fontSize: 11, fontFamily: Typography.family.bold },
});
