import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, LoginForm } from '@repo/auth';

export default function ProfessionalLoginScreen() {
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
      role="professional"
      title="Partner Login"
      subtitle="Accept customer job requests, manage schedule & track payouts"
      footerPrompt="Want to become a service partner?"
      footerActionText="Register Today"
      onFooterActionPress={() => router.push('/(auth)/register' as any)}>
      <LoginForm
        role="professional"
        onSubmit={handleSignIn}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
