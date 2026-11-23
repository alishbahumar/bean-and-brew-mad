import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { Art } from '@/components/ProductArt';
import { fonts, gradients, useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { HERO_PHOTO, toSource } from '@/data/images';

export default function WelcomeScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { continueAsGuest } = useAuth();

  // Slow "Ken Burns" zoom on the background photo.
  const zoom = useSharedValue(1);
  useEffect(() => {
    zoom.set(withRepeat(withSequence(withTiming(1.12, { duration: 9000, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.quad) })), -1));
  }, [zoom]);
  const bg = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));

  const guest = () => {
    continueAsGuest();
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <LinearGradient colors={gradients.welcome} style={StyleSheet.absoluteFill} />
      <Animated.View style={[StyleSheet.absoluteFill, bg]}>
        <View style={styles.fallbackArt}>
          <Art kind="cup" tint="#9A6842" size={260} />
        </View>
        <Image source={toSource(HERO_PHOTO)} style={StyleSheet.absoluteFill} contentFit="cover" transition={900} cachePolicy="memory-disk" />
      </Animated.View>
      <LinearGradient colors={['rgba(15,11,9,0.15)', 'rgba(15,11,9,0.55)', 'rgba(15,11,9,0.97)']} locations={[0, 0.5, 0.82]} style={StyleSheet.absoluteFill} />

      <View style={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <Animated.View entering={FadeInDown.delay(150).duration(700)} style={styles.logo}>
          <Text style={[styles.logoText, { color: t.primary }]}>BEAN & BREW</Text>
          <View style={[styles.logoLine, { backgroundColor: t.primary }]} />
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.Text entering={FadeInUp.delay(350).duration(800)} style={[styles.title, { color: t.text }]}>
          Handcrafted coffee,{'\n'}made for you.
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(550).duration(800)} style={[styles.sub, { color: '#cdbfae' }]}>
          Order your favourite brews and bakes in seconds. Pickup or dine-in, always fresh.
        </Animated.Text>

        <Animated.View entering={FadeInUp.delay(750).duration(800)} style={styles.buttons}>
          <Button title="Create account" onPress={() => router.push('/signup')} />
          <Button title="I already have an account" variant="outline" onPress={() => router.push('/login')} />
          <PressableScale accessibilityRole="button" onPress={guest} scaleTo={0.94} style={styles.guest}>
            <Text style={{ color: t.muted, fontWeight: '700', fontSize: 14 }}>Continue as guest</Text>
          </PressableScale>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackArt: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', paddingTop: 140 },
  content: { flex: 1, paddingHorizontal: 24, width: '100%', maxWidth: 520, alignSelf: 'center' },
  logo: { alignItems: 'center', gap: 8 },
  logoText: { fontSize: 14, fontWeight: '800', letterSpacing: 6 },
  logoLine: { width: 36, height: 2, borderRadius: 1 },
  title: { fontSize: 40, fontFamily: fonts.display, fontWeight: '700', lineHeight: 46 },
  sub: { fontSize: 15.5, lineHeight: 23, marginTop: 10, marginBottom: 22 },
  buttons: { gap: 12 },
  guest: { alignItems: 'center', paddingVertical: 10 },
});
