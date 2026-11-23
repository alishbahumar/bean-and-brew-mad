import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';

type Props = { active: boolean; onPress: () => void; size?: number; style?: StyleProp<ViewStyle>; color?: string };

/** Heart that "pops" when you favourite something. */
export function HeartButton({ active, onPress, size = 18, style, color = '#E9CF9F' }: Props) {
  const pop = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from favorites' : 'Add to favorites'}
      hitSlop={8}
      onPress={() => {
        if (!active) pop.set(withSequence(withTiming(1.5, { duration: 120 }), withSpring(1, { damping: 6, stiffness: 220 })));
        onPress();
      }}
      style={style}>
      <Animated.View style={animated}>
        <Icon name="heart" color={active ? '#E57373' : color} size={size} filled={active} />
      </Animated.View>
    </PressableScale>
  );
}
