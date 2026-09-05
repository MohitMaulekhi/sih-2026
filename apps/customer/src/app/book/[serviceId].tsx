import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';
import { Service, PaymentMethod } from '@repo/types';
import { DateSlotPicker, PriceTag } from '@repo/ui';
import { formatCurrency, AVAILABLE_TIME_SLOTS } from '@repo/utils';

export default function BookServiceScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [service, setService] = useState<Service | null>(null);

  // Form State
  const defaultDate =
    new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0] ||
    '2026-10-15';
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    AVAILABLE_TIME_SLOTS[1] || '10:00 AM - 12:00 PM'
  );
  const [address, setAddress] = useState(
    user?.address || 'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103'
  );
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cash_after_service');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [createdBookingNumber, setCreatedBookingNumber] = useState<string>('');

  useEffect(() => {
    if (serviceId) {
      const s = dbStore.getServiceById(serviceId);
      if (s) setService(s);
    }
  }, [serviceId]);

  if (!service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading service...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const finalPrice = service.discountedPrice ?? service.basePrice;

  const handleConfirmBooking = () => {
    if (!address.trim()) {
      Alert.alert('Missing Address', 'Please provide a valid service address');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Missing Phone', 'Please provide a contact phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = dbStore.createBooking(user?.id || 'user-cust-001', {
        serviceId: service.id,
        scheduledDate: selectedDate,
        scheduledTimeSlot: selectedTimeSlot,
        customerAddress: address.trim(),
        customerPhone: phone.trim(),
        customerNotes: notes.trim() || undefined,
        paymentMethod,
      });

      setCreatedBookingNumber(newBooking.bookingNumber);
      setBookingSuccess(true);
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Failed to place booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.bookingRefText}>
            Booking ID: #{createdBookingNumber}
          </Text>
          <Text style={styles.successDesc}>
            Your request for <Text style={{ fontWeight: '800' }}>{service.title}</Text> has
            been placed successfully for{' '}
            <Text style={{ fontWeight: '700' }}>
              {selectedDate} ({selectedTimeSlot})
            </Text>
            . We are assigning the best rated professional to your doorstep.
          </Text>

          <TouchableOpacity
            style={styles.viewBookingsBtn}
            activeOpacity={0.85}
            onPress={() => {
              router.replace('/(tabs)/bookings');
            }}>
            <Text style={styles.viewBookingsBtnText}>Go to My Bookings ➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            activeOpacity={0.7}
            onPress={() => {
              router.replace('/(tabs)');
            }}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Service Mini Card */}
        <View style={styles.serviceMiniCard}>
          <Image
            source={{ uri: service.imageUrl }}
            style={styles.serviceMiniImage}
          />
          <View style={styles.serviceMiniInfo}>
            <Text style={styles.serviceMiniCategory}>
              {service.category?.name || 'Home Service'}
            </Text>
            <Text style={styles.serviceMiniTitle} numberOfLines={2}>
              {service.title}
            </Text>
            <PriceTag
              price={finalPrice}
              originalPrice={service.discountedPrice ? service.basePrice : null}
              size="small"
            />
          </View>
        </View>

        {/* Step 1: Date & Time Picker */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Select Schedule</Text>
          </View>

          <DateSlotPicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
          />
        </View>

        {/* Step 2: Address & Phone */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Service Location</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Complete Address</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Flat/House No, Building, Street, Area, Landmark, City..."
              placeholderTextColor="#94A3B8"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Contact Phone Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+91 98765 43210"
              placeholderTextColor="#94A3B8"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              Special Instructions (Optional)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Please bring an extension ladder / Ring bell twice..."
              placeholderTextColor="#94A3B8"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* Step 3: Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Payment Option</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash_after_service' &&
                styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash_after_service')}>
            <Text style={styles.paymentEmoji}>💵</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Pay After Service</Text>
              <Text style={styles.paymentSub}>
                Pay cash or UPI to partner after complete satisfaction
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                paymentMethod === 'cash_after_service' &&
                  styles.radioCircleSelected,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'upi' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('upi')}>
            <Text style={styles.paymentEmoji}>📱</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Instant UPI / QR</Text>
              <Text style={styles.paymentSub}>
                Google Pay, PhonePe, Paytm, BHIM UPI
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                paymentMethod === 'upi' && styles.radioCircleSelected,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Step 4: Price Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.billSummaryTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>{formatCurrency(finalPrice)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Safety Fee</Text>
            <Text style={styles.billFree}>FREE</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Visiting & Inspection Fee</Text>
            <Text style={styles.billFree}>₹0 (Included)</Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.billRowTotal}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(finalPrice)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Confirm Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Amount to pay</Text>
          <Text style={styles.bottomPriceValue}>
            {formatCurrency(finalPrice)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmBtn,
            isSubmitting && styles.confirmBtnDisabled,
          ]}
          activeOpacity={0.85}
          onPress={handleConfirmBooking}
          disabled={isSubmitting}>
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? 'Placing Request...' : 'Confirm & Book Now ➔'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 110,
  },
  serviceMiniCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    alignItems: 'center',
  },
  serviceMiniImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  serviceMiniInfo: {
    flex: 1,
  },
  serviceMiniCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    textTransform: 'uppercase',
  },
  serviceMiniTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  paymentOptionSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#EDE9FE',
  },
  paymentEmoji: {
    fontSize: 22,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  paymentSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  radioCircleSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  billSummaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  billFree: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  billRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7C3AED',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' },
    }),
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  confirmBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  bookingRefText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 16,
  },
  successDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 320,
  },
  viewBookingsBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewBookingsBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  homeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  homeBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
