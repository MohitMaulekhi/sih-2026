import { BookingStatus, PaymentStatus } from '@repo/types';

/**
 * Simple class names concatenation helper
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format number into Indian Currency (INR / ₹)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format minutes into readable duration (e.g. 90 mins -> 1 hr 30 mins)
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMinutes} mins`;
}

/**
 * Format date string into human friendly format (e.g. "Mon, 15 Oct 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Generate human-friendly booking number like #UC-84920
 */
export function generateBookingNumber(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `UC-${randomNum}`;
}

/**
 * Standard booking time slots
 */
export const AVAILABLE_TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
  '08:00 PM - 10:00 PM',
];

/**
 * Status color and label metadata
 */
export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  badgeColor: string;
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  pending: {
    label: 'Pending Confirmation',
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FDE68A',
    badgeColor: '#F59E0B',
  },
  accepted: {
    label: 'Professional Assigned',
    bg: '#DBEAFE',
    text: '#1E40AF',
    border: '#BFDBFE',
    badgeColor: '#3B82F6',
  },
  in_progress: {
    label: 'Service In Progress',
    bg: '#EDE9FE',
    text: '#5B21B6',
    border: '#DDD6FE',
    badgeColor: '#8B5CF6',
  },
  completed: {
    label: 'Completed',
    bg: '#D1FAE5',
    text: '#065F46',
    border: '#A7F3D0',
    badgeColor: '#10B981',
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#FEE2E2',
    text: '#991B1B',
    border: '#FECACA',
    badgeColor: '#EF4444',
  },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  pending: {
    label: 'Payment Pending',
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FDE68A',
    badgeColor: '#F59E0B',
  },
  paid: {
    label: 'Paid',
    bg: '#D1FAE5',
    text: '#065F46',
    border: '#A7F3D0',
    badgeColor: '#10B981',
  },
  refunded: {
    label: 'Refunded',
    bg: '#F3F4F6',
    text: '#374151',
    border: '#E5E7EB',
    badgeColor: '#6B7280',
  },
};
