import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, type TextInputInstance } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { PressableScale } from '@/components/PressableScale';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

type Errors = { name?: string; email?: string; password?: string; confirm?: string };

export default function SignupScreen() {
  const t = useTheme();
  const { signUp } = useAuth();
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const confirmRef = useRef<TextInputInstance>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const clear = (key: keyof Errors) => errors[key] && setErrors((e) => ({ ...e, [key]: undefined }));

  const submit = async () => {
    if (busy) return;
    if (password !== confirm) {
      setErrors({ confirm: 'Passwords do not match.' });
      return;
    }
    setBusy(true);
    setErrors({});
    const res = await signUp(name, email, password);
    setBusy(false);
    if (!res.ok) {
      setErrors({ [res.field ?? 'email']: res.error });
      return;
    }
    router.replace('/');
  };

  return (
    <AuthShell title="Create account" subtitle="Join Bean & Brew and order your first cup in seconds.">
      <Field
        label="Full name"
        icon="user"
        placeholder="Your name"
        value={name}
        onChangeText={(v) => {
          setName(v);
          clear('name');
        }}
        error={errors.name}
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <Field
        ref={emailRef}
        label="Email"
        icon="mail"
        placeholder="you@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          clear('email');
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
        placeholder="At least 6 characters"
        password
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          clear('password');
        }}
        error={errors.password}
        autoComplete="new-password"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
      />
      <Field
        ref={confirmRef}
        label="Confirm password"
        icon="lock"
        placeholder="Type it again"
        password
        value={confirm}
        onChangeText={(v) => {
          setConfirm(v);
          clear('confirm');
        }}
        error={errors.confirm}
        autoComplete="new-password"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <Button title="Sign up" onPress={submit} loading={busy} style={{ marginTop: 6 }} />
      <PressableScale
        accessibilityRole="link"
        onPress={() => router.replace('/login')}
        scaleTo={0.96}
        style={{ alignItems: 'center', paddingVertical: 6 }}>
        <Text style={{ color: t.muted, fontSize: 14 }}>
          Already have an account? <Text style={{ color: t.primary, fontWeight: '800' }}>Log in</Text>
        </Text>
      </PressableScale>
    </AuthShell>
  );
}
