import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BaristaPick } from '@/components/BaristaPick';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { ProductCard } from '@/components/ProductCard';
import { ProductPhoto } from '@/components/ProductPhoto';
import { formatPrice, fonts, gradients, radius, useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES, PRODUCTS, type Category } from '@/data/menu';

type SortKey = 'Popular' | 'Top rated' | 'Price: low' | 'Price: high';
const SORTS: SortKey[] = ['Popular', 'Top rated', 'Price: low', 'Price: high'];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function MenuScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [sort, setSort] = useState<SortKey>('Popular');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (q === '' || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
    if (sort === 'Price: low') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'Price: high') return [...list].sort((a, b) => b.price - a.price);
    if (sort === 'Top rated') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, category, sort]);

  const showFeatured = query.trim() === '' && category === 'All';
  const featured = PRODUCTS.filter((p) => p.featured);
  const firstName = user?.name.split(' ')[0];

  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(p) => p.id}
      renderItem={({ item, index }) => (
        <View style={styles.cell}>
          <ProductCard product={item} index={index} />
        </View>
      )}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <LinearGradient colors={gradients.hero} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
            <Animated.View entering={FadeIn.duration(600)} style={styles.helloRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.hello, { color: t.muted }]}>
                  {greeting()}
                  {firstName ? `, ${firstName}` : ''}
                </Text>
              </View>
              <View style={[styles.avatar, { backgroundColor: t.primary }]}>
                <Text style={{ color: t.onPrimary, fontWeight: '800' }}>{(user?.name ?? 'G').charAt(0).toUpperCase()}</Text>
              </View>
            </Animated.View>
            <Animated.Text entering={FadeInDown.delay(100).duration(600)} style={[styles.headline, { color: t.text }]}>
              Find your{'\n'}perfect brew
            </Animated.Text>
            <Animated.View
              entering={FadeInDown.delay(220).duration(600)}
              style={[styles.search, { backgroundColor: 'rgba(255,255,255,0.07)', borderColor: t.border }]}>
              <Icon name="search" color={t.muted} size={20} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search coffee, tea, snacks…"
                placeholderTextColor={t.muted}
                returnKeyType="search"
                style={[styles.searchInput, { color: t.text }]}
              />
            </Animated.View>
          </LinearGradient>

          <BaristaPick />

          {showFeatured && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: t.text }]}>Featured</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
                {featured.map((p, i) => (
                  <Animated.View key={p.id} entering={FadeInRight.delay(250 + i * 110).duration(600)}>
                    <PressableScale
                      accessibilityRole="button"
                      accessibilityLabel={`Featured: ${p.name}`}
                      scaleTo={0.97}
                      onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })}
                      style={[styles.featured, { borderColor: t.border }]}>
                      <ProductPhoto product={p} style={StyleSheet.absoluteFill} artSize={130} />
                      <LinearGradient colors={gradients.photoFade} locations={[0.25, 0.65, 1]} style={StyleSheet.absoluteFill} />
                      <View style={[styles.fTagPill, { backgroundColor: t.primary }]}>
                        <Text style={[styles.fTag, { color: t.onPrimary }]}>{(p.tag ?? 'Featured').toUpperCase()}</Text>
                      </View>
                      <View style={styles.fText}>
                        <Text style={[styles.fName, { color: '#fff' }]} numberOfLines={1}>
                          {p.name}
                        </Text>
                        <Text style={[styles.fPrice, { color: t.accent }]}>{formatPrice(p.price)}</Text>
                      </View>
                    </PressableScale>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Menu</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              <Chip label="All" selected={category === 'All'} onPress={() => setCategory('All')} />
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
              ))}
            </ScrollView>
            <Text style={[styles.sortLabel, { color: t.muted }]}>Sort by</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {SORTS.map((k) => (
                <Chip key={k} label={k} selected={sort === k} onPress={() => setSort(k)} />
              ))}
            </ScrollView>
          </View>
        </View>
      }
      ListEmptyComponent={<EmptyState icon="search" title="No results" subtitle="Try a different search or category." />}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 32, flexGrow: 1 },
  column: { paddingHorizontal: 16, gap: 12 },
  cell: { flex: 1, marginBottom: 12, maxWidth: '50%' },
  hero: { paddingHorizontal: 20, paddingBottom: 22, gap: 6 },
  helloRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hello: { fontSize: 14, fontWeight: '600' },
  headline: { fontSize: 36, fontFamily: fonts.display, fontWeight: '700', lineHeight: 42, marginBottom: 10 },
  search: {
    height: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, height: '100%', outlineStyle: 'none' } as never,
  section: { marginTop: 18, marginBottom: 12, gap: 12 },
  sectionTitle: { fontSize: 22, fontFamily: fonts.display, fontWeight: '700', paddingHorizontal: 20 },
  featuredRow: { paddingHorizontal: 16, gap: 12 },
  featured: {
    width: 270,
    height: 180,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fTagPill: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  fTag: { fontSize: 10.5, fontWeight: '800', letterSpacing: 1.2 },
  fText: { padding: 14, gap: 2 },
  fName: { fontSize: 22, fontFamily: fonts.display, fontWeight: '700' },
  fPrice: { fontSize: 15, fontWeight: '800' },
  chips: { paddingHorizontal: 16, gap: 8 },
  sortLabel: { fontSize: 12.5, fontWeight: '700', letterSpacing: 0.4, paddingHorizontal: 20 },
});
