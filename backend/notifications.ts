import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '@/backend/types';
import { getTaskDueDateTime } from './taskHelpers';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const res = await Notifications.requestPermissionsAsync();
    status = res.status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Task Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563EB',
    });
  }
  return status === 'granted';
}

export async function scheduleTaskNotification(task: Task): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const due = getTaskDueDateTime(task);
  if (!due) return null;
  const remindMins = task.reminderMinutes ?? 0;
  const triggerDate = new Date(due.getTime() - remindMins * 60 * 1000);
  if (triggerDate.getTime() <= Date.now()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ ' + task.title,
      body: remindMins > 0 ? `Due in ${remindMins} minutes — don't be late!` : 'Task is due now!',
      data: { taskId: task.id },
      sound: 'default',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate } as any,
  });
  return id;
}

export async function cancelNotification(notificationId?: string): Promise<void> {
  if (!notificationId || Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // ignore
  }
}
