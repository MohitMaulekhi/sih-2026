import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, LoginForm } from '@repo/auth';
import { useTranslation } from '@repo/i18n';

export default function ProfessionalLoginScreen() {
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
      role="professional"
      title={t('auth.login.professionalTitle')}
      subtitle={t('auth.login.professionalSubtitle')}
      footerPrompt={t('auth.login.professionalFooterPrompt')}
      footerActionText={t('auth.login.professionalFooterAction')}
      onFooterActionPress={() => router.push('/(auth)/register' as any)}>
      <LoginForm
        role="professional"
        onSubmit={handleSignIn}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
