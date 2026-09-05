import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth, RoleMismatchAlert } from '@repo/auth';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

function CustomerAppRoot() {
  const { user, isLoading, roleMismatch, expectedRole, roleMismatchMessage, signOut, clearRoleMismatch } =
    useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="service/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Service Details',
            headerBackTitle: 'Back',
            headerTintColor: '#0F172A',
            headerStyle: { backgroundColor: '#FFFFFF' },
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="book/[serviceId]"
          options={{
            headerShown: true,
            headerTitle: 'Book Service',
            headerBackTitle: 'Back',
            headerTintColor: '#0F172A',
            headerStyle: { backgroundColor: '#FFFFFF' },
            presentation: 'card',
          }}
        />
      </Stack>

      {/* Strict Role Mismatch Guard Modal */}
      <RoleMismatchAlert
        visible={roleMismatch}
        expectedRole={expectedRole}
        currentRole={user?.role || 'professional'}
        message={roleMismatchMessage}
        onSwitchToCorrectAccount={clearRoleMismatch}
        onSignOut={signOut}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider expectedRole="customer">
      <CustomerAppRoot />
    </AuthProvider>
  );
}
