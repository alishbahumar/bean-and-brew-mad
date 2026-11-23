import { StyleSheet, Text } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { radius, useTheme } from '@/constants/theme';

type Props = { label: string; selected: boolean; onPress: () => void };

export function Chip({ label, selected, onPress }: Props) {
  const t = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      scaleTo={0.92}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? t.primary : t.card,
          borderColor: selected ? t.primary : t.border,
        },
      ]}>
      <Text style={[styles.label, { color: selected ? t.onPrimary : t.text }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: { fontSize: 14, fontWeight: '600' },
});
