import {
  ServiceCategory,
  Service,
  UserProfile,
  ProfessionalService,
  Booking,
  CreateBookingInput,
  UpdateBookingStatusInput,
  ToggleServiceOfferingInput,
  ServiceFilterParams,
  BookingFilterParams,
} from '@repo/types';
import { generateBookingNumber } from '@repo/utils';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://zogktmqmoeauncwbpxqz.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_iEWxkLSTfMCMxvpnax8flw_ZrTwIGyh';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_KEY;

// This client never manages auth sessions — that's @repo/auth's job. Disabling
// session persistence/refresh here prevents a second competing GoTrueClient
// instance from being created in the same app. It still needs to send the
// signed-in user's access token on requests (RLS policies like "Professionals
// can manage their offered services" check auth.uid()), so @repo/auth pushes
// the current token in via setDbAuthToken whenever its session changes.
let currentAccessToken: string | null = null;

export function setDbAuthToken(token: string | null): void {
  if (token === currentAccessToken) return;
  currentAccessToken = token;

  // Realtime's auth is only read once at socket-connect time, so it needs to
  // be pushed explicitly whenever the token changes (unlike REST calls, which
  // read currentAccessToken fresh on every request via the accessToken option
  // above).
  supabase.realtime.setAuth(token).catch(() => {});

  // The store's very first sync runs at module load, before any session
  // exists, so RLS-protected tables (categories, services, ...) come back
  // empty under the anonymous role. Re-sync once we actually have a session.
  if (token) {
    dbStore.syncFromSupabase();
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  accessToken: async () => currentAccessToken,
});

/**
 * Shared Reactive Data Store backed by Supabase & Reactive Sync
 */
class UrbanCompanyStore {
  private categories: ServiceCategory[] = [];
  private services: Service[] = [];
  private profiles: UserProfile[] = [];
  private professionalServices: ProfessionalService[] = [];
  private bookings: Booking[] = [];
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    this.syncFromSupabase();
    this.subscribeToRealtime();
  }

  /**
   * Live Postgres change subscriptions. Without this, each app instance only ever
   * sees the data that existed at construction time (e.g. a professional's app would
   * never learn about a new customer booking, cancellation, or review until restart).
   */
  private subscribeToRealtime() {
    supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => this.applyBookingChange(payload)
      )
      .subscribe();

    supabase
      .channel('professional-services-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'professional_services' },
        (payload) => this.applyProfessionalServiceChange(payload)
      )
      .subscribe();
  }

  private mapBookingRow(b: any): Booking {
    return {
      id: b.id,
      bookingNumber: b.booking_number,
      customerId: b.customer_id,
      professionalId: b.professional_id,
      serviceId: b.service_id,
      status: b.status,
      scheduledDate: b.scheduled_date,
      scheduledTimeSlot: b.scheduled_time_slot,
      totalPrice: b.total_price,
      customerAddress: b.customer_address,
      customerPhone: b.customer_phone,
      customerNotes: b.customer_notes,
      cancellationReason: b.cancellation_reason,
      rating: b.rating,
      reviewText: b.review_text,
      paymentStatus: b.payment_status,
      paymentMethod: b.payment_method,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    };
  }

  private applyBookingChange(payload: {
    eventType: string;
    new: Record<string, any>;
    old: Record<string, any>;
  }) {
    if (payload.eventType === 'DELETE') {
      this.bookings = this.bookings.filter((b) => b.id !== payload.old.id);
      this.notify();
      return;
    }

    const incoming = this.mapBookingRow(payload.new);
    // Match by id first; fall back to bookingNumber since createBooking() assigns a
    // temporary local id optimistically while Supabase generates its own row id.
    const index = this.bookings.findIndex(
      (b) => b.id === incoming.id || b.bookingNumber === incoming.bookingNumber
    );
    if (index >= 0) {
      this.bookings[index] = incoming;
    } else {
      this.bookings.unshift(incoming);
    }
    this.notify();
  }

  private applyProfessionalServiceChange(payload: {
    eventType: string;
    new: Record<string, any>;
    old: Record<string, any>;
  }) {
    if (payload.eventType === 'DELETE') {
      this.professionalServices = this.professionalServices.filter(
        (ps) => ps.id !== payload.old.id
      );
      this.notify();
      return;
    }

    const ps = payload.new;
    const incoming: ProfessionalService = {
      id: ps.id,
      professionalId: ps.professional_id,
      serviceId: ps.service_id,
      customPrice: ps.custom_price,
      isAvailable: ps.is_available,
      experienceNotes: ps.experience_notes,
      completedJobsCount: ps.completed_jobs_count || 0,
      createdAt: ps.created_at,
    };
    const index = this.professionalServices.findIndex((p) => p.id === incoming.id);
    if (index >= 0) {
      this.professionalServices[index] = incoming;
    } else {
      this.professionalServices.push(incoming);
    }
    this.notify();
  }

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

  async syncFromSupabase() {
    try {
      // 1. Fetch Categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (catData && catData.length > 0) {
        this.categories = catData.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon: c.icon,
          imageUrl: c.image_url,
          sortOrder: c.sort_order,
          isActive: c.is_active,
        }));
      }

      // 2. Fetch Services
      const { data: srvData } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (srvData && srvData.length > 0) {
        this.services = srvData.map((s) => ({
          id: s.id,
          categoryId: s.category_id,
          title: s.title,
          slug: s.slug,
          shortDescription: s.short_description,
          fullDescription: s.full_description,
          basePrice: s.base_price,
          discountedPrice: s.discounted_price,
          durationMinutes: s.duration_minutes,
          imageUrl: s.image_url,
          features: s.features || [],
          whatsIncluded: s.whats_included || [],
          whatsExcluded: s.whats_excluded || [],
          rating: Number(s.rating) || 4.85,
          reviewsCount: s.reviews_count || 0,
          isPopular: s.is_popular,
          isActive: s.is_active,
        }));
      }

      // 3. Fetch Bookings
      const { data: bData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bData && bData.length > 0) {
        this.bookings = bData.map((b) => this.mapBookingRow(b));
      }

      // 4. Fetch Professional Services
      const { data: psData } = await supabase
        .from('professional_services')
        .select('*');

      if (psData && psData.length > 0) {
        this.professionalServices = psData.map((ps) => ({
          id: ps.id,
          professionalId: ps.professional_id,
          serviceId: ps.service_id,
          customPrice: ps.custom_price,
          isAvailable: ps.is_available,
          experienceNotes: ps.experience_notes,
          completedJobsCount: ps.completed_jobs_count || 0,
          createdAt: ps.created_at,
        }));
      }

      this.initialized = true;
      this.notify();
    } catch (err) {
      console.warn('Supabase store sync fallback to active cache:', err);
    }
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
      this.profiles[index] = {
        ...this.profiles[index],
        ...profile,
        updatedAt: new Date().toISOString(),
      };
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

  async toggleServiceOffering(
    professionalId: string,
    input: ToggleServiceOfferingInput
  ): Promise<ProfessionalService> {
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

    // Persist to Supabase in background
    Promise.resolve(
      supabase.from('professional_services').upsert({
        professional_id: professionalId,
        service_id: input.serviceId,
        is_available: input.isAvailable,
        custom_price: input.customPrice,
      })
    ).catch(() => {});

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
    const bNumber = generateBookingNumber();

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: bNumber,
      customerId,
      professionalId: null,
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

    // Persist to Supabase
    Promise.resolve(
      supabase.from('bookings').insert({
        booking_number: bNumber,
        customer_id: customerId,
        service_id: input.serviceId,
        status: 'pending',
        scheduled_date: input.scheduledDate,
        scheduled_time_slot: input.scheduledTimeSlot,
        total_price: price,
        customer_address: input.customerAddress,
        customer_phone: input.customerPhone,
        customer_notes: input.customerNotes || null,
        payment_status: 'pending',
        payment_method: input.paymentMethod || 'cash_after_service',
      })
    ).catch(() => {});

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

    // Persist to Supabase
    const updatePayload: Record<string, any> = {
      status: input.status,
      updated_at: new Date().toISOString(),
    };
    if (input.professionalId !== undefined) {
      updatePayload.professional_id = input.professionalId;
    }
    if (input.cancellationReason !== undefined) {
      updatePayload.cancellation_reason = input.cancellationReason;
    }
    if (input.rating !== undefined) {
      updatePayload.rating = input.rating;
    }
    if (input.reviewText !== undefined) {
      updatePayload.review_text = input.reviewText;
    }
    if (input.status === 'completed') {
      updatePayload.payment_status = 'paid';
    }

    Promise.resolve(
      supabase.from('bookings').update(updatePayload).eq('id', bookingId)
    ).catch(() => {});

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
