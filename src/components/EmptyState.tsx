import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/Icon';
import { radius, useTheme } from '@/constants/theme';

type Props = { icon: IconName; title: string; subtitle: string; children?: React.ReactNode };

export function EmptyState({ icon, title, subtitle, children }: Props) {
  const t = useTheme();
  const float = useSharedValue(0);
  useEffect(() => {
    float.set(withRepeat(withSequence(withTiming(-10, { duration: 1200 }), withTiming(0, { duration: 1200 })), -1));
  }, [float]);
  const bob = useAnimatedStyle(() => ({ transform: [{ translateY: float.value }] }));

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.wrap}>
      <Animated.View style={[styles.badge, { backgroundColor: t.tile, borderColor: t.border }, bob]}>
        <Icon name={icon} color={t.primary} size={38} />
      </Animated.View>
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      <Text style={[styles.sub, { color: t.muted }]}>{subtitle}</Text>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  badge: { width: 96, height: 96, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 14, textAlign: 'center', marginBottom: 12 },
});
