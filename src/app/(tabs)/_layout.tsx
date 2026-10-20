import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import React from 'react';
import { ColorValue } from 'react-native';
import { CartButton } from '../../components/CartButton';
import { colors } from '../../lib/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const icon =
  (active: IconName, inactive: IconName) =>
  ({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) => (
    <Ionicons name={focused ? active : inactive} size={size} color={color as string} />
  );

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerTitleStyle: { fontWeight: '800', color: colors.text },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.bg },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', headerShown: false, tabBarIcon: icon('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="lessen"
        options={{ title: 'Lessen', tabBarIcon: icon('calendar', 'calendar-outline') }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Webshop',
          tabBarIcon: icon('bag-handle', 'bag-handle-outline'),
          headerRight: () => <CartButton />,
        }}
      />
      <Tabs.Screen
        name="profiel"
        options={{ title: 'Profiel', tabBarIcon: icon('person-circle', 'person-circle-outline') }}
      />
    </Tabs>
  );
}
