import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card, EmptyState } from '../components/ui';
import { formatPrice, formatTime, relativeDay } from '../lib/format';
import { colors, space } from '../lib/theme';
import { useStore } from '../store/AppStore';

export default function Bestellingen() {
  const { orders } = useStore();
  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: space.lg, gap: space.md }}
      ListEmptyComponent={<EmptyState icon="receipt-outline" title="Nog geen bestellingen" />}
      renderItem={({ item }) => {
        const d = new Date(item.createdAt);
        return (
          <Card style={{ gap: space.sm }}>
            <View style={s.row}>
              <Text style={s.id}>#{item.id}</Text>
              <Text style={s.date}>
                {relativeDay(d)} {formatTime(d)}
              </Text>
            </View>
            {item.lines.map((l) => (
              <View key={l.productId} style={s.row}>
                <Text style={s.line}>
                  {l.quantity}× {l.name}
                </Text>
                <Text style={s.line}>{formatPrice(l.unitCents * l.quantity)}</Text>
              </View>
            ))}
            <View style={[s.row, s.totalRow]}>
              <Text style={s.total}>Totaal · {item.paymentMethod}</Text>
              <Text style={s.total}>{formatPrice(item.totalCents)}</Text>
            </View>
          </Card>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  id: { fontWeight: '800', color: colors.text, fontSize: 16 },
  date: { color: colors.muted, fontSize: 14 },
  line: { color: colors.text, fontSize: 15 },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: space.sm },
  total: { fontWeight: '800', color: colors.text, fontSize: 15 },
});
