import { ActivityIndicator, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { radius, useTheme } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', disabled, loading, style }: Props) {
  const t = useTheme();
  const isPrimary = variant === 'primary';
  const color = isPrimary ? t.onPrimary : t.primary;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      scaleTo={0.97}
      style={[
        styles.base,
        isPrimary && { backgroundColor: t.primary },
        variant === 'outline' && { borderWidth: 1.5, borderColor: t.primary },
        { opacity: disabled ? 0.45 : 1 },
        style,
      ]}>
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.text, { color }]}>{title}</Text>}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
