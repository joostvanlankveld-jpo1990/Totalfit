import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Card, Field, Pill } from '../components/ui';
import { MEMBERSHIP_PLANS } from '../data/catalog';
import { dateKey, formatPrice } from '../lib/format';
import { notify } from '../lib/dialog';
import { colors, radius, space } from '../lib/theme';
import { makeMemberNumber, useStore } from '../store/AppStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IBAN_RE = /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/;

export default function Lidmaatschap() {
  const store = useStore();
  const [planId, setPlanId] = useState(MEMBERSHIP_PLANS.find((p) => p.highlight)?.id ?? MEMBERSHIP_PLANS[0].id);
  const [form, setForm] = useState({
    firstName: store.user?.firstName ?? '',
    lastName: store.user?.lastName ?? '',
    email: store.user?.email ?? '',
    phone: store.user?.phone ?? '',
    birthDate: '',
    iban: '',
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId)!;
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (store.membership) {
    return (
      <View style={{ padding: space.lg }}>
        <Card style={{ gap: space.sm }}>
          <Text style={s.title}>Je bent al lid 🎉</Text>
          <Text style={s.sub}>Je lidmaatschap kun je bekijken onder Profiel.</Text>
          <Button title="Naar mijn profiel" onPress={() => router.navigate('/profiel')} />
        </Card>
      </View>
    );
  }

  const onSubmit = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Verplicht';
    if (!form.lastName.trim()) e.lastName = 'Verplicht';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Vul een geldig e-mailadres in';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Vul een geldig telefoonnummer in';
    if (!/^\d{2}-\d{2}-\d{4}$/.test(form.birthDate)) e.birthDate = 'Gebruik dd-mm-jjjj';
    if (!IBAN_RE.test(form.iban.replace(/\s/g, '').toUpperCase())) e.iban = 'Vul een geldig IBAN in';
    if (!agree) e.agree = 'Ga akkoord met de voorwaarden om verder te gaan';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    // Demo: verstuur in de echte versie naar het ledensysteem.
    setTimeout(() => {
      store.login({
        id: form.email.trim().toLowerCase(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        memberNumber: store.user?.memberNumber ?? makeMemberNumber(),
      });
      store.setMembership({ planId, startDate: dateKey(new Date()), status: 'in behandeling' });
      setLoading(false);
      router.back();
      notify('Welkom bij Total Fit! 🎉', 'Je inschrijving is ontvangen. Je ontvangt een bevestiging per e-mail.');
    }, 800);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Kies je abonnement</Text>
        <Text style={s.sub}>Alle abonnementen zijn maandelijks opzegbaar.</Text>

        <View style={{ gap: space.md, marginTop: space.lg }}>
          {MEMBERSHIP_PLANS.map((p) => {
            const active = p.id === planId;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPlanId(p.id)}
                accessibilityState={{ selected: active }}
                style={[s.plan, active && s.planActive]}
              >
                <View style={s.planHead}>
                  <View style={{ flex: 1, gap: 4 }}>
                    {p.highlight && <Pill label="Meest gekozen" color={colors.navyDark} bg={colors.lime} />}
                    <Text style={s.planName}>{p.name}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.planPrice}>{formatPrice(p.monthlyCents)}</Text>
                    <Text style={s.planPer}>per maand</Text>
                  </View>
                </View>
                {p.perks.map((perk) => (
                  <View key={perk} style={s.perk}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                    <Text style={s.perkText}>{perk}</Text>
                  </View>
                ))}
                <Text style={s.fee}>
                  {p.signupFeeCents ? `Eenmalig ${formatPrice(p.signupFeeCents)} inschrijfkosten` : 'Geen inschrijfkosten'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[s.title, { fontSize: 20, marginTop: space.xl }]}>Je gegevens</Text>
        <View style={{ gap: space.md, marginTop: space.md }}>
          <View style={{ flexDirection: 'row', gap: space.md }}>
            <View style={{ flex: 1 }}>
              <Field label="Voornaam" value={form.firstName} onChangeText={set('firstName')} error={errors.firstName} textContentType="givenName" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Achternaam" value={form.lastName} onChangeText={set('lastName')} error={errors.lastName} textContentType="familyName" />
            </View>
          </View>
          <Field
            label="E-mailadres"
            value={form.email}
            onChangeText={set('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            error={errors.email}
          />
          <Field label="Telefoonnummer" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" textContentType="telephoneNumber" error={errors.phone} />
          <Field
            label="Geboortedatum"
            value={form.birthDate}
            onChangeText={set('birthDate')}
            placeholder="dd-mm-jjjj"
            keyboardType="numbers-and-punctuation"
            error={errors.birthDate}
          />
          <Field
            label="IBAN (voor de automatische incasso)"
            value={form.iban}
            onChangeText={set('iban')}
            autoCapitalize="characters"
            placeholder="NL00 BANK 0123 4567 89"
            error={errors.iban}
          />
          <View style={s.agree}>
            <Switch value={agree} onValueChange={setAgree} trackColor={{ true: colors.navy, false: colors.border }} />
            <Text style={s.agreeText}>Ik ga akkoord met de algemene voorwaarden en machtig Total Fit Vlijmen voor de maandelijkse incasso.</Text>
          </View>
          {errors.agree && <Text style={{ color: colors.danger, fontSize: 13 }}>{errors.agree}</Text>}
        </View>

        <Card style={{ marginTop: space.xl, gap: space.sm }}>
          <Row label={`Abonnement ${plan.name}`} value={`${formatPrice(plan.monthlyCents)} p/m`} />
          <Row label="Inschrijfkosten (eenmalig)" value={formatPrice(plan.signupFeeCents)} />
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: space.xs }} />
          <Row label="Eerste betaling" value={formatPrice(plan.monthlyCents + plan.signupFeeCents)} bold />
        </Card>

        <Button title="Inschrijving afronden" onPress={onSubmit} loading={loading} style={{ marginTop: space.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={[{ fontSize: 15, color: colors.muted }, bold && { color: colors.text, fontWeight: '800' }]}>{label}</Text>
      <Text style={[{ fontSize: 15, color: colors.text, fontWeight: '600' }, bold && { fontWeight: '800' }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  sub: { fontSize: 15, color: colors.muted, marginTop: 4 },
  plan: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: space.sm,
  },
  planActive: { borderColor: colors.navy },
  planHead: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: space.xs },
  planName: { fontSize: 20, fontWeight: '800', color: colors.text },
  planPrice: { fontSize: 22, fontWeight: '800', color: colors.navy },
  planPer: { fontSize: 12, color: colors.muted },
  perk: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  perkText: { fontSize: 15, color: colors.text },
  fee: { fontSize: 13, color: colors.muted, marginTop: space.xs },
  agree: { flexDirection: 'row', gap: space.md, alignItems: 'center' },
  agreeText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
});
