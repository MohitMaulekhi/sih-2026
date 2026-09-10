import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth, AuthLayout, SignUpForm, SignUpData } from '@repo/auth';
import { useTranslation } from '@repo/i18n';

export default function ProfessionalRegisterScreen() {
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
      role="professional"
      title={t('auth.register.professionalTitle')}
      subtitle={t('auth.register.professionalSubtitle')}
      footerPrompt={t('auth.register.professionalFooterPrompt')}
      footerActionText={t('auth.register.professionalFooterAction')}
      onFooterActionPress={() => router.push('/(auth)/login' as any)}>
      <SignUpForm
        role="professional"
        onSubmit={handleSignUp}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
