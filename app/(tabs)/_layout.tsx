import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '../context/AuthContext';

export default function TabLayout() {
  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#9ca3af',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sell"
          options={{
            title: 'Sell',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'camera' : 'camera-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'wallet' : 'wallet-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
