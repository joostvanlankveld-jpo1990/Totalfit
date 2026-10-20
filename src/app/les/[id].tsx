import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, EmptyState, IntensityDots, Pill } from '../../components/ui';
import { getSessionById } from '../../data/api';
import { classTypeById, GYM } from '../../data/catalog';
import { formatTime, relativeDay } from '../../lib/format';
import { confirm, notify } from '../../lib/dialog';
import { colors, radius, space } from '../../lib/theme';
import { useStore } from '../../store/AppStore';

const haptic = () => {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export default function LesDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const session = useMemo(() => (id ? getSessionById(id) : undefined), [id]);

  if (!session) {
    return <EmptyState icon="alert-circle-outline" title="Les niet gevonden" text="Deze les bestaat niet (meer)." />;
  }

  const type = classTypeById(session.classTypeId);
  const start = new Date(session.start);
  const end = new Date(start.getTime() + session.durationMin * 60000);
  const status = store.statusFor(session);
  const taken = store.spotsTaken(session);
  const free = Math.max(0, session.capacity - taken);
  const pct = Math.min(1, taken / session.capacity);

  const requireLogin = () => {
    if (store.user) return true;
    router.push('/inloggen');
    return false;
  };

  const onBook = () => {
    if (!requireLogin()) return;
    store.book(session.id);
    haptic();
    notify('Je bent ingeschreven! 💪', `${type.name}, ${relativeDay(start).toLowerCase()} om ${formatTime(start)}.`);
  };

  const onCancel = async () => {
    if (!store.canCancel(session)) {
      notify(
        'Uitschrijven niet meer mogelijk',
        `Je kunt je tot ${GYM.cancelHoursBefore} uur voor aanvang uitschrijven. Neem contact op met de balie.`,
      );
      return;
    }
    if (await confirm('Uitschrijven?', `Wil je je uitschrijven voor ${type.name}?`, 'Uitschrijven')) {
      store.cancel(session.id);
    }
  };

  const onWaitlist = () => {
    if (!requireLogin()) return;
    store.joinWaitlist(session.id);
    haptic();
    notify('Op de wachtlijst', 'Komt er een plek vrij, dan word je automatisch ingeschreven.');
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: type.name }} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 140 }}>
        <View style={[s.hero, { backgroundColor: type.color }]}>
          <Ionicons name="barbell-outline" size={42} color="#ffffffcc" />
          <Text style={s.heroTitle}>{type.name}</Text>
          <Text style={s.heroSub}>
            {relativeDay(start)} · {formatTime(start)} – {formatTime(end)}
          </Text>
        </View>

        <Card style={{ marginTop: space.lg, gap: space.md }}>
          <InfoRow icon="location-outline" label="Zaal" value={session.room} />
          <InfoRow icon="person-outline" label="Instructeur" value={session.instructor} />
          <InfoRow icon="time-outline" label="Duur" value={`${session.durationMin} minuten`} />
          <View style={s.row}>
            <Ionicons name="flame-outline" size={20} color={colors.navy} />
            <Text style={s.rowLabel}>Intensiteit</Text>
            <IntensityDots level={type.intensity} />
          </View>
        </Card>

        <Card style={{ marginTop: space.lg }}>
          <View style={[s.row, { marginBottom: space.sm }]}>
            <Text style={[s.rowLabel, { flex: 1, marginLeft: 0 }]}>Bezetting</Text>
            <Text style={s.rowValue}>
              {taken} / {session.capacity}
            </Text>
          </View>
          <View style={s.bar}>
            <View
              style={[s.barFill, { width: `${pct * 100}%`, backgroundColor: free === 0 ? colors.danger : colors.lime }]}
            />
          </View>
          <Text style={s.barText}>
            {free === 0 ? 'Deze les is vol.' : `Nog ${free} ${free === 1 ? 'plek' : 'plekken'} beschikbaar`}
          </Text>
        </Card>

        <Card style={{ marginTop: space.lg }}>
          <Text style={s.h}>Over deze les</Text>
          <Text style={s.p}>{type.description}</Text>
        </Card>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + space.md }]}>
        {status === 'geboekt' && (
          <>
            <Pill label="✓ Je bent ingeschreven" color={colors.success} />
            <Button title="Uitschrijven" variant="danger" onPress={onCancel} />
          </>
        )}
        {status === 'beschikbaar' && <Button title="Inschrijven" icon="checkmark" onPress={onBook} />}
        {status === 'vol' && <Button title="Zet me op de wachtlijst" variant="lime" onPress={onWaitlist} />}
        {status === 'wachtlijst' && (
          <>
            <Pill label="Je staat op de wachtlijst" color={colors.warning} />
            <Button title="Van wachtlijst af" variant="secondary" onPress={() => store.leaveWaitlist(session.id)} />
          </>
        )}
        {status === 'voorbij' && <Button title="Deze les is al geweest" disabled />}
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={s.row}>
      <Ionicons name={icon} size={20} color={colors.navy} />
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { borderRadius: radius.lg, padding: space.xl, gap: 4 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: space.sm },
  heroSub: { color: '#ffffffdd', fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { flex: 1, marginLeft: space.md, fontSize: 15, color: colors.muted },
  rowValue: { fontSize: 15, fontWeight: '700', color: colors.text },
  bar: { height: 10, borderRadius: 5, backgroundColor: colors.bg, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barText: { marginTop: space.sm, color: colors.muted, fontSize: 14 },
  h: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: space.sm },
  p: { fontSize: 15, color: colors.text, lineHeight: 22 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: space.lg,
    gap: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
