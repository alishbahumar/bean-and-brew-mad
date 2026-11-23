import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';
import { getCoffeeTip, type CoffeeTip } from '@/services/api';

export function BaristaPick() {
  const t = useTheme();
  const [tip, setTip] = useState<CoffeeTip | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getCoffeeTip()
      .then(setTip)
      .catch((e) => {
        console.warn('API FAILED:', e);
        setFailed(true);
      });
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
      <Text style={[styles.title, { color: t.accent }]}>💬 Quote of the Day</Text>
      {tip ? (
        <>
          <Text style={{ color: t.text, marginTop: 6 }} numberOfLines={4}>
            “{tip.description}”
          </Text>
          <Text style={{ color: t.muted, marginTop: 4 }}>— {tip.title}</Text>
        </>
      ) : (
        <Text style={{ color: t.muted, marginTop: 6 }}>
          {failed ? 'Could not load. Please check your internet.' : 'Loading…'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginTop: 16, padding: 14, borderRadius: 16, borderWidth: 1 },
  title: { fontWeight: '800', fontSize: 15 },
});
