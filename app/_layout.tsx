import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    window.frameworkReady?.();
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(hasLaunched === null);
    } catch (err) {
      setIsFirstLaunch(true);
    }
  };

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        {isFirstLaunch ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
          </Stack>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat" options={{ presentation: 'modal' }} />
            <Stack.Screen
              name="edit-profile"
              options={{ presentation: 'card' }}
            />
            <Stack.Screen name="search" />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="checkout" />
            <Stack.Screen
              name="order-success"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="order/[id]" />
          </Stack>
        )}
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}
