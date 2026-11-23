import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { useFeedback } from '@/components/Feedback';
import { HeartButton } from '@/components/HeartButton';
import { Icon } from '@/components/Icon';
import { ProductPhoto } from '@/components/ProductPhoto';
import { QuantityStepper } from '@/components/QuantityStepper';
import { fonts, formatPrice, gradients, radius, useTheme } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';
import { MILKS, SIZES, getProduct, unitPriceFor, type MilkName, type SizeName } from '@/data/menu';

export default function ProductScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { toast } = useFeedback();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);
  const { addToCart, isFavorite, toggleFavorite } = useStore();

  const [size, setSize] = useState<SizeName>('Small');
  const [milk, setMilk] = useState<MilkName>('Regular');
  const [qty, setQty] = useState(1);

  // The photo slowly settles from a slight zoom when the screen opens.
  const zoom = useSharedValue(1.15);
  useEffect(() => {
    zoom.set(withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) }));
  }, [zoom]);
  const photoStyle = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));

  if (!product) {
    return <EmptyState icon="coffee" title="Item not found" subtitle="This item is no longer on the menu." />;
  }

  const effectiveSize: SizeName = product.isDrink ? size : 'Regular';
  const effectiveMilk: MilkName = product.isDrink ? milk : 'None';
  const unit = unitPriceFor(product, effectiveSize, effectiveMilk);
  const fav = isFavorite(product.id);

  const onAdd = () => {
    addToCart(product.id, effectiveSize, effectiveMilk, qty);
    toast(`${qty} × ${product.name} added to cart`);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* The heart lives in the (transparent) navigation header so it always stays tappable. */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeartButton active={fav} onPress={() => toggleFavorite(product.id)} size={22} style={styles.heart} />
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.hero}>
          <Animated.View style={[StyleSheet.absoluteFill, photoStyle]}>
            <ProductPhoto product={product} style={StyleSheet.absoluteFill} artSize={230} />
          </Animated.View>
          <LinearGradient colors={gradients.photoFadeSoft} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
        </View>

        <View style={styles.sheet}>
          <Animated.View entering={FadeInDown.delay(150).duration(550)} style={{ gap: 8 }}>
            {product.tag ? <Text style={[styles.tag, { color: t.primary }]}>{product.tag.toUpperCase()}</Text> : null}
            <Text style={[styles.name, { color: t.text }]}>{product.name}</Text>
            <View style={styles.infoRow}>
              <Info icon="star" text={product.rating.toFixed(1)} />
              <Info icon="clock" text={product.prep} />
              <Info icon="coffee" text={product.category} />
            </View>
            <Text style={[styles.desc, { color: t.muted }]}>{product.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(550)} style={{ gap: 10 }}>
            {product.isDrink && (
              <>
                <Text style={[styles.section, { color: t.text }]}>Size</Text>
                <View style={styles.chips}>
                  {SIZES.map((s) => (
                    <Chip
                      key={s.name}
                      label={s.extra ? `${s.name} +${s.extra}` : s.name}
                      selected={size === s.name}
                      onPress={() => setSize(s.name)}
                    />
                  ))}
                </View>

                <Text style={[styles.section, { color: t.text }]}>Milk</Text>
                <View style={styles.chips}>
                  {MILKS.map((m) => (
                    <Chip
                      key={m.name}
                      label={m.extra ? `${m.name} +${m.extra}` : m.name}
                      selected={milk === m.name}
                      onPress={() => setMilk(m.name)}
                    />
                  ))}
                </View>
              </>
            )}

            <View style={styles.qtyRow}>
              <Text style={[styles.section, { color: t.text, marginTop: 0 }]}>Quantity</Text>
              <QuantityStepper value={qty} onChange={(d) => setQty((q) => Math.max(1, q + d))} />
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(400).duration(500)}
        style={[
          styles.bottom,
          { backgroundColor: t.card, borderTopColor: t.border, paddingBottom: Math.max(insets.bottom, 12) },
        ]}>
        <Button title={`Add to cart • ${formatPrice(unit * qty)}`} onPress={onAdd} />
      </Animated.View>
    </View>
  );
}

function Info({ icon, text }: { icon: 'star' | 'clock' | 'coffee'; text: string }) {
  const t = useTheme();
  return (
    <View style={[styles.info, { backgroundColor: t.card, borderColor: t.border }]}>
      <Icon name={icon} color={t.primary} size={14} />
      <Text style={{ color: t.text, fontSize: 12.5, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 380, overflow: 'hidden' },
  heart: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15,11,9,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    marginTop: -28,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    gap: 14,
    backgroundColor: '#0F0B09',
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  tag: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  name: { fontSize: 32, fontFamily: fonts.display, fontWeight: '700' },
  infoRow: { flexDirection: 'row', gap: 8, marginVertical: 4, flexWrap: 'wrap' },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  desc: { fontSize: 15, lineHeight: 23 },
  section: { fontSize: 16, fontWeight: '800', marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  bottom: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
