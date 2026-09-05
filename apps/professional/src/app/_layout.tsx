import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth, RoleMismatchAlert } from '@repo/auth';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ProfessionalAppRoot() {
  const { user, isLoading, roleMismatch, expectedRole, roleMismatchMessage, signOut, clearRoleMismatch } =
    useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: '#0F172A' },
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
      </Stack>

      {/* Strict Role Mismatch Guard Modal */}
      <RoleMismatchAlert
        visible={roleMismatch}
        expectedRole={expectedRole}
        currentRole={user?.role || 'customer'}
        message={roleMismatchMessage}
        onSwitchToCorrectAccount={clearRoleMismatch}
        onSignOut={signOut}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider expectedRole="professional">
      <ProfessionalAppRoot />
    </AuthProvider>
  );
}
