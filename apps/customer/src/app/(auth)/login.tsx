import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, LoginForm } from '@repo/auth';

export default function CustomerLoginScreen() {
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
    loginAsDemo('customer');
    router.replace('/(tabs)');
  };

  return (
    <AuthLayout
      role="customer"
      title="Welcome Back"
      subtitle="Book expert home services with 100% quality guarantee"
      footerPrompt="New to Urban Company?"
      footerActionText="Create an Account"
      onFooterActionPress={() => router.push('/(auth)/register')}
      onDemoLogin={handleDemoLogin}>
      <LoginForm
        role="customer"
        onSubmit={handleSignIn}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
