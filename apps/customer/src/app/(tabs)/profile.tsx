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
import { useTranslation, LanguageToggle } from '@repo/i18n';
import {
  MapPin,
  Calendar,
  Compass,
  LogOut,
  ChevronRight,
  User,
  ShieldCheck,
  Phone,
  Mail,
  HelpCircle,
  FileText,
  Sparkles,
  Languages,
} from 'lucide-react-native';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const userBookings = dbStore.getBookings({
    userId: user?.id,
    role: 'customer',
  });

  const completedCount = userBookings.filter(
    (b) => b.status === 'completed'
  ).length;
  const activeCount = userBookings.filter((b) =>
    ['pending', 'accepted', 'in_progress'].includes(b.status)
  ).length;

  const handleSignOut = () => {
    Alert.alert(t('customer.profile.signOut'), 'Are you sure you want to sign out of RuralClap?', [
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
        {/* Page Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('customer.profile.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('customer.profile.subtitle')}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <User size={32} color="#EA580C" />
              </View>
            )}
            <View style={styles.verifiedDot}>
              <ShieldCheck size={12} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.userName}>{user?.fullName || 'RuralClap Customer'}</Text>
            <View style={styles.verifiedChip}>
              <ShieldCheck size={12} color="#15803D" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedChipText}>{t('customer.profile.verifiedCustomer')}</Text>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userBookings.length}</Text>
              <Text style={styles.statTitle}>{t('customer.profile.bookings')}</Text>
            </View>
            <View style={styles.statLine} />
            <View style={styles.statBox}>
              <Text style={styles.statValueActive}>{activeCount}</Text>
              <Text style={styles.statTitle}>{t('customer.profile.active')}</Text>
            </View>
            <View style={styles.statLine} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statTitle}>{t('customer.profile.completed')}</Text>
            </View>
          </View>
        </View>

        {/* Language Preference */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('common.language').toUpperCase()}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Languages size={16} color="#EA580C" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{t('common.language')}</Text>
              </View>
              <LanguageToggle accentColor="#EA580C" />
            </View>
          </View>
        </View>

        {/* Contact & Location Info */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('customer.profile.contactAddress')}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Mail size={16} color="#EA580C" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'customer@ruralclap.in'}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Phone size={16} color="#EA580C" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone || '+91 98765 43210'}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <MapPin size={16} color="#EA580C" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Default Delivery Location</Text>
                <Text style={styles.infoValue}>
                  {user?.address || 'Flat 402, Green Glen Heights, Bengaluru - 560103'}
                </Text>
                <Text style={styles.infoSubtext}>City: {user?.city || 'Bengaluru'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Links Menu */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('customer.profile.shortcuts')}</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/bookings' as any)}>
              <View style={styles.menuIconContainer}>
                <Calendar size={18} color="#EA580C" />
              </View>
              <Text style={styles.menuTitle}>{t('customer.profile.myBookings')}</Text>
              {activeCount > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{activeCount} {t('customer.profile.active')}</Text>
                </View>
              )}
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/explore' as any)}>
              <View style={styles.menuIconContainer}>
                <Compass size={18} color="#EA580C" />
              </View>
              <Text style={styles.menuTitle}>{t('customer.profile.exploreServices')}</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupHeader}>{t('customer.profile.aboutSupport')}</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert('RuralClap Support', 'For support, email us at support@ruralclap.in or call 1800-123-RURAL')
              }>
              <View style={styles.menuIconContainer}>
                <HelpCircle size={18} color="#64748B" />
              </View>
              <Text style={styles.menuTitle}>{t('customer.profile.helpSupport')}</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert('RuralClap Assurance', 'All services come with verified background-checked technicians and 30-day warranty.')
              }>
              <View style={styles.menuIconContainer}>
                <FileText size={18} color="#64748B" />
              </View>
              <Text style={styles.menuTitle}>{t('customer.profile.termsGuarantee')}</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.8}
          onPress={handleSignOut}>
          <LogOut size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>{t('customer.profile.signOut')}</Text>
        </TouchableOpacity>

        {/* Version info */}
        <Text style={styles.versionText}>RuralClap v1.0.0 • Doorstep Home Services</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    borderColor: '#EA580C',
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDBA74',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#16A34A',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedChipText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  statValueActive: {
    fontSize: 17,
    fontWeight: '900',
    color: '#EA580C',
  },
  statTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statLine: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  groupContainer: {
    marginBottom: 18,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFEDD5',
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
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 1,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  countBadgeText: {
    color: '#C2410C',
    fontSize: 11,
    fontWeight: '800',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 56,
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '800',
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
