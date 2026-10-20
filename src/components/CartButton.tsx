import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';
import { useStore } from '../store/AppStore';

export function CartButton() {
  const { cartCount } = useStore();
  return (
    <Pressable
      accessibilityLabel={`Winkelmand, ${cartCount} artikelen`}
      hitSlop={10}
      onPress={() => router.push('/winkelmand')}
      style={{ paddingHorizontal: 8 }}
    >
      <Ionicons name="bag-handle-outline" size={24} color={colors.navy} />
      {cartCount > 0 && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{cartCount}</Text>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 0,
    top: -4,
    backgroundColor: colors.lime,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: colors.navyDark },
});
