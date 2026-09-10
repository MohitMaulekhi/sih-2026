import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { UserRole } from '@repo/types';
import { useTranslation } from '@repo/i18n';
import { AlertCircle, Lock, Mail } from 'lucide-react-native';

interface LoginFormProps {
  role: UserRole;
  onSubmit: (email: string, password?: string) => Promise<{ error?: string }>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  role,
  onSubmit,
  isLoading = false,
}) => {
  const isPro = role === 'professional';
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage(t('auth.form.errorEnterEmail'));
      return;
    }
    if (!password.trim()) {
      setErrorMessage(t('auth.form.errorEnterPassword'));
      return;
    }

    setErrorMessage(null);
    const result = await onSubmit(email.trim(), password);
    if (result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <View style={styles.container}>
      {errorMessage && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color="#F87171" style={{ marginRight: 8 }} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Email input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t('auth.form.emailLabel')}</Text>
        <View style={styles.inputContainer}>
          <Mail size={16} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.form.emailPlaceholder')}
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (errorMessage) setErrorMessage(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Password input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t('auth.form.passwordLabel')}</Text>
        <View style={styles.inputContainer}>
          <Lock size={16} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.form.passwordPlaceholder')}
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (errorMessage) setErrorMessage(null);
            }}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          isPro ? styles.submitButtonPro : styles.submitButtonCust,
          isLoading && styles.submitButtonDisabled,
        ]}
        activeOpacity={0.8}
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isPro ? t('auth.form.signInProDashboard') : t('auth.form.signInAccount')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#F8FAFC',
    fontSize: 15,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonCust: {
    backgroundColor: '#EA580C',
  },
  submitButtonPro: {
    backgroundColor: '#10B981',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
