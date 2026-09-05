import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';
import { Booking, BookingStatus } from '@repo/types';
import {
  StatusBadge,
  PaymentBadge,
  EmptyState,
} from '@repo/ui';
import { formatCurrency, formatDate } from '@repo/utils';

export default function CustomerBookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('active');
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Rating Modal state
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Cancel Confirmation Modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Change of plans');

  useEffect(() => {
    const loadBookings = () => {
      const all = dbStore.getBookings({
        userId: user?.id,
        role: 'customer',
      });
      setBookings(all);
    };

    loadBookings();
    const unsub = dbStore.subscribe(loadBookings);
    return unsub;
  }, [user]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') {
      return ['pending', 'accepted', 'in_progress'].includes(b.status);
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true; // 'all'
  });

  const handleCancelBooking = () => {
    if (!selectedBookingForCancel) return;
    dbStore.updateBookingStatus(selectedBookingForCancel.id, {
      status: 'cancelled',
      cancellationReason,
    });
    setCancelModalVisible(false);
    setSelectedBookingForCancel(null);
  };

  const handleRateBooking = () => {
    if (!selectedBookingForRating) return;
    dbStore.updateBookingStatus(selectedBookingForRating.id, {
      status: 'completed',
      rating: ratingScore,
      reviewText: reviewComment,
    });
    setRatingModalVisible(false);
    setSelectedBookingForRating(null);
    setReviewComment('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>
          Track active services & view history
        </Text>

        {/* Tab Filters */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
            onPress={() => setActiveTab('active')}>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'active' && styles.tabBtnTextActive,
              ]}>
              Active ({bookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status)).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
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
            style={[styles.tabBtn, activeTab === 'cancelled' && styles.tabBtnActive]}
            onPress={() => setActiveTab('cancelled')}>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'cancelled' && styles.tabBtnTextActive,
              ]}>
              Cancelled
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
              All ({bookings.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No Bookings Found"
            description={
              activeTab === 'active'
                ? "You don't have any ongoing or scheduled services right now."
                : 'No services found under this tab.'
            }
            actionText="Book a Service Now"
            onAction={() => router.push('/(tabs)')}
          />
        ) : (
          filteredBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bookingNumber}>
                    #{booking.bookingNumber}
                  </Text>
                  <Text style={styles.bookingCategory}>
                    {booking.service?.category?.name || 'Home Service'}
                  </Text>
                </View>
                <StatusBadge status={booking.status} size="small" />
              </View>

              {/* Service Info Row */}
              <View style={styles.serviceRow}>
                {booking.service?.imageUrl ? (
                  <Image
                    source={{ uri: booking.service.imageUrl }}
                    style={styles.serviceThumbnail}
                  />
                ) : (
                  <View style={styles.thumbnailFallback}>
                    <Text>🛠️</Text>
                  </View>
                )}
                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceTitle}>
                    {booking.service?.title || 'Home Service'}
                  </Text>
                  <Text style={styles.scheduleText}>
                    📅 {formatDate(booking.scheduledDate)}
                  </Text>
                  <Text style={styles.scheduleText}>
                    ⏱️ {booking.scheduledTimeSlot}
                  </Text>
                </View>
              </View>

              {/* Professional Section if Assigned */}
              {booking.professional ? (
                <View style={styles.proInfoBox}>
                  <View style={styles.proInfoLeft}>
                    {booking.professional.avatarUrl ? (
                      <Image
                        source={{ uri: booking.professional.avatarUrl }}
                        style={styles.proAvatar}
                      />
                    ) : (
                      <View style={styles.proAvatarFallback}>
                        <Text style={styles.proAvatarInitial}>
                          {booking.professional.fullName.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text style={styles.proLabel}>Assigned Professional</Text>
                      <Text style={styles.proName}>
                        {booking.professional.fullName} ★{' '}
                        {booking.professional.rating || '4.9'}
                      </Text>
                    </View>
                  </View>
                  {booking.professional.phone && (
                    <Text style={styles.proPhone}>
                      📞 {booking.professional.phone}
                    </Text>
                  )}
                </View>
              ) : (
                booking.status === 'pending' && (
                  <View style={styles.pendingProBox}>
                    <Text style={styles.pendingProText}>
                      ⏳ Matching nearest certified professional...
                    </Text>
                  </View>
                )
              )}

              {/* Address info */}
              <View style={styles.addressRow}>
                <Text style={styles.addressIcon}>📍</Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {booking.customerAddress}
                </Text>
              </View>

              {/* Rating review if given */}
              {booking.rating && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewRating}>
                    Your Rating: {'★'.repeat(booking.rating)} ({booking.rating}/5)
                  </Text>
                  {booking.reviewText && (
                    <Text style={styles.reviewComment}>
                      "{booking.reviewText}"
                    </Text>
                  )}
                </View>
              )}

              {/* Cancellation Reason if cancelled */}
              {booking.status === 'cancelled' && (
                <View style={styles.cancellationBox}>
                  <Text style={styles.cancellationText}>
                    Cancelled: {booking.cancellationReason || 'Requested by customer'}
                  </Text>
                </View>
              )}

              {/* Card Footer: Total Price & Actions */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.priceLabel}>Total Amount</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceAmount}>
                      {formatCurrency(booking.totalPrice)}
                    </Text>
                    <PaymentBadge status={booking.paymentStatus} />
                  </View>
                </View>

                <View style={styles.actionButtonsRow}>
                  {/* Cancel Button if active */}
                  {['pending', 'accepted'].includes(booking.status) && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedBookingForCancel(booking);
                        setCancelModalVisible(true);
                      }}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  )}

                  {/* Rate Service Button if completed and not yet rated */}
                  {booking.status === 'completed' && !booking.rating && (
                    <TouchableOpacity
                      style={styles.rateBtn}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedBookingForRating(booking);
                        setRatingScore(5);
                        setRatingModalVisible(true);
                      }}>
                      <Text style={styles.rateBtnText}>Rate Service ★</Text>
                    </TouchableOpacity>
                  )}

                  {/* Book Again */}
                  {['completed', 'cancelled'].includes(booking.status) && (
                    <TouchableOpacity
                      style={styles.bookAgainBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push(`/book/${booking.serviceId}`)
                      }>
                      <Text style={styles.bookAgainBtnText}>Book Again</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancel Service Booking?</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to cancel booking #
              {selectedBookingForCancel?.bookingNumber}?
            </Text>

            <Text style={styles.reasonLabel}>Reason for cancellation:</Text>
            {['Change of plans', 'Booked by mistake', 'Booked alternate provider'].map(
              (r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.reasonOption,
                    cancellationReason === r && styles.reasonOptionSelected,
                  ]}
                  onPress={() => setCancellationReason(r)}>
                  <Text
                    style={[
                      styles.reasonOptionText,
                      cancellationReason === r &&
                        styles.reasonOptionTextSelected,
                    ]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              )
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setCancelModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleCancelBooking}>
                <Text style={styles.modalConfirmBtnText}>Confirm Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rate & Review Modal */}
      <Modal
        visible={ratingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRatingModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            <Text style={styles.modalSubtitle}>
              {selectedBookingForRating?.service?.title} with{' '}
              {selectedBookingForRating?.professional?.fullName || 'our partner'}
            </Text>

            {/* Star selector */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setRatingScore(s)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.starIcon,
                      s <= ratingScore ? styles.starFilled : styles.starEmpty,
                    ]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Share feedback on cleanliness, punctuality & service quality..."
              placeholderTextColor="#94A3B8"
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRatingModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitRatingBtn}
                onPress={handleRateBooking}>
                <Text style={styles.modalSubmitRatingBtnText}>
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
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
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)' },
    }),
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  listContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookingCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
    marginTop: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  thumbnailFallback: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceDetails: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  proInfoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  proAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  proAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proAvatarInitial: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  proLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  proName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  proPhone: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  pendingProBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  pendingProText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 13,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    lineHeight: 16,
  },
  reviewBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  reviewRating: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  reviewComment: {
    fontSize: 12,
    color: '#15803D',
    fontStyle: 'italic',
  },
  cancellationBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancellationText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  rateBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bookAgainBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookAgainBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 420,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  reasonOption: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  reasonOptionSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#EDE9FE',
  },
  reasonOptionText: {
    fontSize: 13,
    color: '#475569',
  },
  reasonOptionTextSelected: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalCancelBtnText: {
    color: '#64748B',
    fontWeight: '600',
  },
  modalConfirmBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 14,
  },
  starIcon: {
    fontSize: 34,
  },
  starFilled: {
    color: '#F59E0B',
  },
  starEmpty: {
    color: '#CBD5E1',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  modalSubmitRatingBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalSubmitRatingBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
