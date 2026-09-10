import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from '@repo/types';
import { Zap, Sparkles, ShieldCheck } from 'lucide-react-native';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  role: UserRole;
  footerPrompt?: string;
  footerActionText?: string;
  onFooterActionPress?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  role,
  footerPrompt,
  footerActionText,
  onFooterActionPress,
}) => {
  const isPro = role === 'professional';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={[styles.badge, isPro ? styles.badgePro : styles.badgeCust]}>
              {isPro ? (
                <Zap size={14} color="#059669" style={{ marginRight: 6 }} />
              ) : (
                <Sparkles size={14} color="#EA580C" style={{ marginRight: 6 }} />
              )}
              <Text
                style={[
                  styles.badgeText,
                  isPro ? styles.badgeTextPro : styles.badgeTextCust,
                ]}>
                {isPro ? 'RURALCLAP PARTNER' : 'RURALCLAP SERVICES'}
              </Text>
            </View>

            <Text style={styles.brandTitle}>
              Rural<Text style={isPro ? styles.brandHighlightPro : styles.brandHighlight}>Clap</Text>
            </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Card Form */}
          <View style={styles.card}>{children}</View>

          {/* Footer toggle */}
          {footerPrompt && footerActionText && onFooterActionPress && (
            <View style={styles.footer}>
              <Text style={styles.footerPrompt}>{footerPrompt} </Text>
              <TouchableOpacity onPress={onFooterActionPress} activeOpacity={0.7}>
                <Text
                  style={[
                    styles.footerAction,
                    isPro ? styles.footerActionPro : styles.footerActionCust,
                  ]}>
                  {footerActionText}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 440,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeCust: {
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.3)',
  },
  badgePro: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  badgeTextCust: {
    color: '#C2410C',
  },
  badgeTextPro: {
    color: '#059669',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandHighlight: {
    color: '#F97316',
  },
  brandHighlightPro: {
    color: '#10B981',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
      },
    }),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerPrompt: {
    color: '#64748B',
    fontSize: 14,
  },
  footerAction: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerActionCust: {
    color: '#EA580C',
  },
  footerActionPro: {
    color: '#059669',
  },
});
