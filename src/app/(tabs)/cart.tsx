import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { Field } from '@/components/Field';
import { useFeedback } from '@/components/Feedback';
import { PressableScale } from '@/components/PressableScale';
import { ProductPhoto } from '@/components/ProductPhoto';
import { QuantityStepper } from '@/components/QuantityStepper';
import { formatPrice, radius, useTheme } from '@/constants/theme';
import { TAX_RATE, useStore, type OrderType } from '@/context/StoreContext';
import { getProduct } from '@/data/menu';

export default function CartScreen() {
  const t = useTheme();
  const { confirm, toast } = useFeedback();
  const {
    cart, subtotal, discount, promoCode, applyPromo, removePromo, tax, total,
    changeQty, removeItem, clearCart, placeOrder,
  } = useStore();
  const [type, setType] = useState<OrderType>('Pickup');
  const [promoDraft, setPromoDraft] = useState('');
  const [promoError, setPromoError] = useState('');
  const [note, setNote] = useState('');

  const onApplyPromo = () => {
    const res = applyPromo(promoDraft);
    if (res.ok) {
      setPromoError('');
      setPromoDraft('');
      toast(res.message);
    } else {
      setPromoError(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <EmptyState icon="bag" title="Your cart is empty" subtitle="Add something delicious from the menu.">
        <Button title="Browse menu" onPress={() => router.navigate('/')} />
      </EmptyState>
    );
  }

  const onPlaceOrder = () => {
    const order = placeOrder(type, note);
    setNote('');
    if (order) {
      confirm(
        'Order placed!',
        `Your order ${order.id} is being prepared. We'll have it ready in about a minute.`,
        [
          { label: 'Later', style: 'cancel' },
          { label: 'View orders', onPress: () => router.navigate('/orders') },
        ],
        'coffee',
      );
    }
  };

  const onClear = () =>
    confirm('Clear cart?', 'This removes all items from your cart.', [
      { label: 'Cancel', style: 'cancel' },
      { label: 'Clear', style: 'destructive', onPress: clearCart },
    ]);

  return (
    <FlatList
      data={cart}
      keyExtractor={(i) => i.key}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item, index }) => {
        const product = getProduct(item.productId);
        if (!product) return null;
        const detail = product.isDrink ? `${item.size} • ${item.milk} milk` : 'Freshly baked';
        return (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 6) * 70).duration(450)}
            exiting={FadeOutLeft.duration(250)}
            layout={LinearTransition.springify().damping(18)}
            style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
            <ProductPhoto product={product} style={styles.tile} artSize={46} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={{ color: t.muted, fontSize: 12 }}>{detail}</Text>
              <Text style={{ color: t.primary, fontWeight: '800' }}>{formatPrice(item.unitPrice * item.qty)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <QuantityStepper value={item.qty} min={0} onChange={(d) => changeQty(item.key, d)} />
              <PressableScale accessibilityRole="button" onPress={() => removeItem(item.key)} scaleTo={0.9} hitSlop={8}>
                <Text style={{ color: t.danger, fontSize: 12, fontWeight: '600' }}>Remove</Text>
              </PressableScale>
            </View>
          </Animated.View>
        );
      }}
      ListFooterComponent={
        <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.footer}>
          <Text style={[styles.section, { color: t.text }]}>Order type</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Pickup" selected={type === 'Pickup'} onPress={() => setType('Pickup')} />
            <Chip label="Dine-in" selected={type === 'Dine-in'} onPress={() => setType('Dine-in')} />
          </View>

          <Text style={[styles.section, { color: t.text }]}>Special instructions</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="e.g. extra hot, less sugar, no ice…"
            placeholderTextColor="#7d6f63"
            multiline
            maxLength={120}
            style={[styles.note, { color: t.text, borderColor: t.border, backgroundColor: t.card }]}
          />

          <Text style={[styles.section, { color: t.text }]}>Promo code</Text>
          {promoCode && discount > 0 ? (
            <View style={[styles.promoOn, { borderColor: t.success }]}>
              <Text style={{ color: t.success, fontWeight: '800', flex: 1 }}>
                {promoCode} applied · you save {formatPrice(discount)}
              </Text>
              <PressableScale accessibilityRole="button" onPress={removePromo} scaleTo={0.9} hitSlop={8}>
                <Text style={{ color: t.danger, fontWeight: '700' }}>Remove</Text>
              </PressableScale>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              <Field
                label="Have a code? Try BREW10"
                icon="star"
                value={promoDraft}
                onChangeText={(v) => {
                  setPromoDraft(v);
                  setPromoError('');
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="Enter promo code"
                error={promoError}
                onSubmitEditing={onApplyPromo}
              />
              <Button title="Apply code" variant="outline" onPress={onApplyPromo} />
            </View>
          )}

          <View style={[styles.summary, { backgroundColor: t.card, borderColor: t.border }]}>
            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 ? <SummaryRow label={`Discount (${promoCode})`} value={`- ${formatPrice(discount)}`} /> : null}
            <SummaryRow label={`Tax (${TAX_RATE * 100}%)`} value={formatPrice(tax)} />
            <View style={[styles.divider, { backgroundColor: t.border }]} />
            <SummaryRow label="Total" value={formatPrice(total)} bold />
          </View>

          <Button title={`Place order • ${formatPrice(total)}`} onPress={onPlaceOrder} />
          <Button title="Clear cart" variant="outline" onPress={onClear} />
        </Animated.View>
      }
    />
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  const t = useTheme();
  return (
    <View style={styles.summaryRow}>
      <Text style={{ color: bold ? t.text : t.muted, fontSize: bold ? 17 : 14, fontWeight: bold ? '800' : '500' }}>
        {label}
      </Text>
      <Text style={{ color: t.text, fontSize: bold ? 17 : 14, fontWeight: bold ? '800' : '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32, width: '100%', maxWidth: 640, alignSelf: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tile: { width: 72, height: 72, borderRadius: radius.sm },
  name: { fontSize: 15, fontWeight: '700' },
  footer: { marginTop: 20, gap: 12 },
  section: { fontSize: 16, fontWeight: '800' },
  note: { minHeight: 64, borderRadius: radius.md, borderWidth: 1, padding: 12, fontSize: 15, textAlignVertical: 'top' },
  promoOn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: radius.md, borderWidth: 1.5, backgroundColor: 'rgba(123,196,127,0.08)' },
  summary: { padding: 16, borderRadius: radius.md, borderWidth: 1, gap: 8, marginVertical: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, marginVertical: 4 },
});
