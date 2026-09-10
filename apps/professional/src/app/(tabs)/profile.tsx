import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';
import { formatCurrency } from '@repo/utils';
import { useTranslation, LanguageToggle } from '@repo/i18n';
import {
  ShieldCheck,
  Wrench,
  ClipboardList,
  LogOut,
  ChevronRight,
  User,
  CreditCard,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Award,
  Languages,
} from 'lucide-react-native';

export default function ProfessionalProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const proJobs = dbStore.getBookings({
    userId: user?.id,
    role: 'professional',
  });

  const completedJobs = proJobs.filter(
    (b) => b.professionalId === user?.id && b.status === 'completed'
  );
  const totalEarnings = completedJobs.reduce(
    (acc, curr) => acc + curr.totalPrice,
    0
  );

  const handleSignOut = () => {
    Alert.alert(t('professional.profile.signOut'), 'Are you sure you want to sign out of RuralClap Partner?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('professional.profile.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('professional.profile.subtitle')}</Text>
        </View>

        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarWrapper}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <User size={32} color="#10B981" />
              </View>
            )}
            <View style={styles.verifiedDot}>
              <ShieldCheck size={12} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.fullName}>{user?.fullName || 'RuralClap Partner'}</Text>
            <View style={styles.verifiedChip}>
              <ShieldCheck size={12} color="#34D399" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedChipText}>{t('professional.profile.verifiedExpert')}</Text>
            </View>
            <Text style={styles.partnerIdText}>
              ID: #RC-{(user?.id || '8492').slice(-6).toUpperCase()}
            </Text>
          </View>

          {/* Quick Metrics */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatCurrency(totalEarnings)}
              </Text>
              <Text style={styles.statLabel}>{t('professional.profile.earnings')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {completedJobs.length}
              </Text>
              <Text style={styles.statLabel}>{t('professional.profile.jobsDone')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                ★ {user?.rating ? Number(user.rating).toFixed(1) : '5.0'}
              </Text>
              <Text style={styles.statLabel}>{t('professional.profile.rating')}</Text>
            </View>
          </View>
        </View>

        {/* Language Preference */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('common.language').toUpperCase()}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Languages size={16} color="#10B981" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{t('common.language')}</Text>
              </View>
              <LanguageToggle
                accentColor="#10B981"
                trackColor="#0F172A"
                inactiveTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Experience & Bio */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('professional.profile.specializationLocation')}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Award size={16} color="#10B981" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{t('professional.profile.fieldExperience')}</Text>
                <Text style={styles.infoValue}>
                  {user?.experienceYears || 5}+ {t('professional.profile.yearsExperience')}
                </Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <MapPin size={16} color="#10B981" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{t('professional.profile.serviceArea')}</Text>
                <Text style={styles.infoValue}>{user?.city || 'Bengaluru'}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Mail size={16} color="#10B981" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{t('professional.profile.contactEmailPhone')}</Text>
                <Text style={styles.infoValue}>{user?.email || 'partner@ruralclap.in'}</Text>
                <Text style={styles.infoSubtext}>{user?.phone || '+91 98765 43210'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payout Information */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('professional.profile.paymentsSettlements')}</Text>
          <View style={styles.infoCard}>
            <View style={styles.payoutStatusRow}>
              <CheckCircle2 size={16} color="#10B981" style={{ marginRight: 8, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.payoutStatusTitle}>{t('professional.profile.payoutsActiveTitle')}</Text>
                <Text style={styles.payoutStatusSub}>
                  {t('professional.profile.payoutsActiveSub')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Menu */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('professional.profile.managementTools')}</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/services' as any)}>
              <View style={styles.menuIconBox}>
                <Wrench size={18} color="#10B981" />
              </View>
              <Text style={styles.menuText}>{t('professional.profile.manageServices')}</Text>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/bookings' as any)}>
              <View style={styles.menuIconBox}>
                <ClipboardList size={18} color="#10B981" />
              </View>
              <Text style={styles.menuText}>{t('professional.profile.jobPayoutHistory')}</Text>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert('Partner Support', 'Contact RuralClap Partner Desk: 1800-PARTNER / partner@ruralclap.in')
              }>
              <View style={styles.menuIconBox}>
                <HelpCircle size={18} color="#64748B" />
              </View>
              <Text style={styles.menuText}>{t('professional.profile.partnerHelp')}</Text>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.8}
          onPress={handleSignOut}>
          <LogOut size={18} color="#F87171" style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>{t('professional.profile.signOut')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>RuralClap Partner App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  profileHeaderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#10B981',
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34D399',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  nameBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fullName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  verifiedChipText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  partnerIdText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#34D399',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#334155',
  },
  groupContainer: {
    marginBottom: 18,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 1,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  payoutStatusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  payoutStatusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  payoutStatusSub: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  menuCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginLeft: 56,
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  signOutText: {
    color: '#F87171',
    fontSize: 14,
    fontWeight: '800',
  },
  versionText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
});
