import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ProductArt } from '@/components/ProductArt';
import { gradients } from '@/constants/theme';
import { useState } from 'react';
import { PRODUCT_PHOTOS, backupPhoto, toSource } from '@/data/images';
import type { Product } from '@/data/menu';

type Props = { product: Product; style?: StyleProp<ViewStyle>; artSize?: number };

/**
 * Real photo of a menu item. The drawn illustration sits underneath, so while the photo is
 * loading (or if it can't load) the user still sees something nice. The photo fades in on top.
 */
export function ProductPhoto({ product, style, artSize = 100 }: Props) {
  const main = PRODUCT_PHOTOS[product.id];
  const [failed, setFailed] = useState(false);
  const [dead, setDead] = useState(false);
  const uri = failed ? backupPhoto(product.id) : main;
  return (
    <View style={[styles.box, style]}>
      <LinearGradient colors={gradients.art} style={StyleSheet.absoluteFill} />
      <View style={styles.art} pointerEvents="none">
        <ProductArt product={product} size={artSize} />
      </View>
      {uri && !dead ? (
        <Image
          key={failed ? 'backup' : 'main'}
          source={toSource(uri)}
          onError={() => (failed ? setDead(true) : setFailed(true))}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={600}
          cachePolicy="memory-disk"
          accessibilityLabel={product.name}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  // Absolutely positioned (like the layers around it) so the drawing is not hidden behind the gradient on web.
  art: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
