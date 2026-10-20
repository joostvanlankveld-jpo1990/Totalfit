import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button, EmptyState } from '../components/ui';
import { getCheckInCode } from '../data/api';
import { GYM, planById } from '../data/catalog';
import { formatLongDate } from '../lib/format';
import { colors, radius, space } from '../lib/theme';
import { useStore } from '../store/AppStore';

export default function Inchecken() {
  const { user, membership } = useStore();
  const [now, setNow] = useState(new Date());

  // Lopende klok: zo ziet de balie dat het geen screenshot is.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!user) {
    return (
      <EmptyState icon="qr-code-outline" title="Log in om in te checken" text="Je QR-code verschijnt hier zodra je bent ingelogd.">
        <Button title="Inloggen" onPress={() => router.push('/inloggen')} style={{ marginTop: space.md }} />
      </EmptyState>
    );
  }

  const plan = membership ? planById(membership.planId) : undefined;
  const time = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={s.container}>
      <Text style={s.title}>Houd deze code voor de scanner</Text>
      <Text style={s.sub}>bij de ingang van {GYM.name}</Text>
      <View style={s.qrBox}>
        <QRCode value={getCheckInCode(user)} size={240} color="#000" backgroundColor="#fff" quietZone={12} />
      </View>
      <Text style={s.name}>
        {user.firstName} {user.lastName}
      </Text>
      <Text style={s.meta}>
        Lidnummer {user.memberNumber}
        {plan ? ` · ${plan.name}` : ''}
      </Text>
      <View style={s.clock}>
        <Text style={s.clockTime}>{time}</Text>
        <Text style={s.clockDate}>{formatLongDate(now)}</Text>
      </View>
      <Text style={s.tip}>Tip: zet de helderheid van je scherm hoog, dan leest de scanner de code sneller.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { alignItems: 'center', padding: space.xl },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sub: { fontSize: 15, color: colors.muted, marginTop: 4 },
  qrBox: {
    marginTop: space.xl,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.lime,
    backgroundColor: '#fff',
  },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: space.xl },
  meta: { fontSize: 15, color: colors.muted, marginTop: 4 },
  clock: {
    marginTop: space.xl,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.xl,
    alignItems: 'center',
  },
  clockTime: { color: '#fff', fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] },
  clockDate: { color: colors.lime, fontSize: 13, fontWeight: '600' },
  tip: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: space.xl, lineHeight: 19 },
});
