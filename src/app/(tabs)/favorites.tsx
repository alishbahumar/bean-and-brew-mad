import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/menu';

export default function FavoritesScreen() {
  const { favorites } = useStore();
  const items = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <FlatList
      data={items}
      numColumns={2}
      keyExtractor={(p) => p.id}
      renderItem={({ item, index }) => (
        <View style={styles.cell}>
          <ProductCard product={item} index={index} />
        </View>
      )}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      ListEmptyComponent={
        <EmptyState icon="heart" title="No favorites yet" subtitle="Tap the heart on any item to save it here.">
          <Button title="Browse menu" onPress={() => router.navigate('/')} />
        </EmptyState>
      }
    />
  );
}

const styles = StyleSheet.create({ cell: { flex: 1, marginBottom: 12, maxWidth: '50%' } });
