import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { useTheme } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

function tabIcon(name: IconName) {
  // eslint-disable-next-line react/display-name
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Icon name={name} color={color} size={23} filled={focused && name === 'heart'} />
  );
}

export default function TabLayout() {
  const t = useTheme();
  const { cartCount } = useStore();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '800' },
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.muted,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        sceneStyle: { backgroundColor: t.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Menu', headerShown: false, tabBarIcon: tabIcon('coffee') }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: tabIcon('heart') }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: tabIcon('bag'),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: t.primary, color: t.onPrimary },
        }}
      />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: tabIcon('receipt') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('user') }} />
    </Tabs>
  );
}
