import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, type TextInputInstance } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { PressableScale } from '@/components/PressableScale';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const t = useTheme();
  const { logIn } = useAuth();
  const passwordRef = useRef<TextInputInstance>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setErrors({});
    const res = await logIn(email, password);
    setBusy(false);
    if (!res.ok) {
      setErrors({ [res.field ?? 'password']: res.error });
      return;
    }
    router.replace('/');
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to see your favourites, cart and past orders.">
      <Field
        label="Email"
        icon="mail"
        placeholder="you@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <Field
        ref={passwordRef}
        label="Password"
        icon="lock"
        placeholder="Your password"
        password
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        error={errors.password}
        autoComplete="current-password"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <Button title="Log in" onPress={submit} loading={busy} style={{ marginTop: 6 }} />
      <PressableScale
        accessibilityRole="link"
        onPress={() => router.replace('/signup')}
        scaleTo={0.96}
        style={{ alignItems: 'center', paddingVertical: 6 }}>
        <Text style={{ color: t.muted, fontSize: 14 }}>
          New here? <Text style={{ color: t.primary, fontWeight: '800' }}>Create an account</Text>
        </Text>
      </PressableScale>
    </AuthShell>
  );
}
