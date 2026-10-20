import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { classTypeById } from '../data/catalog';
import { ClassSession } from '../data/types';
import { formatTime, relativeDay } from '../lib/format';
import { colors, radius, shadow, space } from '../lib/theme';
import { BookingStatus, useStore } from '../store/AppStore';

const STATUS_LABEL: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  geboekt: { label: 'Ingeschreven', color: '#fff', bg: colors.success },
  wachtlijst: { label: 'Wachtlijst', color: '#fff', bg: colors.warning },
  vol: { label: 'Vol', color: colors.danger, bg: '#FDE8EB' },
  beschikbaar: { label: '', color: colors.navy, bg: colors.limeSoft },
  voorbij: { label: 'Afgelopen', color: colors.muted, bg: colors.bg },
};

export function ClassCard({ session, showDay }: { session: ClassSession; showDay?: boolean }) {
  const { statusFor, spotsTaken } = useStore();
  const type = classTypeById(session.classTypeId);
  const start = new Date(session.start);
  const end = new Date(start.getTime() + session.durationMin * 60000);
  const status = statusFor(session);
  const free = Math.max(0, session.capacity - spotsTaken(session));
  const badge = STATUS_LABEL[status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${type.name} om ${formatTime(start)}`}
      onPress={() => router.push(`/les/${session.id}`)}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.85 }, status === 'voorbij' && { opacity: 0.55 }]}
    >
      <View style={[s.stripe, { backgroundColor: type.color }]} />
      <View style={s.time}>
        <Text style={s.timeStart}>{formatTime(start)}</Text>
        <Text style={s.timeEnd}>{formatTime(end)}</Text>
      </View>
      <View style={s.body}>
        {showDay && <Text style={s.day}>{relativeDay(start)}</Text>}
        <Text style={s.name}>{type.name}</Text>
        <Text style={s.meta} numberOfLines={1}>
          {session.room} · {session.instructor}
        </Text>
      </View>
      <View style={s.right}>
        <View style={[s.badge, { backgroundColor: badge.bg }]}>
          <Text style={[s.badgeText, { color: badge.color }]}>
            {status === 'beschikbaar' ? `${free} vrij` : badge.label}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingRight: space.md,
    marginBottom: space.sm,
    overflow: 'hidden',
    ...shadow,
  },
  stripe: { width: 5, alignSelf: 'stretch', marginRight: space.md },
  time: { width: 52 },
  timeStart: { fontSize: 16, fontWeight: '800', color: colors.text },
  timeEnd: { fontSize: 13, color: colors.muted },
  body: { flex: 1, paddingHorizontal: space.sm },
  day: { fontSize: 12, fontWeight: '700', color: colors.navy, textTransform: 'uppercase', marginBottom: 2 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badge: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
