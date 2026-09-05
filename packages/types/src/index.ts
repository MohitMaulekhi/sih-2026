export type UserRole = 'customer' | 'professional';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  city?: string | null;
  address?: string | null;
  rating?: number | null;
  experienceYears?: number | null;
  isVerified?: boolean | null;
  isOnline?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  basePrice: number;
  discountedPrice?: number | null;
  durationMinutes: number;
  imageUrl: string;
  features: string[];
  whatsIncluded: string[];
  whatsExcluded: string[];
  rating: number;
  reviewsCount: number;
  isPopular: boolean;
  isActive: boolean;
  category?: ServiceCategory;
}

export interface ProfessionalService {
  id: string;
  professionalId: string;
  serviceId: string;
  customPrice?: number | null;
  isAvailable: boolean;
  experienceNotes?: string | null;
  completedJobsCount: number;
  createdAt: string;
  service?: Service;
  professional?: UserProfile;
}

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type PaymentMethod = 'cash_after_service' | 'upi' | 'card' | 'wallet';

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  professionalId?: string | null;
  serviceId: string;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTimeSlot: string;
  totalPrice: number;
  customerAddress: string;
  customerPhone: string;
  customerNotes?: string | null;
  cancellationReason?: string | null;
  rating?: number | null;
  reviewText?: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  customer?: UserProfile | null;
  professional?: UserProfile | null;
}

export interface CreateBookingInput {
  serviceId: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  customerAddress: string;
  customerPhone: string;
  customerNotes?: string;
  paymentMethod?: PaymentMethod;
}

export interface UpdateBookingStatusInput {
  status: BookingStatus;
  professionalId?: string;
  cancellationReason?: string;
  rating?: number;
  reviewText?: string;
}

export interface ToggleServiceOfferingInput {
  serviceId: string;
  isAvailable: boolean;
  customPrice?: number;
}

export interface ServiceFilterParams {
  categoryId?: string;
  searchQuery?: string;
  isPopular?: boolean;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popular';
}

export interface BookingFilterParams {
  status?: BookingStatus | 'all' | 'active' | 'history';
  role?: UserRole;
  userId?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
