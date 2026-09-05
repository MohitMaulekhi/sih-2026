import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, LoginForm } from '@repo/auth';

export default function ProfessionalLoginScreen() {
  const router = useRouter();
  const { signIn, isLoading, loginAsDemo } = useAuth();

  const handleSignIn = async (email: string, password?: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      router.replace('/(tabs)');
    }
    return result;
  };

  const handleDemoLogin = () => {
    loginAsDemo('professional');
    router.replace('/(tabs)');
  };

  return (
    <AuthLayout
      role="professional"
      title="Partner Login"
      subtitle="Accept job leads, manage schedule & track your daily payouts"
      footerPrompt="Want to become a partner?"
      footerActionText="Register Today"
      onFooterActionPress={() => router.push('/(auth)/register')}
      onDemoLogin={handleDemoLogin}>
      <LoginForm
        role="professional"
        onSubmit={handleSignIn}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
