import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PRODUCTS } from '../../data/catalog';
import { ProductCategory } from '../../data/types';
import { formatPrice } from '../../lib/format';
import { colors, radius, shadow, space } from '../../lib/theme';
import { useStore } from '../../store/AppStore';
import { Button } from '../../components/ui';

const CATS: { id: ProductCategory | 'alle'; label: string }[] = [
  { id: 'alle', label: 'Alles' },
  { id: 'tegoed', label: 'Rittenkaarten' },
  { id: 'materiaal', label: 'Materiaal' },
  { id: 'kleding', label: 'Kleding' },
  { id: 'voeding', label: 'Voeding' },
];

export default function Shop() {
  const [cat, setCat] = useState<ProductCategory | 'alle'>('alle');
  const { addToCart, cartCount, cartTotalCents } = useStore();
  const products = PRODUCTS.filter((p) => cat === 'alle' || p.category === cat);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, flexShrink: 0 }}
        contentContainerStyle={s.cats}
      >
        {CATS.map((c) => (
          <Pressable key={c.id} onPress={() => setCat(c.id)} style={[s.chip, cat === c.id && s.chipActive]}>
            <Text style={[s.chipText, cat === c.id && { color: colors.navyDark }]}>{c.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(p) => p.id}
        columnWrapperStyle={{ gap: space.md }}
        contentContainerStyle={{ padding: space.lg, gap: space.md, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/product/${item.id}`)}
            style={({ pressed }) => [s.card, pressed && { opacity: 0.85 }]}
          >
            <View style={s.image}>
              <Text style={{ fontSize: 44 }}>{item.emoji}</Text>
            </View>
            <Text style={s.name} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={s.bottom}>
              <Text style={s.price}>{formatPrice(item.priceCents)}</Text>
              {item.inStock ? (
                <Pressable
                  accessibilityLabel={`${item.name} toevoegen aan winkelmand`}
                  hitSlop={8}
                  onPress={() => addToCart(item.id)}
                  style={s.add}
                >
                  <Text style={s.addText}>+</Text>
                </Pressable>
              ) : (
                <Text style={s.soldOut}>Uitverkocht</Text>
              )}
            </View>
          </Pressable>
        )}
      />
      {cartCount > 0 && (
        <View style={s.cartBar}>
          <Button
            title={`Winkelmand (${cartCount}) · ${formatPrice(cartTotalCents)}`}
            icon="bag-handle"
            onPress={() => router.push('/winkelmand')}
          />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  cats: { paddingHorizontal: space.lg, gap: space.sm, paddingVertical: space.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.text },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: radius.lg, padding: space.md, ...shadow },
  image: {
    height: 110,
    borderRadius: radius.md,
    backgroundColor: colors.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, minHeight: 40 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  price: { fontSize: 16, fontWeight: '800', color: colors.navy },
  add: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: -2 },
  soldOut: { fontSize: 12, color: colors.danger, fontWeight: '700' },
  cartBar: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg },
});
