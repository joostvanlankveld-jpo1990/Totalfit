import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ClassCard } from '../../components/ClassCard';
import { Button, Card, EmptyState, SectionTitle } from '../../components/ui';
import { getSchedule } from '../../data/api';
import { GYM, planById } from '../../data/catalog';
import { confirm } from '../../lib/dialog';
import { colors, radius, space } from '../../lib/theme';
import { useStore } from '../../store/AppStore';

export default function Profiel() {
  const store = useStore();
  const { user, membership } = store;
  const schedule = useMemo(() => getSchedule(), []);
  const now = Date.now();
  const myClasses = schedule.filter((s) => store.bookings.includes(s.id) && new Date(s.start).getTime() > now);
  const myWaitlist = schedule.filter((s) => store.waitlist.includes(s.id) && new Date(s.start).getTime() > now);

  if (!user) {
    return (
      <ScrollView contentContainerStyle={{ padding: space.lg }}>
        <EmptyState
          icon="person-circle-outline"
          title="Log in of word lid"
          text="Bekijk je ingeschreven lessen, je ledenpas en je bestellingen."
        >
          <View style={{ alignSelf: 'stretch', gap: space.sm, marginTop: space.md }}>
            <Button title="Inloggen" onPress={() => router.push('/inloggen')} />
            <Button title="Lid worden" variant="secondary" onPress={() => router.push('/lidmaatschap')} />
          </View>
        </EmptyState>
        <InfoLinks />
      </ScrollView>
    );
  }

  const plan = membership ? planById(membership.planId) : undefined;

  const onDelete = async () => {
    const ok = await confirm(
      'Account verwijderen?',
      'Je account, inschrijvingen en bestelhistorie worden van dit apparaat verwijderd. Je lidmaatschap opzeggen doe je via de balie.',
      'Verwijderen',
    );
    if (ok) store.logout();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xl }}>
      <View style={s.pass}>
        <View style={s.passTop}>
          <Text style={s.passBrand}>{GYM.name}</Text>
          <View style={s.passLogo}>
            <Text style={s.passLogoText}>TF</Text>
          </View>
        </View>
        <Text style={s.passName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={s.passMeta}>Lidnummer {user.memberNumber}</Text>
        <View style={s.passBottom}>
          <Text style={s.passPlan}>{plan ? `Abonnement ${plan.name}` : 'Geen abonnement'}</Text>
          {membership && <Text style={s.passStatus}>{membership.status}</Text>}
        </View>
      </View>
      {!membership && (
        <Button title="Lid worden" variant="lime" onPress={() => router.push('/lidmaatschap')} style={{ marginTop: space.md }} />
      )}

      <SectionTitle title="Mijn lessen" />
      {myClasses.length ? (
        myClasses.map((session) => <ClassCard key={session.id} session={session} showDay />)
      ) : (
        <Card>
          <Text style={{ color: colors.muted, fontSize: 15 }}>Je bent nog niet ingeschreven voor een les.</Text>
          <Button title="Lesrooster bekijken" variant="secondary" onPress={() => router.navigate('/lessen')} style={{ marginTop: space.md }} />
        </Card>
      )}
      {myWaitlist.length > 0 && (
        <>
          <SectionTitle title="Wachtlijst" />
          {myWaitlist.map((session) => (
            <ClassCard key={session.id} session={session} showDay />
          ))}
        </>
      )}

      <SectionTitle title="Account" />
      <Card style={{ padding: 0 }}>
        <MenuRow icon="receipt-outline" label={`Mijn bestellingen (${store.orders.length})`} onPress={() => router.push('/bestellingen')} />
        <MenuRow icon="mail-outline" label={user.email} />
        <MenuRow icon="log-out-outline" label="Uitloggen" onPress={store.logout} />
        <MenuRow icon="trash-outline" label="Account verwijderen" danger onPress={onDelete} />
      </Card>
      <InfoLinks />
    </ScrollView>
  );
}

function InfoLinks() {
  return (
    <>
      <SectionTitle title="Over de club" />
      <Card style={{ padding: 0 }}>
        <MenuRow icon="globe-outline" label="Website" onPress={() => WebBrowser.openBrowserAsync(GYM.website)} />
        <MenuRow icon="time-outline" label={`Uitschrijven kan tot ${GYM.cancelHoursBefore} uur voor de les`} />
      </Card>
    </>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [s.menuRow, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.navy} />
      <Text style={[s.menuLabel, danger && { color: colors.danger }]} numberOfLines={1}>
        {label}
      </Text>
      {onPress && <Ionicons name="chevron-forward" size={18} color={colors.muted} />}
    </Pressable>
  );
}

const s = StyleSheet.create({
  pass: { backgroundColor: colors.navy, borderRadius: radius.lg, padding: space.xl, overflow: 'hidden' },
  passTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  passBrand: { color: '#C7CDF0', fontWeight: '700', fontSize: 14 },
  passLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passLogoText: { fontWeight: '900', color: colors.navyDark },
  passName: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: space.xl },
  passMeta: { color: '#C7CDF0', fontSize: 15, marginTop: 2, letterSpacing: 1 },
  passBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.xl,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: '#ffffff30',
  },
  passPlan: { color: colors.lime, fontWeight: '800', fontSize: 15 },
  passStatus: { color: '#fff', fontSize: 13, textTransform: 'capitalize' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '600' },
});
