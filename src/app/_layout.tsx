import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { FeedbackProvider } from '@/components/Feedback';
import { useTheme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';

function Navigator() {
  const t = useTheme();
  const { hydrated, user } = useAuth();

  // Wait until saved accounts are loaded so we know whether someone is already logged in.
  if (!hydrated) return <View style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    // key = user id, so every account gets its own fresh cart / favorites / orders.
    <StoreProvider key={user?.id ?? 'signed-out'} userId={user?.id ?? null}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.bg },
          headerTintColor: t.primary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: t.bg },
          animation: 'fade_from_bottom',
        }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen
            name="product/[id]"
            options={{
              title: '',
              headerTransparent: true,
              headerBackButtonDisplayMode: 'minimal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Protected>
      </Stack>
    </StoreProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <StatusBar style="light" />
        <Navigator />
      </FeedbackProvider>
    </AuthProvider>
  );
}
