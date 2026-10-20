import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartButton } from '../../components/CartButton';
import { Button, EmptyState, Pill, QuantityStepper } from '../../components/ui';
import { productById } from '../../data/catalog';
import { formatPrice } from '../../lib/format';
import { colors, radius, space } from '../../lib/theme';
import { useStore } from '../../store/AppStore';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { cart, setQty } = useStore();
  const product = id ? productById(id) : undefined;
  const [qty, setLocalQty] = useState(1);

  if (!product) return <EmptyState icon="alert-circle-outline" title="Product niet gevonden" />;

  const inCart = cart.find((l) => l.productId === product.id)?.quantity ?? 0;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: product.name, headerRight: () => <CartButton /> }} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 160 }}>
        <View style={s.image}>
          <Text style={{ fontSize: 96 }}>{product.emoji}</Text>
        </View>
        <Text style={s.name}>{product.name}</Text>
        <Text style={s.price}>{formatPrice(product.priceCents)}</Text>
        <Text style={s.vat}>Inclusief btw</Text>
        {!product.inStock && <Pill label="Tijdelijk uitverkocht" color={colors.danger} />}
        <Text style={s.h}>Informatie</Text>
        <Text style={s.p}>{product.description}</Text>
        <Text style={s.note}>Ophalen bij de balie van de sportschool. Betalen kan direct in de app.</Text>
      </ScrollView>
      {product.inStock && (
        <View style={[s.footer, { paddingBottom: insets.bottom + space.md }]}>
          <View style={s.footerRow}>
            <QuantityStepper value={qty} onChange={(v) => setLocalQty(Math.max(1, Math.min(99, v)))} />
            <Text style={s.lineTotal}>{formatPrice(product.priceCents * qty)}</Text>
          </View>
          <Button
            title={inCart ? `Toevoegen (${inCart} in winkelmand)` : 'In winkelmand'}
            icon="bag-add"
            onPress={() => {
              setQty(product.id, inCart + qty);
              router.push('/winkelmand');
            }}
          />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  image: {
    height: 240,
    borderRadius: radius.lg,
    backgroundColor: colors.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: space.lg },
  price: { fontSize: 24, fontWeight: '800', color: colors.navy, marginTop: space.xs },
  vat: { fontSize: 13, color: colors.muted, marginBottom: space.sm },
  h: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: space.lg, marginBottom: space.sm },
  p: { fontSize: 15, lineHeight: 22, color: colors.text },
  note: { fontSize: 14, color: colors.muted, marginTop: space.lg, lineHeight: 20 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: space.lg,
    gap: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineTotal: { fontSize: 20, fontWeight: '800', color: colors.text },
});
