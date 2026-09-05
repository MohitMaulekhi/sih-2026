import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, SignUpForm, SignUpData } from '@repo/auth';

export default function ProfessionalRegisterScreen() {
  const router = useRouter();
  const { signUp, isLoading, loginAsDemo } = useAuth();

  const handleSignUp = async (data: SignUpData) => {
    const result = await signUp(data);
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
      title="Join as a Partner"
      subtitle="Grow your business with steady customer bookings"
      footerPrompt="Already a registered partner?"
      footerActionText="Sign In"
      onFooterActionPress={() => router.push('/(auth)/login')}
      onDemoLogin={handleDemoLogin}>
      <SignUpForm
        role="professional"
        onSubmit={handleSignUp}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
