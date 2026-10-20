import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClassCard } from '../../components/ClassCard';
import { Button, Card, SectionTitle } from '../../components/ui';
import { getSchedule } from '../../data/api';
import { GYM, planById } from '../../data/catalog';
import { formatTime, relativeDay } from '../../lib/format';
import { colors, radius, space } from '../../lib/theme';
import { classTypeById } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Goedenacht';
  if (h < 12) return 'Goedemorgen';
  if (h < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { user, membership, bookings } = useStore();
  const schedule = useMemo(() => getSchedule(), []);
  const now = Date.now();
  const upcoming = schedule.filter((s) => new Date(s.start).getTime() > now);
  const myNext = upcoming.find((s) => bookings.includes(s.id));
  const nextUp = upcoming.slice(0, 3);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: space.xl }}>
      <View style={[s.hero, { paddingTop: insets.top + space.lg }]}>
        <View style={s.brandRow}>
          <View style={s.logo}>
            <Text style={s.logoText}>TF</Text>
          </View>
          <Text style={s.brand}>{GYM.name}</Text>
        </View>
        <Text style={s.hello}>
          {greeting()}
          {user ? `, ${user.firstName}` : ''} 👋
        </Text>
        <Text style={s.sub}>
          {membership
            ? `Lidmaatschap ${planById(membership.planId)?.name ?? ''} · ${membership.status}`
            : 'Klaar om te sporten? Boek je les in een paar tikken.'}
        </Text>

        {myNext ? (
          <Pressable onPress={() => router.push(`/les/${myNext.id}`)} style={s.nextCard}>
            <View style={s.nextIcon}>
              <Ionicons name="checkmark-circle" size={26} color={colors.navyDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.nextLabel}>Je volgende les</Text>
              <Text style={s.nextTitle}>{classTypeById(myNext.classTypeId).name}</Text>
              <Text style={s.nextMeta}>
                {relativeDay(new Date(myNext.start))} · {formatTime(new Date(myNext.start))} · {myNext.room}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.navyDark} />
          </Pressable>
        ) : (
          <Button
            title="Bekijk het lesrooster"
            icon="calendar"
            variant="lime"
            onPress={() => router.navigate('/lessen')}
            style={{ marginTop: space.lg }}
          />
        )}
      </View>

      <View style={{ paddingHorizontal: space.lg }}>
        <View style={s.actions}>
          <QuickAction icon="calendar-outline" label="Lessen" onPress={() => router.navigate('/lessen')} />
          <QuickAction icon="bag-handle-outline" label="Webshop" onPress={() => router.navigate('/shop')} />
          <QuickAction
            icon={membership ? 'card-outline' : 'person-add-outline'}
            label={membership ? 'Mijn pas' : 'Lid worden'}
            onPress={() => router.navigate(membership ? '/profiel' : '/lidmaatschap')}
          />
        </View>

        {!membership && (
          <Card style={s.promo}>
            <Text style={s.promoTitle}>Word lid van {GYM.name}</Text>
            <Text style={s.promoText}>
              Onbeperkt fitness, groepslessen en persoonlijke begeleiding. Schrijf je direct in via de app.
            </Text>
            <Button
              title="Bekijk abonnementen"
              variant="primary"
              onPress={() => router.push('/lidmaatschap')}
              style={{ marginTop: space.md, alignSelf: 'flex-start' }}
            />
          </Card>
        )}

        <SectionTitle
          title="Straks in de club"
          action={
            <Pressable onPress={() => router.navigate('/lessen')}>
              <Text style={s.link}>Alles</Text>
            </Pressable>
          }
        />
        {nextUp.map((session) => (
          <ClassCard key={session.id} session={session} showDay />
        ))}
      </View>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.action, pressed && { opacity: 0.8 }]}>
      <View style={s.actionIcon}>
        <Ionicons name={icon} size={24} color={colors.navy} />
      </View>
      <Text style={s.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  hero: {
    backgroundColor: colors.navy,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontWeight: '900', color: colors.navyDark, fontSize: 14 },
  brand: { color: '#fff', fontWeight: '700', fontSize: 15, opacity: 0.9 },
  hello: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: space.xl },
  sub: { color: '#C7CDF0', fontSize: 15, marginTop: 4, lineHeight: 21 },
  nextCard: {
    marginTop: space.lg,
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    padding: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  nextIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff70',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: { fontSize: 12, fontWeight: '700', color: colors.navyDark, textTransform: 'uppercase' },
  nextTitle: { fontSize: 18, fontWeight: '800', color: colors.navyDark },
  nextMeta: { fontSize: 13, color: colors.navyDark, opacity: 0.8 },
  actions: { flexDirection: 'row', gap: space.md, marginTop: space.lg },
  action: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    paddingVertical: space.lg,
    alignItems: 'center',
    gap: space.sm,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  promo: { marginTop: space.lg, backgroundColor: colors.limeSoft },
  promoTitle: { fontSize: 18, fontWeight: '800', color: colors.navyDark },
  promoText: { fontSize: 14, color: colors.text, marginTop: 6, lineHeight: 20 },
  link: { color: colors.navy, fontWeight: '700', fontSize: 15 },
});
