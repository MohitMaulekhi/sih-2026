import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, SignUpForm, SignUpData } from '@repo/auth';

export default function CustomerRegisterScreen() {
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
    loginAsDemo('customer');
    router.replace('/(tabs)');
  };

  return (
    <AuthLayout
      role="customer"
      title="Create Account"
      subtitle="Join millions getting reliable services at doorstep"
      footerPrompt="Already have an account?"
      footerActionText="Sign In"
      onFooterActionPress={() => router.push('/(auth)/login')}
      onDemoLogin={handleDemoLogin}>
      <SignUpForm
        role="customer"
        onSubmit={handleSignUp}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
