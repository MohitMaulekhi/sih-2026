import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';
import { formatCurrency } from '@repo/utils';

export default function ProfessionalProfileScreen() {
  const router = useRouter();
  const { user, signOut, loginAsDemo } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const handleSwitchToCustomer = () => {
    // Switch demo account to customer
    loginAsDemo('customer');
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
                  {user?.fullName?.charAt(0) || 'P'}
                </Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.fullName}>{user?.fullName || 'Partner'}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>✓ Top Partner</Text>
                </View>
              </View>
              <Text style={styles.experienceText}>
                ⚡ {user?.experienceYears || 7}+ Years Experience
              </Text>
              <Text style={styles.phoneText}>
                {user?.phone || '+91 91234 56789'}
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatCurrency(totalEarnings || 4250)}
              </Text>
              <Text style={styles.statLabel}>Lifetime Payout</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {completedJobs.length || 14}
              </Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>★ {user?.rating || '4.92'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Bio & Skills */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Partner Bio & Expertise</Text>
          <Text style={styles.bioText}>
            {user?.bio ||
              'Certified HVAC & Appliance Specialist with 7+ years of experience across top home service platforms. Expert in AC deep servicing, PCB repair and electrical troubleshooting.'}
          </Text>
          <View style={styles.serviceCityTag}>
            <Text style={styles.serviceCityText}>
              📍 Serving City: {user?.city || 'Bengaluru'}
            </Text>
          </View>
        </View>

        {/* Quick Demo Switcher Card */}
        <View style={styles.portalSwitchCard}>
          <View style={styles.portalSwitchHeader}>
            <Text style={styles.portalSwitchIcon}>🛍️</Text>
            <View>
              <Text style={styles.portalSwitchTitle}>
                Switch to Customer Portal
              </Text>
              <Text style={styles.portalSwitchSubtitle}>
                Test role-based isolation & book home services as a customer.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.switchButton}
            activeOpacity={0.8}
            onPress={handleSwitchToCustomer}>
            <Text style={styles.switchButtonText}>
              Test Role Guard / Switch to Customer Portal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation & Logout */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/services')}>
            <Text style={styles.menuIcon}>🛠️</Text>
            <Text style={styles.menuText}>Manage Offered Services</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/bookings')}>
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuText}>View All Job History</Text>
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
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
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
    borderColor: '#10B981',
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '800',
    color: '#34D399',
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
    color: '#F8FAFC',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  experienceText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: '#34D399',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#334155',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceCityTag: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  serviceCityText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  portalSwitchCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 18,
    padding: 18,
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
    color: '#DDD6FE',
    lineHeight: 16,
  },
  switchButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '800',
  },
  menuCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
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
    color: '#E2E8F0',
    flex: 1,
  },
  signOutText: {
    color: '#F87171',
    fontWeight: '700',
  },
  menuChevron: {
    fontSize: 18,
    color: '#64748B',
  },
});
