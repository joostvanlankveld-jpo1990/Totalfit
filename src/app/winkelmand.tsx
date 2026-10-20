import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Card, EmptyState, QuantityStepper } from '../components/ui';
import { formatPrice } from '../lib/format';
import { notify } from '../lib/dialog';
import { colors, radius, space } from '../lib/theme';
import { useStore } from '../store/AppStore';

const METHODS = [
  { id: 'iDEAL', icon: 'card-outline' as const },
  { id: 'Creditcard', icon: 'card' as const },
  { id: 'Betalen bij de balie', icon: 'storefront-outline' as const },
];

export default function Winkelmand() {
  const insets = useSafeAreaInsets();
  const { cartLines, cartTotalCents, setQty, placeOrder, user } = useStore();
  const [method, setMethod] = useState(METHODS[0].id);
  const [paying, setPaying] = useState(false);

  if (cartLines.length === 0) {
    return (
      <EmptyState icon="bag-outline" title="Je winkelmand is leeg" text="Bekijk de webshop voor rittenkaarten, materiaal en meer.">
        <Button title="Naar de webshop" onPress={() => router.back()} style={{ marginTop: space.md }} />
      </EmptyState>
    );
  }

  const onPay = () => {
    if (!user) {
      router.push('/inloggen');
      return;
    }
    setPaying(true);
    // Placeholder voor de echte betaalprovider (bijv. Mollie). Zie README.
    setTimeout(() => {
      const order = placeOrder(method);
      setPaying(false);
      router.back();
      notify('Bedankt voor je bestelling!', `Bestelnummer ${order.id} · ${formatPrice(order.totalCents)}. Je kunt je bestelling ophalen bij de balie.`);
    }, 800);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 200 }}>
        <Card style={{ gap: space.lg }}>
          {cartLines.map((l) => (
            <View key={l.productId} style={s.line}>
              <View style={s.thumb}>
                <Text style={{ fontSize: 26 }}>{l.product.emoji}</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.name}>{l.product.name}</Text>
                <Text style={s.unit}>{formatPrice(l.product.priceCents)} per stuk</Text>
                <QuantityStepper value={l.quantity} onChange={(v) => setQty(l.productId, v)} />
              </View>
              <Text style={s.lineTotal}>{formatPrice(l.lineCents)}</Text>
            </View>
          ))}
        </Card>

        <Text style={s.h}>Betaalmethode</Text>
        <Card style={{ padding: 0 }}>
          {METHODS.map((m, i) => (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={[s.method, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
            >
              <Ionicons name={m.icon} size={22} color={colors.navy} />
              <Text style={s.methodText}>{m.id}</Text>
              <Ionicons
                name={method === m.id ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={method === m.id ? colors.navy : colors.muted}
              />
            </Pressable>
          ))}
        </Card>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + space.md }]}>
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Totaal (incl. btw)</Text>
          <Text style={s.total}>{formatPrice(cartTotalCents)}</Text>
        </View>
        <Button
          title={user ? `Betalen ${formatPrice(cartTotalCents)}` : 'Inloggen om te betalen'}
          icon="lock-closed"
          loading={paying}
          onPress={onPay}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  line: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  unit: { fontSize: 13, color: colors.muted },
  lineTotal: { fontSize: 15, fontWeight: '800', color: colors.text },
  h: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: space.xl, marginBottom: space.md },
  method: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg },
  methodText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
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
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 15, color: colors.muted },
  total: { fontSize: 22, fontWeight: '800', color: colors.text },
});
