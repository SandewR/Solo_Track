import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/solotrack_theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarShowIcon: false,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="jobs" options={{ title: 'Jobs' }} />
    </Tabs>
  );
}