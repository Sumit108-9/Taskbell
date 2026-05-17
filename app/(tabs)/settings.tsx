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
import { SectionLabel } from '@/frontend/components/SectionLabel';
import { Bell, SettingsIcon, ChevronRight } from '@/frontend/components/icons';
import { AppSettings } from '@/backend/types';
import { requestNotificationPermissions } from '@/backend/notifications';

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

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: Spacing.screenH, paddingBottom: 120 }}
    >
      <Text style={[styles.h1, { color: theme.text }]}>Settings</Text>

      <View style={[styles.profileCard, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <LinearGradient colors={['#3b82f6', '#8B5CF6']} style={styles.avatar}>
          <Text style={styles.avatarText}>{settings.userName.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileName, { color: theme.text }]}>{settings.userName}</Text>
          <Text style={[styles.profileEmail, { color: theme.muted }]}>{settings.userEmail}</Text>
        </View>
        <ChevronRight size={20} color={theme.muted} />
      </View>

      <SectionLabel label="Notifications" />
      <View style={[styles.group, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <Row icon="🔔" iconBg={Colors.PRIMARY_BLUE} label="Push Notifications">
          <Toggle
            value={settings.notificationsEnabled}
            onValueChange={async (v) => {
              if (v) await requestNotificationPermissions();
              updateSetting('notificationsEnabled', v);
            }}
          />
        </Row>
        <Row icon="⏰" iconBg={Colors.WARNING_ORANGE} label="Alarm Reminders">
          <Toggle value={settings.alarmEnabled} onValueChange={(v) => updateSetting('alarmEnabled', v)} />
        </Row>
        <SoundPicker value={settings.reminderSound} onChange={(v) => updateSetting('reminderSound', v)} />
      </View>

      <SectionLabel label="Appearance" />
      <View style={[styles.group, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <Row icon="🌙" iconBg={Colors.PURPLE} label="Dark Mode">
          <Toggle value={isDark} onValueChange={(v) => setDarkMode(v)} />
        </Row>
        <Row icon="🎨" iconBg={Colors.SUCCESS_GREEN} label="App Theme">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {themeSwatches.map((s) => (
              <Pressable
                key={s.name}
                onPress={() => updateSetting('theme', s.name as AppSettings['theme'])}
                style={[
                  styles.swatch,
                  {
                    backgroundColor: s.color,
                    borderWidth: settings.theme === s.name ? 2 : 0,
                    borderColor: theme.text,
                  },
                ]}
              />
            ))}
          </View>
        </Row>
      </View>

      <SectionLabel label="Data" />
      <View style={[styles.group, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <Pressable onPress={exportData}>
          <Row icon="💾" iconBg={Colors.PRIMARY_BLUE} label="Backup & Restore">
            <ChevronRight size={18} color={theme.muted} />
          </Row>
        </Pressable>
        <Pressable onPress={() => Alert.alert('Privacy', 'Your data is stored locally on this device.')}>
          <Row icon="🔒" iconBg={Colors.MUTED} label="Privacy">
            <ChevronRight size={18} color={theme.muted} />
          </Row>
        </Pressable>
      </View>

      <SectionLabel label="About" />
      <View style={[styles.group, { backgroundColor: theme.card }, Spacing.shadow.card]}>
        <Row icon="ℹ️" iconBg={Colors.SUCCESS_GREEN} label="App Version">
          <Text style={{ color: theme.muted, fontFamily: Typography.family.semibold }}>v1.0.0</Text>
        </Row>
      </View>
    </ScrollView>
  );
}

function Row({
  icon,
  iconBg,
  label,
  children,
}: {
  icon: string;
  iconBg: string;
  label: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: iconBg + '22' }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <View>{children}</View>
    </View>
  );
}

function SoundPicker({ value, onChange }: { value: AppSettings['reminderSound']; onChange: (v: AppSettings['reminderSound']) => void }) {
  const { theme } = useTheme();
  const opts: AppSettings['reminderSound'][] = ['Chime', 'Bell', 'Beep', 'Silent'];
  return (
    <Pressable
      onPress={() => {
        Alert.alert('Reminder Sound', undefined, [
          ...opts.map((o) => ({ text: o, onPress: () => onChange(o) })),
          { text: 'Cancel', style: 'cancel' as const },
        ]);
      }}
    >
      <Row icon="🎵" iconBg={Colors.WARNING_ORANGE} label="Reminder Sound">
        <Text style={{ color: theme.muted, fontFamily: Typography.family.semibold }}>{value}</Text>
      </Row>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 24, fontFamily: Typography.family.extrabold, marginBottom: 16 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: Spacing.radius.card,
    gap: 12,
    marginBottom: 16,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: Typography.family.bold, fontSize: 20 },
  profileName: { fontSize: 16, fontFamily: Typography.family.bold },
  profileEmail: { fontSize: 13, fontFamily: Typography.family.medium, marginTop: 2 },
  group: { borderRadius: Spacing.radius.card, padding: 6, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, gap: 12 },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 14.5, fontFamily: Typography.family.semibold },
  swatch: { width: 24, height: 24, borderRadius: 12 },
});
