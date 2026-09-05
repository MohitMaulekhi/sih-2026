import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';
import { Booking } from '@repo/types';
import { StatusBadge, EmptyState } from '@repo/ui';
import { formatCurrency, formatDate } from '@repo/utils';

export default function ProfessionalBookingsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed' | 'all'>('active');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const load = () => {
      const data = dbStore.getBookings({
        userId: user?.id,
        role: 'professional',
      });
      setBookings(data);
    };

    load();
    const unsub = dbStore.subscribe(load);
    return unsub;
  }, [user]);

  const filtered = bookings.filter((b) => {
    if (activeTab === 'requests') {
      return b.status === 'pending';
    }
    if (activeTab === 'active') {
      return (
        b.professionalId === user?.id &&
        ['accepted', 'in_progress'].includes(b.status)
      );
    }
    if (activeTab === 'completed') {
      return b.professionalId === user?.id && b.status === 'completed';
    }
    return true; // 'all'
  });

  const handleAcceptJob = (bookingId: string) => {
    dbStore.updateBookingStatus(bookingId, {
      status: 'accepted',
      professionalId: user?.id,
    });
    Alert.alert('Job Accepted!', 'Booking added to your active schedule.');
  };

  const handleStartJob = (bookingId: string) => {
    dbStore.updateBookingStatus(bookingId, {
      status: 'in_progress',
    });
  };

  const handleCompleteJob = (bookingId: string) => {
    dbStore.updateBookingStatus(bookingId, {
      status: 'completed',
    });
    Alert.alert('Success', 'Job marked completed and payout registered!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Management</Text>
        <Text style={styles.headerSubtitle}>
          Track leads, schedule & completed service payouts
        </Text>

        {/* Tab Selector */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]}
            onPress={() => setActiveTab('requests')}>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'requests' && styles.tabBtnTextActive,
              ]}>
              Requests ({bookings.filter((b) => b.status === 'pending').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
            onPress={() => setActiveTab('active')}>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'active' && styles.tabBtnTextActive,
              ]}>
              Active (
              {
                bookings.filter(
                  (b) =>
                    b.professionalId === user?.id &&
                    ['accepted', 'in_progress'].includes(b.status)
                ).length
              }
              )
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'completed' && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab('completed')}>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'completed' && styles.tabBtnTextActive,
              ]}>
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'all' && styles.tabBtnTextActive,
              ]}>
              All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="📋"
              title="No Bookings in This Tab"
              description="New bookings and customer assignments will be tracked here."
            />
          </View>
        ) : (
          filtered.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bookingNum}>
                    #{booking.bookingNumber}
                  </Text>
                  <Text style={styles.serviceName}>
                    {booking.service?.title}
                  </Text>
                </View>
                <StatusBadge status={booking.status} size="small" />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Customer:</Text>
                <Text style={styles.infoValue}>
                  {booking.customer?.fullName || 'Valued Customer'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Scheduled:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(booking.scheduledDate)} • {booking.scheduledTimeSlot}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {booking.customerAddress}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.phoneHighlight}>
                  {booking.customerPhone}
                </Text>
              </View>

              {booking.customerNotes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>
                    💬 "{booking.customerNotes}"
                  </Text>
                </View>
              )}

              {/* Card Footer: Payout & Actions */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.payoutLabel}>Total Payout</Text>
                  <Text style={styles.payoutAmount}>
                    {formatCurrency(booking.totalPrice)}
                  </Text>
                </View>

                {booking.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.actionBtnGreen}
                    activeOpacity={0.8}
                    onPress={() => handleAcceptJob(booking.id)}>
                    <Text style={styles.actionBtnText}>Accept Job ➔</Text>
                  </TouchableOpacity>
                )}

                {booking.status === 'accepted' && (
                  <TouchableOpacity
                    style={styles.actionBtnPurple}
                    activeOpacity={0.8}
                    onPress={() => handleStartJob(booking.id)}>
                    <Text style={styles.actionBtnText}>Start Service 🚀</Text>
                  </TouchableOpacity>
                )}

                {booking.status === 'in_progress' && (
                  <TouchableOpacity
                    style={styles.actionBtnGreen}
                    activeOpacity={0.8}
                    onPress={() => handleCompleteJob(booking.id)}>
                    <Text style={styles.actionBtnText}>Mark Complete ✅</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#1E293B',
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabBtnTextActive: {
    color: '#34D399',
    fontWeight: '800',
  },
  listContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  emptyContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  bookingNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#60A5FA',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    width: 80,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: '#E2E8F0',
    flex: 1,
    fontWeight: '500',
  },
  phoneHighlight: {
    fontSize: 13,
    color: '#34D399',
    fontWeight: '700',
  },
  notesBox: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 10,
  },
  notesText: {
    fontSize: 12,
    color: '#FCD34D',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  payoutLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  payoutAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#34D399',
  },
  actionBtnGreen: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnPurple: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
