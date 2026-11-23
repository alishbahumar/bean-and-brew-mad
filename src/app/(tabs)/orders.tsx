import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useFeedback } from '@/components/Feedback';
import { ProductPhoto } from '@/components/ProductPhoto';
import { formatPrice, radius, useTheme } from '@/constants/theme';
import { useStore, type Order } from '@/context/StoreContext';
import { getProduct } from '@/data/menu';

const PREP_MS = 60_000; // demo: order is "ready" one minute after placing

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function OrdersScreen() {
  const t = useTheme();
  const { confirm } = useFeedback();
  const { orders, reorder } = useStore();
  const [now, setNow] = useState(() => Date.now());

  // Tick so the "Preparing" → "Ready" status updates on its own.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const onReorder = (order: Order) => {
    reorder(order);
    confirm('Added to cart', 'Items from this order were added to your cart.', [
      { label: 'OK', style: 'cancel' },
      { label: 'Go to cart', onPress: () => router.navigate('/cart') },
    ]);
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 16, flexGrow: 1, width: '100%', maxWidth: 640, alignSelf: 'center' }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListEmptyComponent={
        <EmptyState icon="receipt" title="No orders yet" subtitle="Your placed orders will show up here.">
          <Button title="Browse menu" onPress={() => router.navigate('/')} />
        </EmptyState>
      }
      renderItem={({ item, index }) => {
        const ready = now - item.createdAt >= PREP_MS;
        const products = item.items.map((i) => getProduct(i.productId)).filter((p) => !!p);
        return (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 6) * 80).duration(500)}
            style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
            <View style={styles.top}>
              <Text style={[styles.id, { color: t.text }]}>{item.id}</Text>
              <View style={[styles.status, { backgroundColor: ready ? 'rgba(123,196,127,0.15)' : 'rgba(212,167,98,0.15)' }]}>
                <Text style={{ color: ready ? t.success : t.primary, fontWeight: '800', fontSize: 12.5 }}>
                  {ready ? 'Ready' : 'Preparing'}
                </Text>
              </View>
            </View>
            <Text style={{ color: t.muted, fontSize: 12 }}>
              {formatDate(item.createdAt)} · {item.type}
            </Text>

            <View style={styles.thumbs}>
              {products.slice(0, 5).map((p, i) => (
                <ProductPhoto
                  key={`${p!.id}-${i}`}
                  product={p!}
                  artSize={30}
                  style={[styles.thumb, { borderColor: t.card, marginLeft: i === 0 ? 0 : -10 }]}
                />
              ))}
            </View>

            <View style={{ gap: 2, marginBottom: 8 }}>
              {item.items.map((i) => (
                <Text key={i.key} style={{ color: t.text, fontSize: 14 }}>
                  {i.qty}× {getProduct(i.productId)?.name ?? i.productId}
                </Text>
              ))}
            </View>
            {item.note ? (
              <Text style={{ color: t.muted, fontSize: 13, fontStyle: 'italic', marginBottom: 6 }}>Note: {item.note}</Text>
            ) : null}
            {item.discount && item.promo ? (
              <Text style={{ color: t.success, fontSize: 13, fontWeight: '700', marginBottom: 6 }}>
                Promo {item.promo}: saved {formatPrice(item.discount)}
              </Text>
            ) : null}
            <View style={styles.top}>
              <Text style={{ color: t.text, fontWeight: '800', fontSize: 16 }}>{formatPrice(item.total)}</Text>
              <Button title="Reorder" variant="outline" onPress={() => onReorder(item)} style={styles.small} />
            </View>
          </Animated.View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: radius.md, borderWidth: 1, gap: 4 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 16, fontWeight: '800' },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  thumbs: { flexDirection: 'row', marginVertical: 8 },
  thumb: { width: 44, height: 44, borderRadius: 22, borderWidth: 3 },
  small: { minHeight: 38, paddingHorizontal: 16 },
});
