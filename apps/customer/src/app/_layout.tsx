import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth, RoleMismatchAlert } from '@repo/auth';
import { useColorScheme, View } from 'react-native';

function CustomerAppRoot() {
  const colorScheme = useColorScheme();
  const { user, roleMismatch, expectedRole, roleMismatchMessage, loginAsDemo, signOut } =
    useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            headerShown: false,
            presentation: 'modal',
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
            presentation: 'modal',
          }}
        />
      </Stack>

      {/* Strict Role Mismatch Guard Modal */}
      <RoleMismatchAlert
        visible={roleMismatch}
        expectedRole={expectedRole}
        currentRole={user?.role || 'professional'}
        message={roleMismatchMessage}
        onSwitchToCorrectAccount={() => loginAsDemo('customer')}
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
