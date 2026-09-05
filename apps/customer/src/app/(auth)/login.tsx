import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, LoginForm } from '@repo/auth';

export default function CustomerLoginScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const handleSignIn = async (email: string, password?: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      router.replace('/(tabs)' as any);
    }
    return result;
  };

  return (
    <AuthLayout
      role="customer"
      title="Welcome Back"
      subtitle="Book expert doorstep services with 100% quality guarantee"
      footerPrompt="New to RuralClap?"
      footerActionText="Create an Account"
      onFooterActionPress={() => router.push('/(auth)/register' as any)}>
      <LoginForm
        role="customer"
        onSubmit={handleSignIn}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
