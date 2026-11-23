import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { useFeedback } from '@/components/Feedback';
import { fonts, formatPrice, radius, useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { pointsFor, tierFor } from '@/lib/loyalty';

const TECH = ['Expo SDK 58', 'React Native 0.88', 'TypeScript', 'Expo Router', 'Reanimated', 'expo-image', 'Context API', 'Firebase Auth', 'Cloud Firestore', 'REST API (fetch)', 'AsyncStorage', 'Promo codes', 'Loyalty points'];

export default function ProfileScreen() {
  const t = useTheme();
  const { confirm, toast } = useFeedback();
  const { user, updateName, logOut } = useAuth();
  const { orders, favorites, resetAll } = useStore();
  const [draft, setDraft] = useState(user?.name ?? '');
  const spent = orders.reduce((sum, o) => sum + o.total, 0);
  const points = pointsFor(orders);
  const tier = tierFor(points);

  const save = () => {
    updateName(draft);
    toast('Name updated');
  };

  const onReset = () =>
    confirm('Reset app data?', 'This clears your cart, favorites and saved orders.', [
      { label: 'Cancel', style: 'cancel' },
      { label: 'Reset', style: 'destructive', onPress: resetAll },
    ]);

  const onLogout = () =>
    confirm(
      user?.isGuest ? 'Leave guest mode?' : 'Log out?',
      user?.isGuest ? 'Guest data stays on this device.' : 'You can log back in any time with your email and password.',
      [
        { label: 'Cancel', style: 'cancel' },
        { label: user?.isGuest ? 'Leave' : 'Log out', style: 'destructive', onPress: logOut },
      ],
    );

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.duration(500)} style={styles.top}>
        <Animated.View entering={ZoomIn.delay(100).springify().damping(12)} style={[styles.ring, { borderColor: t.primary }]}>
          <View style={[styles.avatar, { backgroundColor: t.primary }]}>
            <Text style={[styles.initial, { color: t.onPrimary }]}>{(user?.name || 'G').charAt(0).toUpperCase()}</Text>
          </View>
        </Animated.View>
        <Text style={[styles.name, { color: t.text }]}>{user?.name || 'Guest'}</Text>
        <Text style={{ color: t.muted }}>{user?.email ?? 'Guest · Bean & Brew visitor'}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.stats}>
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Favorites" value={String(favorites.length)} />
        <Stat label="Spent" value={formatPrice(spent)} />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(210).duration(500)}
        style={[styles.reward, { backgroundColor: t.card, borderColor: t.primary }]}>
        <View style={styles.rewardTop}>
          <Text style={{ color: t.text, fontSize: 16, fontWeight: '800' }}>
            {tier.current.name} member
          </Text>
          <Text style={{ color: t.primary, fontSize: 18, fontWeight: '800' }}>{points} pts</Text>
        </View>
        <View style={[styles.bar, { backgroundColor: t.tile }]}>
          <View style={[styles.barFill, { backgroundColor: t.primary, width: `${Math.round(tier.progress * 100)}%` }]} />
        </View>
        <Text style={{ color: t.muted, fontSize: 12.5 }}>
          {tier.next
            ? `${tier.toNext} more points to reach ${tier.next.name}. Earn 1 point for every Rs 10 spent.`
            : 'You reached the top tier. Thank you for being a regular!'}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(260).duration(500)} style={{ gap: 12 }}>
        <Text style={[styles.section, { color: t.text }]}>Your name</Text>
        <Field label="Display name" icon="user" value={draft} onChangeText={setDraft} placeholder="Enter your name" />
        <Button title="Save" onPress={save} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(360).duration(500)} style={{ gap: 12 }}>
        <Text style={[styles.section, { color: t.text }]}>About this project</Text>
        <View style={[styles.about, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={{ color: t.muted, lineHeight: 21 }}>
            Bean & Brew is a coffee ordering app made for the Mobile Application Development course. Built with:
          </Text>
          <View style={styles.techRow}>
            {TECH.map((x) => (
              <View key={x} style={[styles.pill, { borderColor: t.primary }]}>
                <Text style={{ color: t.primary, fontSize: 12, fontWeight: '700' }}>{x}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(440).duration(500)} style={{ gap: 12 }}>
        <Button title={user?.isGuest ? 'Leave guest mode' : 'Log out'} onPress={onLogout} />
        <Button title="Reset app data" variant="outline" onPress={onReset} />
      </Animated.View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: t.card, borderColor: t.border }]}>
      <Text style={{ color: t.primary, fontSize: 18, fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: t.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40, gap: 16, width: '100%', maxWidth: 640, alignSelf: 'center' },
  top: { alignItems: 'center', gap: 4, marginVertical: 8 },
  ring: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  initial: { fontSize: 36, fontWeight: '800', fontFamily: fonts.display },
  name: { fontSize: 24, fontWeight: '800', fontFamily: fonts.display },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 14, borderRadius: radius.md, borderWidth: 1 },
  section: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  reward: { padding: 16, borderRadius: radius.md, borderWidth: 1, gap: 10 },
  rewardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  about: { padding: 16, borderRadius: radius.md, borderWidth: 1, gap: 12 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, borderWidth: 1 },
});
