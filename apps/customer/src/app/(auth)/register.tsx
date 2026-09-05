import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, SignUpForm, SignUpData } from '@repo/auth';

export default function CustomerRegisterScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const handleSignUp = async (data: SignUpData) => {
    const result = await signUp(data);
    if (!result.error) {
      router.replace('/(tabs)' as any);
    }
    return result;
  };

  return (
    <AuthLayout
      role="customer"
      title="Create Account"
      subtitle="Join millions getting reliable services at doorstep"
      footerPrompt="Already have an account?"
      footerActionText="Sign In"
      onFooterActionPress={() => router.push('/(auth)/login' as any)}>
      <SignUpForm
        role="customer"
        onSubmit={handleSignUp}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
