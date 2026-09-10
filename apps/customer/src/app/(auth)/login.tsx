import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, LoginForm } from '@repo/auth';
import { useTranslation } from '@repo/i18n';

export default function CustomerLoginScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const { t } = useTranslation();

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
      title={t('auth.login.customerTitle')}
      subtitle={t('auth.login.customerSubtitle')}
      footerPrompt={t('auth.login.customerFooterPrompt')}
      footerActionText={t('auth.login.customerFooterAction')}
      onFooterActionPress={() => router.push('/(auth)/register' as any)}>
      <LoginForm
        role="customer"
        onSubmit={handleSignIn}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
