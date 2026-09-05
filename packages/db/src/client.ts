import {
  ServiceCategory,
  Service,
  UserProfile,
  ProfessionalService,
  Booking,
  BookingStatus,
  CreateBookingInput,
  UpdateBookingStatusInput,
  ToggleServiceOfferingInput,
  ServiceFilterParams,
  BookingFilterParams,
} from '@repo/types';
import { generateBookingNumber } from '@repo/utils';
import {
  SEED_CATEGORIES,
  SEED_SERVICES,
  SEED_PROFILES,
  DEMO_PROFESSIONAL_SERVICES,
  DEMO_BOOKINGS,
} from './seed-data';

/**
 * Shared Reactive Data Store
 * Provides both standalone mock operations & sync interface for apps.
 */
class UrbanCompanyStore {
  private categories: ServiceCategory[] = [...SEED_CATEGORIES];
  private services: Service[] = [...SEED_SERVICES];
  private profiles: UserProfile[] = [...SEED_PROFILES];
  private professionalServices: ProfessionalService[] = [
    ...DEMO_PROFESSIONAL_SERVICES,
  ];
  private bookings: Booking[] = [...DEMO_BOOKINGS];
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  // --- Categories ---
  getCategories(): ServiceCategory[] {
    return [...this.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getCategoryById(id: string): ServiceCategory | undefined {
    return this.categories.find((c) => c.id === id || c.slug === id);
  }

  // --- Services ---
  getServices(filters?: ServiceFilterParams): Service[] {
    let result = [...this.services].filter((s) => s.isActive);

    if (filters?.categoryId) {
      result = result.filter(
        (s) =>
          s.categoryId === filters.categoryId ||
          s.category?.slug === filters.categoryId
      );
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.fullDescription.toLowerCase().includes(q)
      );
    }

    if (filters?.isPopular !== undefined) {
      result = result.filter((s) => s.isPopular === filters.isPopular);
    }

    if (filters?.maxPrice) {
      result = result.filter(
        (s) => (s.discountedPrice ?? s.basePrice) <= filters.maxPrice!
      );
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          result.sort(
            (a, b) =>
              (a.discountedPrice ?? a.basePrice) -
              (b.discountedPrice ?? b.basePrice)
          );
          break;
        case 'price_desc':
          result.sort(
            (a, b) =>
              (b.discountedPrice ?? b.basePrice) -
              (a.discountedPrice ?? a.basePrice)
          );
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
          break;
      }
    }

    // Attach category object
    return result.map((service) => ({
      ...service,
      category: this.getCategoryById(service.categoryId),
    }));
  }

  getServiceById(id: string): Service | undefined {
    const service = this.services.find((s) => s.id === id || s.slug === id);
    if (!service) return undefined;
    return {
      ...service,
      category: this.getCategoryById(service.categoryId),
    };
  }

  // --- Profiles ---
  getProfileById(id: string): UserProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  saveProfile(profile: UserProfile): UserProfile {
    const index = this.profiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      this.profiles[index] = { ...this.profiles[index], ...profile, updatedAt: new Date().toISOString() };
    } else {
      this.profiles.push(profile);
    }
    this.notify();
    return profile;
  }

  // --- Professional Services ---
  getProfessionalServices(professionalId: string): ProfessionalService[] {
    return this.professionalServices
      .filter((ps) => ps.professionalId === professionalId)
      .map((ps) => ({
        ...ps,
        service: this.getServiceById(ps.serviceId),
      }));
  }

  toggleServiceOffering(
    professionalId: string,
    input: ToggleServiceOfferingInput
  ): ProfessionalService {
    const index = this.professionalServices.findIndex(
      (ps) =>
        ps.professionalId === professionalId && ps.serviceId === input.serviceId
    );

    let updated: ProfessionalService;

    if (index >= 0) {
      const existing = this.professionalServices[index]!;
      updated = {
        ...existing,
        isAvailable: input.isAvailable,
        customPrice:
          input.customPrice !== undefined
            ? input.customPrice
            : existing.customPrice,
      };
      this.professionalServices[index] = updated;
    } else {
      updated = {
        id: `ps-${Date.now()}`,
        professionalId,
        serviceId: input.serviceId,
        customPrice: input.customPrice,
        isAvailable: input.isAvailable,
        completedJobsCount: 0,
        createdAt: new Date().toISOString(),
      };
      this.professionalServices.push(updated);
    }

    this.notify();
    return {
      ...updated,
      service: this.getServiceById(updated.serviceId),
    };
  }

  // --- Bookings ---
  getBookings(params?: BookingFilterParams): Booking[] {
    let result = [...this.bookings];

    if (params?.userId && params.role === 'customer') {
      result = result.filter((b) => b.customerId === params.userId);
    } else if (params?.userId && params.role === 'professional') {
      // Professional sees jobs assigned to them OR pending open jobs
      result = result.filter(
        (b) => b.professionalId === params.userId || b.status === 'pending'
      );
    }

    if (params?.status) {
      if (params.status === 'active') {
        result = result.filter((b) =>
          ['pending', 'accepted', 'in_progress'].includes(b.status)
        );
      } else if (params.status === 'history') {
        result = result.filter((b) =>
          ['completed', 'cancelled'].includes(b.status)
        );
      } else if (params.status !== 'all') {
        result = result.filter((b) => b.status === params.status);
      }
    }

    // Sort latest first
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Hydrate associations
    return result.map((booking) => ({
      ...booking,
      service: this.getServiceById(booking.serviceId),
      customer: this.getProfileById(booking.customerId),
      professional: booking.professionalId
        ? this.getProfileById(booking.professionalId)
        : null,
    }));
  }

  getBookingById(id: string): Booking | undefined {
    const booking = this.bookings.find(
      (b) => b.id === id || b.bookingNumber === id
    );
    if (!booking) return undefined;

    return {
      ...booking,
      service: this.getServiceById(booking.serviceId),
      customer: this.getProfileById(booking.customerId),
      professional: booking.professionalId
        ? this.getProfileById(booking.professionalId)
        : null,
    };
  }

  createBooking(customerId: string, input: CreateBookingInput): Booking {
    const service = this.getServiceById(input.serviceId);
    if (!service) {
      throw new Error(`Service not found: ${input.serviceId}`);
    }

    const price = service.discountedPrice ?? service.basePrice;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: generateBookingNumber(),
      customerId,
      professionalId: null, // open for professionals to accept
      serviceId: input.serviceId,
      status: 'pending',
      scheduledDate: input.scheduledDate,
      scheduledTimeSlot: input.scheduledTimeSlot,
      totalPrice: price,
      customerAddress: input.customerAddress,
      customerPhone: input.customerPhone,
      customerNotes: input.customerNotes ?? null,
      paymentStatus: 'pending',
      paymentMethod: input.paymentMethod ?? 'cash_after_service',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    this.notify();

    return {
      ...newBooking,
      service,
      customer: this.getProfileById(customerId),
    };
  }

  updateBookingStatus(
    bookingId: string,
    input: UpdateBookingStatusInput
  ): Booking {
    const index = this.bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

    const current = this.bookings[index]!;
    const updated: Booking = {
      ...current,
      status: input.status,
      professionalId:
        input.professionalId !== undefined
          ? input.professionalId
          : current.professionalId,
      cancellationReason:
        input.cancellationReason !== undefined
          ? input.cancellationReason
          : current.cancellationReason,
      rating: input.rating !== undefined ? input.rating : current.rating,
      reviewText:
        input.reviewText !== undefined ? input.reviewText : current.reviewText,
      paymentStatus:
        input.status === 'completed' ? 'paid' : current.paymentStatus,
      updatedAt: new Date().toISOString(),
    };

    this.bookings[index] = updated;
    this.notify();

    return {
      ...updated,
      service: this.getServiceById(updated.serviceId),
      customer: this.getProfileById(updated.customerId),
      professional: updated.professionalId
        ? this.getProfileById(updated.professionalId)
        : null,
    };
  }
}

export const dbStore = new UrbanCompanyStore();
