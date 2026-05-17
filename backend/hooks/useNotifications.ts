import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { requestNotificationPermissions } from '@/backend/notifications';

export function useNotifications() {
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const receivedListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    requestNotificationPermissions();

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const taskId = (response.notification.request.content.data as any)?.taskId;
      if (taskId) {
        router.push(`/task/${taskId}` as any);
      }
    });

    receivedListener.current = Notifications.addNotificationReceivedListener(() => {
      // Could trigger in-app banner here
    });

    return () => {
      responseListener.current?.remove();
      receivedListener.current?.remove();
    };
  }, []);
}
