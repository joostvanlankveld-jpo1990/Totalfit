import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';
import { AppStoreProvider } from '../store/AppStore';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: colors.navy,
            headerTitleStyle: { fontWeight: '700', color: colors.text },
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="les/[id]" options={{ title: 'Les' }} />
          <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
          <Stack.Screen name="winkelmand" options={{ title: 'Winkelmand', presentation: 'modal' }} />
          <Stack.Screen name="inloggen" options={{ title: 'Inloggen', presentation: 'modal' }} />
          <Stack.Screen name="lidmaatschap" options={{ title: 'Lid worden' }} />
          <Stack.Screen name="bestellingen" options={{ title: 'Mijn bestellingen' }} />
        </Stack>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
