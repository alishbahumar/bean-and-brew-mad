import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { PressableScale } from '@/components/PressableScale';
import { radius, useTheme } from '@/constants/theme';

type Props = { value: number; onChange: (delta: number) => void; min?: number };

export function QuantityStepper({ value, onChange, min = 1 }: Props) {
  const t = useTheme();
  const btn = [styles.btn, { backgroundColor: t.tile }];
  return (
    <View style={styles.row}>
      <PressableScale
        accessibilityLabel="Decrease quantity"
        disabled={value <= min}
        onPress={() => onChange(-1)}
        scaleTo={0.85}
        style={[btn, { opacity: value <= min ? 0.4 : 1 }]}>
        <Text style={[styles.sign, { color: t.text }]}>−</Text>
      </PressableScale>
      {/* key={value} re-mounts the number so it pops in every time it changes */}
      <Animated.Text key={value} entering={ZoomIn.duration(220)} style={[styles.value, { color: t.text }]}>
        {value}
      </Animated.Text>
      <PressableScale accessibilityLabel="Increase quantity" onPress={() => onChange(1)} scaleTo={0.85} style={btn}>
        <Text style={[styles.sign, { color: t.text }]}>+</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sign: { fontSize: 20, fontWeight: '700', lineHeight: 24 },
  value: { minWidth: 22, textAlign: 'center', fontSize: 16, fontWeight: '700' },
});
