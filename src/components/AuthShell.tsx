import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { fonts, gradients, radius, useTheme } from '@/constants/theme';
import { AUTH_PHOTO, toSource } from '@/data/images';

type Props = { title: string; subtitle: string; children: ReactNode };

/** Shared layout for the Log in and Sign up screens: photo on top, form card below. */
export function AuthShell({ title, subtitle, children }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const zoom = useSharedValue(1.18);
  useEffect(() => {
    zoom.set(withTiming(1, { duration: 1600, easing: Easing.out(Easing.cubic) }));
  }, [zoom]);
  const photo = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));

  // When the keyboard is open we shrink the header so the form stays visible above the keyboard.
  const [kbOpen, setKbOpen] = useState(false);
  useEffect(() => {
    const showEv = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEv = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const a = Keyboard.addListener(showEv, () => setKbOpen(true));
    const b = Keyboard.addListener(hideEv, () => setKbOpen(false));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={[styles.photoBox, kbOpen && { height: insets.top + 150 }]}>
        <LinearGradient colors={gradients.welcome} style={StyleSheet.absoluteFill} />
        <Animated.View style={[StyleSheet.absoluteFill, photo]}>
          <Image source={toSource(AUTH_PHOTO)} style={StyleSheet.absoluteFill} contentFit="cover" transition={700} cachePolicy="memory-disk" />
        </Animated.View>
        <LinearGradient colors={gradients.photoFadeSoft} style={StyleSheet.absoluteFill} />
      </View>

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
        scaleTo={0.88}
        style={[styles.back, { top: insets.top + 10 }]}>
        <Icon name="back" color="#F6EDE3" size={22} />
      </PressableScale>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            kbOpen
              ? { justifyContent: 'flex-start', paddingTop: insets.top + 64 }
              : { justifyContent: 'flex-end', paddingTop: 150 },
            { paddingBottom: insets.bottom + 28 },
          ]}>
          <Animated.View entering={FadeInLeft.delay(150).duration(600)} style={styles.head}>
            <Text style={[styles.brand, { color: t.primary }]}>BEAN & BREW</Text>
            <Text style={[styles.title, { color: t.text }]}>{title}</Text>
            <Text style={[styles.sub, { color: t.muted }]}>{subtitle}</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).duration(650).springify().damping(18)}
            style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
            {children}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  photoBox: { position: 'absolute', top: 0, left: 0, right: 0, height: 330, overflow: 'hidden' },
  back: {
    position: 'absolute',
    left: 16,
    zIndex: 5,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15,11,9,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flexGrow: 1, paddingHorizontal: 18, gap: 18 },
  head: { paddingHorizontal: 6, gap: 4 },
  brand: { fontSize: 12, fontWeight: '800', letterSpacing: 4 },
  title: { fontSize: 34, fontFamily: fonts.display, fontWeight: '700', lineHeight: 40 },
  sub: { fontSize: 14.5, lineHeight: 21 },
  card: { borderRadius: radius.xl, borderWidth: 1, padding: 20, gap: 14, maxWidth: 520, width: '100%', alignSelf: 'center' },
});
