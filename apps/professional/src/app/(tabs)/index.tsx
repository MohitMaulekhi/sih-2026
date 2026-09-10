import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';
import { Booking } from '@repo/types';
import { StatusBadge } from '@repo/ui';
import { formatCurrency, formatDate } from '@repo/utils';
import { useTranslation } from '@repo/i18n';
import {
  ShieldCheck,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Check,
  CheckCircle2,
  Rocket,
  Phone,
  MessageSquare,
  Inbox,
  CalendarCheck,
} from 'lucide-react-native';

export default function ProfessionalDashboardScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();

  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const load = () => {
      const data = dbStore.getBookings({
        userId: user?.id,
        role: 'professional',
      });
      setAllBookings(data);
    };

    load();
    const unsub = dbStore.subscribe(load);
    return unsub;
  }, [user]);

  const incomingRequests = allBookings.filter((b) => b.status === 'pending');
  const activeJobs = allBookings.filter(
    (b) =>
      b.professionalId === user?.id &&
      ['accepted', 'in_progress'].includes(b.status)
  );
  const completedJobs = allBookings.filter(
    (b) => b.professionalId === user?.id && b.status === 'completed'
  );

  const totalEarnings = completedJobs.reduce(
    (acc, curr) => acc + curr.totalPrice,
    0
  );

  const handleToggleOnline = async (val: boolean) => {
    setIsOnline(val);
    await updateProfile({ isOnline: val });
  };

  const handleAcceptJob = (bookingId: string) => {
    if (!user) return;
    try {
      dbStore.updateBookingStatus(bookingId, {
        status: 'accepted',
        professionalId: user.id,
      });
      Alert.alert(
        'Job Accepted!',
        'You are now assigned to this customer booking.'
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to accept job');
    }
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
    Alert.alert(
      'Service Completed!',
      'Great work! Payment has been marked collected and credited to your earnings.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Partner Header */}
        <View style={styles.topHeader}>
          <View style={styles.partnerInfo}>
            <View style={styles.partnerNameRow}>
              <Text style={styles.partnerName}>
                {user?.fullName || 'Partner'}
              </Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={12} color="#34D399" style={{ marginRight: 3 }} />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.partnerSub}>
              ★ {user?.rating ? Number(user.rating).toFixed(2) : '5.00'} • {user?.city || 'Bengaluru'}
            </Text>
          </View>

          {/* Online/Offline Toggle */}
          <View
            style={[
              styles.onlineToggleCard,
              isOnline ? styles.onlineCardActive : styles.onlineCardInactive,
            ]}>
            <View>
              <Text
                style={[
                  styles.onlineStatusText,
                  isOnline ? styles.onlineTextActive : styles.onlineTextInactive,
                ]}>
                {isOnline ? t('professional.dashboard.online') : t('professional.dashboard.offline')}
              </Text>
              <Text style={styles.onlineSubText}>
                {isOnline ? t('professional.dashboard.receivingJobs') : t('professional.dashboard.paused')}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: '#334155', true: '#059669' }}
              thumbColor={isOnline ? '#34D399' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('professional.dashboard.totalPayout')}</Text>
            <Text style={styles.metricNumber}>
              {formatCurrency(totalEarnings)}
            </Text>
            <Text style={styles.metricGrowth}>{t('professional.dashboard.lifetimeEarnings')}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('professional.dashboard.jobsDone')}</Text>
            <Text style={styles.metricNumber}>
              {completedJobs.length}
            </Text>
            <Text style={styles.metricGrowth}>
              ★ {user?.rating ? Number(user.rating).toFixed(1) : '5.0'} {t('professional.profile.rating')}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('professional.dashboard.activeJobs')}</Text>
            <Text style={styles.metricNumber}>{activeJobs.length}</Text>
            <Text style={styles.metricGrowth}>{t('professional.dashboard.scheduledToday')}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('professional.dashboard.pendingLeads')}</Text>
            <Text style={styles.metricNumber}>{incomingRequests.length}</Text>
            <Text style={styles.metricGrowth}>{t('professional.dashboard.readyToAccept')}</Text>
          </View>
        </View>

        {/* Incoming Leads / Job Requests Queue */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Bell size={18} color="#60A5FA" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>{t('professional.dashboard.incomingRequests')}</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{incomingRequests.length}</Text>
          </View>
        </View>

        {incomingRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Inbox size={32} color="#64748B" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>{t('professional.dashboard.noPendingRequests')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('professional.dashboard.noPendingRequestsSub')}
            </Text>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {incomingRequests.map((req) => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestCardHeader}>
                  <View>
                    <Text style={styles.requestBookingNum}>
                      #{req.bookingNumber}
                    </Text>
                    <Text style={styles.requestServiceTitle}>
                      {req.service?.title || 'Home Service'}
                    </Text>
                  </View>
                  <View style={styles.payoutBadge}>
                    <Text style={styles.payoutLabel}>Payout</Text>
                    <Text style={styles.payoutAmount}>
                      {formatCurrency(req.totalPrice)}
                    </Text>
                  </View>
                </View>

                <View style={styles.requestMetaRow}>
                  <View style={styles.metaItem}>
                    <Calendar size={12} color="#CBD5E1" style={{ marginRight: 4 }} />
                    <Text style={styles.requestMeta}>
                      {formatDate(req.scheduledDate)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={12} color="#CBD5E1" style={{ marginRight: 4 }} />
                    <Text style={styles.requestMeta}>
                      {req.scheduledTimeSlot}
                    </Text>
                  </View>
                </View>

                <View style={styles.requestLocationRow}>
                  <MapPin size={13} color="#94A3B8" style={{ marginRight: 6, marginTop: 1 }} />
                  <Text style={styles.requestLocationText} numberOfLines={2}>
                    {req.customerAddress}
                  </Text>
                </View>

                {req.customerNotes && (
                  <View style={styles.customerNotesBox}>
                    <MessageSquare size={13} color="#FCD34D" style={{ marginRight: 6, marginTop: 1 }} />
                    <Text style={styles.customerNotesText}>
                      "{req.customerNotes}"
                    </Text>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    activeOpacity={0.8}
                    onPress={() => handleAcceptJob(req.id)}>
                    <Check size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.acceptBtnText}>{t('professional.dashboard.acceptJob')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Active & In-Progress Jobs */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <CalendarCheck size={18} color="#34D399" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>{t('professional.dashboard.todaysSchedule')}</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{activeJobs.length}</Text>
          </View>
        </View>

        {activeJobs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Calendar size={32} color="#64748B" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>{t('professional.dashboard.noActiveJobs')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('professional.dashboard.noActiveJobsSub')}
            </Text>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {activeJobs.map((job) => (
              <View key={job.id} style={styles.activeJobCard}>
                <View style={styles.activeJobHeader}>
                  <View>
                    <Text style={styles.jobCustomerName}>
                      {job.customer?.fullName || 'Customer'}
                    </Text>
                    <Text style={styles.jobServiceTitle}>
                      {job.service?.title}
                    </Text>
                  </View>
                  <StatusBadge status={job.status} size="small" />
                </View>

                <View style={styles.jobDetailsRow}>
                  <Clock size={12} color="#CBD5E1" style={{ marginRight: 4 }} />
                  <Text style={styles.jobDetailText}>
                    {job.scheduledTimeSlot} • {formatDate(job.scheduledDate)}
                  </Text>
                </View>

                <View style={styles.jobAddressRow}>
                  <MapPin size={13} color="#94A3B8" style={{ marginRight: 6, marginTop: 1 }} />
                  <Text style={styles.jobAddressText}>
                    {job.customerAddress}
                  </Text>
                </View>

                {/* Customer Contact */}
                <View style={styles.contactBar}>
                  <Phone size={13} color="#60A5FA" style={{ marginRight: 6 }} />
                  <Text style={styles.phoneLabel}>
                    Contact: {job.customerPhone}
                  </Text>
                </View>

                {/* Status Transition Action Buttons */}
                <View style={styles.jobActionsRow}>
                  {job.status === 'accepted' && (
                    <TouchableOpacity
                      style={styles.startJobBtn}
                      activeOpacity={0.8}
                      onPress={() => handleStartJob(job.id)}>
                      <Rocket size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.startJobBtnText}>
                        {t('professional.dashboard.startService')}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {job.status === 'in_progress' && (
                    <TouchableOpacity
                      style={styles.completeJobBtn}
                      activeOpacity={0.8}
                      onPress={() => handleCompleteJob(job.id)}>
                      <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.completeJobBtnText}>
                        {t('professional.dashboard.markCompleted')}{' '}
                        {formatCurrency(job.totalPrice)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
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
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  partnerSub: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  onlineToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  onlineCardActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  onlineCardInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  onlineStatusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  onlineTextActive: {
    color: '#34D399',
  },
  onlineTextInactive: {
    color: '#F87171',
  },
  onlineSubText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  metricGrowth: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  countBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  requestCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestBookingNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#60A5FA',
  },
  requestServiceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  payoutBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  payoutLabel: {
    fontSize: 9,
    color: '#6EE7B7',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  payoutAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#34D399',
  },
  requestMetaRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestMeta: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  requestLocationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestLocationText: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
    lineHeight: 16,
  },
  customerNotesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  customerNotesText: {
    fontSize: 12,
    color: '#FCD34D',
    fontStyle: 'italic',
    flex: 1,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  activeJobCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobCustomerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  jobServiceTitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 1,
  },
  jobDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  jobAddressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobAddressText: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
    lineHeight: 16,
  },
  contactBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  phoneLabel: {
    fontSize: 13,
    color: '#60A5FA',
    fontWeight: '700',
  },
  jobActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  startJobBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
  },
  startJobBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  completeJobBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
  },
  completeJobBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
