import React from 'react';
import { Tabs } from 'expo-router';
import { BottomNav } from '@/frontend/components/BottomNav';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="add" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
