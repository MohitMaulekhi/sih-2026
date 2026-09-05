import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { UserRole } from '@repo/types';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  role: UserRole;
  footerPrompt?: string;
  footerActionText?: string;
  onFooterActionPress?: () => void;
  onDemoLogin?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  role,
  footerPrompt,
  footerActionText,
  onFooterActionPress,
  onDemoLogin,
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
              <Text style={styles.badgeEmoji}>{isPro ? '⚡' : '✨'}</Text>
              <Text
                style={[
                  styles.badgeText,
                  isPro ? styles.badgeTextPro : styles.badgeTextCust,
                ]}>
                {isPro ? 'URBAN PARTNER' : 'URBAN SERVICES'}
              </Text>
            </View>

            <Text style={styles.brandTitle}>
              Urban<Text style={isPro ? styles.brandHighlightPro : styles.brandHighlight}>Company</Text>
            </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Card Form */}
          <View style={styles.card}>{children}</View>

          {/* Quick Demo Credentials Button */}
          {onDemoLogin && (
            <View style={styles.demoSection}>
              <TouchableOpacity
                style={styles.demoButton}
                activeOpacity={0.8}
                onPress={onDemoLogin}>
                <Text style={styles.demoButtonText}>
                  🚀 1-Click Demo Login as {isPro ? 'Verified Professional' : 'Customer'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.demoHint}>
                Instant test account loaded with sample data
              </Text>
            </View>
          )}

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
    backgroundColor: '#0F172A',
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
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeCust: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  badgePro: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  badgeEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  badgeTextCust: {
    color: '#C4B5FD',
  },
  badgeTextPro: {
    color: '#6EE7B7',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandHighlight: {
    color: '#8B5CF6',
  },
  brandHighlightPro: {
    color: '#10B981',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
      },
    }),
  },
  demoSection: {
    marginTop: 18,
    alignItems: 'center',
  },
  demoButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
    width: '100%',
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '600',
  },
  demoHint: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerPrompt: {
    color: '#94A3B8',
    fontSize: 14,
  },
  footerAction: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerActionCust: {
    color: '#A78BFA',
  },
  footerActionPro: {
    color: '#34D399',
  },
});
