import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { Button, Field } from '../components/ui';
import { colors, space } from '../lib/theme';
import { makeMemberNumber, useStore } from '../store/AppStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Inloggen() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    const e: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) e.email = 'Vul een geldig e-mailadres in';
    if (password.length < 6) e.password = 'Wachtwoord moet minimaal 6 tekens zijn';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    // Demo-login: vervang door authenticatie via de backend.
    setTimeout(() => {
      const name = email.split('@')[0].split(/[._-]/)[0];
      login({
        id: email.trim().toLowerCase(),
        firstName: name.charAt(0).toUpperCase() + name.slice(1),
        lastName: '',
        email: email.trim().toLowerCase(),
        memberNumber: makeMemberNumber(),
      });
      setLoading(false);
      router.back();
    }, 500);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Welkom terug</Text>
        <Text style={s.sub}>Log in om lessen te boeken en je lidmaatschap te bekijken.</Text>
        <Field
          label="E-mailadres"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="naam@voorbeeld.nl"
          error={errors.email}
        />
        <Field
          label="Wachtwoord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          placeholder="••••••"
          error={errors.password}
          onSubmitEditing={onSubmit}
        />
        <Button title="Inloggen" onPress={onSubmit} loading={loading} style={{ marginTop: space.sm }} />
        <Button
          title="Nog geen lid? Schrijf je in"
          variant="ghost"
          onPress={() => {
            router.back();
            router.push('/lidmaatschap');
          }}
        />
        <Text style={s.demo}>Demo-versie: elk e-mailadres met een wachtwoord van 6+ tekens werkt.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { padding: space.xl, gap: space.lg },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  sub: { fontSize: 15, color: colors.muted, lineHeight: 21, marginTop: -space.sm },
  demo: { fontSize: 13, color: colors.muted, textAlign: 'center' },
});
