import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { HeartButton } from '@/components/HeartButton';
import { Icon } from '@/components/Icon';
import { useFeedback } from '@/components/Feedback';
import { PressableScale } from '@/components/PressableScale';
import { ProductPhoto } from '@/components/ProductPhoto';
import { formatPrice, radius, useTheme } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';
import type { Product } from '@/data/menu';

/** Grid card: tap = open details, "+" = quick add (small size, regular milk). */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const t = useTheme();
  const { toast } = useFeedback();
  const { isFavorite, toggleFavorite, addToCart } = useStore();
  const fav = isFavorite(product.id);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const quickAdd = () => {
    addToCart(product.id, product.isDrink ? 'Small' : 'Regular', product.isDrink ? 'Regular' : 'None', 1);
    toast(`${product.name} added to cart`);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 70).duration(550).springify().damping(18)}
      style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
        scaleTo={0.98}>
        <View>
          <ProductPhoto product={product} style={styles.art} artSize={118} />
          <LinearGradient colors={['rgba(26,20,16,0)', 'rgba(26,20,16,0.85)']} style={styles.fade} pointerEvents="none" />
        </View>
        <View style={styles.body}>
          <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.metaRow}>
            <Icon name="star" color={t.primary} size={12} />
            <Text style={[styles.meta, { color: t.muted }]}>
              {product.rating.toFixed(1)} · {product.category}
            </Text>
          </View>
          <Text style={[styles.price, { color: t.primary }]}>{formatPrice(product.price)}</Text>
        </View>
      </PressableScale>

      {product.tag ? (
        <View style={[styles.tag, { backgroundColor: t.primary }]} pointerEvents="none">
          <Text style={[styles.tagText, { color: t.onPrimary }]}>{product.tag}</Text>
        </View>
      ) : null}

      <HeartButton active={fav} onPress={() => toggleFavorite(product.id)} style={styles.heart} />

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Add ${product.name} to cart`}
        onPress={quickAdd}
        scaleTo={0.8}
        style={[styles.add, { backgroundColor: added ? t.success : t.primary }]}>
        <Icon name={added ? 'check' : 'plus'} color={t.onPrimary} size={18} />
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  art: { height: 150 },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 46 },
  body: { padding: 12, paddingRight: 56, gap: 3 },
  name: { fontSize: 15, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 11.5 },
  price: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  tag: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill },
  tagText: { fontSize: 10.5, fontWeight: '800' },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15,11,9,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
