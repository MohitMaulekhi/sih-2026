import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, SignUpForm, SignUpData } from '@repo/auth';
import { useTranslation } from '@repo/i18n';

export default function CustomerRegisterScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const { t } = useTranslation();

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
      title={t('auth.register.customerTitle')}
      subtitle={t('auth.register.customerSubtitle')}
      footerPrompt={t('auth.register.customerFooterPrompt')}
      footerActionText={t('auth.register.customerFooterAction')}
      onFooterActionPress={() => router.push('/(auth)/login' as any)}>
      <SignUpForm
        role="customer"
        onSubmit={handleSignUp}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
