import { forwardRef, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/Icon';
import { radius, useTheme } from '@/constants/theme';

type Props = TextInputProps & { label: string; icon: IconName; error?: string; password?: boolean };

/** Text input with an icon, animated focus border, show/hide password and a shake on error. */
export const Field = forwardRef<TextInputInstance, Props>(function Field({ label, icon, error, password, onFocus, onBlur, ...rest }, ref) {
  const t = useTheme();
  const [hidden, setHidden] = useState(!!password);
  const focus = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (error) {
      shake.value = withSequence(
        withTiming(-9, { duration: 55 }),
        withRepeat(withTiming(9, { duration: 90 }), 4, true),
        withTiming(0, { duration: 55 }),
      );
    }
  }, [error, shake]);

  const box = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
    borderColor: error ? t.danger : interpolateColor(focus.value, [0, 1], [t.border, t.primary]),
    backgroundColor: interpolateColor(focus.value, [0, 1], ['rgba(255,255,255,0.05)', 'rgba(212,167,98,0.08)']),
  }));

  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.label, { color: t.muted }]}>{label}</Text>
      <Animated.View style={[styles.box, box]}>
        <Icon name={icon} color={error ? t.danger : t.muted} size={19} />
        <TextInput
          ref={ref}
          placeholderTextColor="#7d6f63"
          secureTextEntry={hidden}
          autoCapitalize={password ? 'none' : rest.autoCapitalize}
          onFocus={(e) => {
            focus.set(withTiming(1, { duration: 180 }));
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focus.set(withTiming(0, { duration: 180 }));
            onBlur?.(e);
          }}
          style={[styles.input, { color: t.text }]}
          {...rest}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={10}
            onPress={() => setHidden((h) => !h)}>
            <Icon name={hidden ? 'eye' : 'eyeoff'} color={t.muted} size={20} />
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? (
        <Animated.Text entering={FadeIn.duration(200)} style={[styles.error, { color: t.danger }]}>
          {error}
        </Animated.Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: { fontSize: 12.5, fontWeight: '700', letterSpacing: 0.4, marginLeft: 4 },
  box: {
    height: 54,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: { flex: 1, fontSize: 16, height: '100%', outlineStyle: 'none' } as never,
  error: { fontSize: 12.5, fontWeight: '600', marginLeft: 6 },
});
