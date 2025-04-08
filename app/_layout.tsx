import { useEffect, useState } from 'react';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <View style={{ flex: 1 }}>
          <Slot />
          <StatusBar style="auto" />
        </View>
      </ToastProvider>
    </AuthProvider>
  );
}
