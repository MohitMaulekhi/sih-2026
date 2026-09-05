import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { user, signOut, loginAsDemo } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const handleSwitchToPro = () => {
    // Switch demo to professional
    loginAsDemo('professional');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {user?.fullName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.fullName}>{user?.fullName || 'User'}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
                </View>
              </View>
              <Text style={styles.emailText}>{user?.email}</Text>
              <Text style={styles.phoneText}>
                {user?.phone || '+91 98765 43210'}
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userBookings.length}</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activeCount}</Text>
              <Text style={styles.statLabel}>Active Services</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Saved Address Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Default Service Address</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressIcon}>🏠</Text>
            <View style={styles.addressTextColumn}>
              <Text style={styles.addressType}>Home</Text>
              <Text style={styles.addressFull}>
                {user?.address ||
                  'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103'}
              </Text>
              <Text style={styles.addressCity}>City: {user?.city || 'Bengaluru'}</Text>
            </View>
          </View>
        </View>

        {/* Quick Demo Switcher Card */}
        <View style={styles.portalSwitchCard}>
          <View style={styles.portalSwitchHeader}>
            <Text style={styles.portalSwitchIcon}>⚡</Text>
            <View>
              <Text style={styles.portalSwitchTitle}>
                Are you a Service Professional?
              </Text>
              <Text style={styles.portalSwitchSubtitle}>
                Manage incoming customer bookings, set your rates & earn.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.switchButton}
            activeOpacity={0.8}
            onPress={handleSwitchToPro}>
            <Text style={styles.switchButtonText}>
              Test Role Guard / Switch to Pro Portal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/bookings')}>
            <Text style={styles.menuIcon}>📅</Text>
            <Text style={styles.menuText}>Booking History</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.menuIcon}>🔍</Text>
            <Text style={styles.menuText}>Explore All Services</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            activeOpacity={0.7}
            onPress={handleSignOut}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, styles.signOutText]}>
              Sign Out
            </Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '800',
    color: '#7C3AED',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '800',
  },
  emailText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7C3AED',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressIcon: {
    fontSize: 20,
  },
  addressTextColumn: {
    flex: 1,
  },
  addressType: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  addressFull: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 4,
  },
  addressCity: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  portalSwitchCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  portalSwitchHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  portalSwitchIcon: {
    fontSize: 24,
  },
  portalSwitchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  portalSwitchSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  switchButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  signOutText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  menuChevron: {
    fontSize: 18,
    color: '#94A3B8',
  },
});
