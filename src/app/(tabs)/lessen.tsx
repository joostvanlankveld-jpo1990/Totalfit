import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ClassCard } from '../../components/ClassCard';
import { EmptyState } from '../../components/ui';
import { getSchedule, SCHEDULE_DAYS } from '../../data/api';
import { CLASS_TYPES } from '../../data/catalog';
import { ClassCategory } from '../../data/types';
import { dayShort, isSameDay, monthShort } from '../../lib/format';
import { colors, radius, space } from '../../lib/theme';

const FILTERS: { id: ClassCategory | 'alle'; label: string }[] = [
  { id: 'alle', label: 'Alle lessen' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'kracht', label: 'Kracht' },
  { id: 'mind-body', label: 'Mind & body' },
  { id: 'dans', label: 'Dans' },
  { id: 'senioren', label: '60+' },
];

export default function Lessen() {
  const schedule = useMemo(() => getSchedule(), []);
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: SCHEDULE_DAYS }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      return d;
    });
  }, []);
  const [selected, setSelected] = useState(days[0]);
  const [filter, setFilter] = useState<ClassCategory | 'alle'>('alle');

  const sessions = schedule.filter((s) => {
    if (!isSameDay(new Date(s.start), selected)) return false;
    if (filter === 'alle') return true;
    return CLASS_TYPES.find((c) => c.id === s.classTypeId)?.category === filter;
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.days}
        style={{ flexGrow: 0, flexShrink: 0 }}
      >
        {days.map((d) => {
          const active = isSameDay(d, selected);
          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => setSelected(d)}
              accessibilityState={{ selected: active }}
              style={[s.day, active && s.dayActive]}
            >
              <Text style={[s.dayName, active && s.dayTextActive]}>{dayShort(d)}</Text>
              <Text style={[s.dayNum, active && s.dayTextActive]}>{d.getDate()}</Text>
              <Text style={[s.dayMonth, active && s.dayTextActive]}>{monthShort(d)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filters}
        style={{ flexGrow: 0, flexShrink: 0 }}
      >
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <Pressable key={f.id} onPress={() => setFilter(f.id)} style={[s.chip, active && s.chipActive]}>
              <Text style={[s.chipText, active && s.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClassCard session={item} />}
        contentContainerStyle={{ padding: space.lg, paddingTop: space.sm }}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-clear-outline"
            title="Geen lessen"
            text="Er staan op deze dag geen lessen gepland die bij je filter passen."
          />
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  days: { paddingHorizontal: space.lg, gap: space.sm, paddingVertical: space.sm },
  day: {
    width: 56,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dayActive: { backgroundColor: colors.navy },
  dayName: { fontSize: 12, fontWeight: '600', color: colors.muted, textTransform: 'uppercase' },
  dayNum: { fontSize: 20, fontWeight: '800', color: colors.text },
  dayMonth: { fontSize: 11, color: colors.muted },
  dayTextActive: { color: '#fff' },
  filters: { paddingHorizontal: space.lg, gap: space.sm, paddingBottom: space.sm },
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
  chipTextActive: { color: colors.navyDark },
});
