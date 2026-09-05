import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookingStatus, PaymentStatus } from '@repo/types';
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@repo/utils';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const config = BOOKING_STATUS_CONFIG[status] || BOOKING_STATUS_CONFIG.pending;
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        isSmall && styles.badgeSmall,
      ]}>
      <View
        style={[
          styles.dot,
          { backgroundColor: config.badgeColor },
          isSmall && styles.dotSmall,
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: config.text },
          isSmall && styles.textSmall,
        ]}>
        {config.label}
      </Text>
    </View>
  );
};

export const PaymentBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const config = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;

  return (
    <View
      style={[
        styles.badge,
        styles.badgeSmall,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
      ]}>
      <Text style={[styles.text, styles.textSmall, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotSmall: {
    width: 5,
    height: 5,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 11,
  },
});
