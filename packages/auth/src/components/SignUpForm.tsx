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
import { SignUpData } from '../auth-context';
import { useTranslation } from '@repo/i18n';
import { AlertCircle, User, Mail, Phone, MapPin, Briefcase, Lock } from 'lucide-react-native';

interface SignUpFormProps {
  role: UserRole;
  onSubmit: (data: SignUpData) => Promise<{ error?: string }>;
  isLoading?: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  role,
  onSubmit,
  isLoading = false,
}) => {
  const isPro = role === 'professional';
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('3');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setErrorMessage(t('auth.form.errorEnterFullName'));
      return;
    }
    if (!email.trim()) {
      setErrorMessage(t('auth.form.errorEnterEmail'));
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage(t('auth.form.errorPasswordMinLength'));
      return;
    }
    if (!phone.trim()) {
      setErrorMessage(t('auth.form.errorEnterPhone'));
      return;
    }

    setErrorMessage(null);
    const result = await onSubmit({
      fullName: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      phone: phone.trim(),
      city: city.trim(),
      role,
      bio: isPro ? bio.trim() : undefined,
      experienceYears: isPro ? parseInt(experienceYears, 10) || 1 : undefined,
    });

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

      {/* Full Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t('auth.form.fullNameLabel')}</Text>
        <View style={styles.inputContainer}>
          <User size={16} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.form.fullNamePlaceholder')}
            placeholderTextColor="#64748B"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t('auth.form.emailLabel')}</Text>
        <View style={styles.inputContainer}>
          <Mail size={16} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.form.emailPlaceholder')}
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Phone */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t('auth.form.phoneLabel')}</Text>
        <View style={styles.inputContainer}>
          <Phone size={16} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.form.phonePlaceholder')}
            placeholderTextColor="#64748B"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* City */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t('auth.form.cityLabel')}</Text>
        <View style={styles.inputContainer}>
          <MapPin size={16} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.form.cityPlaceholder')}
            placeholderTextColor="#64748B"
            value={city}
            onChangeText={setCity}
          />
        </View>
      </View>

      {/* Pro specific fields */}
      {isPro && (
        <>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('auth.form.experienceLabel')}</Text>
            <View style={styles.inputContainer}>
              <Briefcase size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.form.experiencePlaceholder')}
                placeholderTextColor="#64748B"
                value={experienceYears}
                onChangeText={setExperienceYears}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('auth.form.bioLabel')}</Text>
            <TextInput
              style={[styles.inputStandalone, styles.textArea]}
              placeholder={t('auth.form.bioPlaceholder')}
              placeholderTextColor="#64748B"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
            />
          </View>
        </>
      )}

      {/* Password */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t('auth.form.createPasswordLabel')}</Text>
        <View style={styles.inputContainer}>
          <Lock size={16} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.form.createPasswordPlaceholder')}
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
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
            {isPro ? t('auth.form.registerAsPartner') : t('auth.form.createCustomerAccount')}
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
    marginBottom: 14,
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
  inputStandalone: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    fontSize: 15,
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
