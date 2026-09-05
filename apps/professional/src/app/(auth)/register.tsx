import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, SignUpForm, SignUpData } from '@repo/auth';

export default function ProfessionalRegisterScreen() {
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
      role="professional"
      title="Join as a Partner"
      subtitle="Grow your business with steady doorstep customer bookings"
      footerPrompt="Already a registered partner?"
      footerActionText="Sign In"
      onFooterActionPress={() => router.push('/(auth)/login' as any)}>
      <SignUpForm
        role="professional"
        onSubmit={handleSignUp}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
