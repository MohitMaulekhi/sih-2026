import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  boolean,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type UserRole = 'customer' | 'professional';


// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'professional']);
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'cancelled',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'paid',
  'refunded',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'cash_after_service',
  'upi',
  'card',
  'wallet',
]);

// 1. Profiles Table (Linked with Supabase Auth users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(), // maps to auth.users.id
  role: userRoleEnum('role').default('customer').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  city: text('city').default('Bengaluru'),
  address: text('address'),
  rating: numeric('rating', { precision: 3, scale: 2 }).default('5.00'),
  experienceYears: integer('experience_years').default(1),
  isVerified: boolean('is_verified').default(false),
  isOnline: boolean('is_online').default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 2. Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  imageUrl: text('image_url').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 3. Services Table
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id')
    .references(() => categories.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  basePrice: integer('base_price').notNull(),
  discountedPrice: integer('discounted_price'),
  durationMinutes: integer('duration_minutes').default(60).notNull(),
  imageUrl: text('image_url').notNull(),
  features: jsonb('features').$type<string[]>().default([]).notNull(),
  whatsIncluded: jsonb('whats_included').$type<string[]>().default([]).notNull(),
  whatsExcluded: jsonb('whats_excluded').$type<string[]>().default([]).notNull(),
  rating: numeric('rating', { precision: 3, scale: 2 }).default('4.85').notNull(),
  reviewsCount: integer('reviews_count').default(0).notNull(),
  isPopular: boolean('is_popular').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 4. Professional Services Table
export const professionalServices = pgTable('professional_services', {
  id: uuid('id').defaultRandom().primaryKey(),
  professionalId: uuid('professional_id')
    .references(() => profiles.id, { onDelete: 'cascade' })
    .notNull(),
  serviceId: uuid('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
  customPrice: integer('custom_price'),
  isAvailable: boolean('is_available').default(true).notNull(),
  experienceNotes: text('experience_notes'),
  completedJobsCount: integer('completed_jobs_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 5. Bookings Table
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingNumber: text('booking_number').notNull().unique(),
  customerId: uuid('customer_id')
    .references(() => profiles.id, { onDelete: 'cascade' })
    .notNull(),
  professionalId: uuid('professional_id').references(() => profiles.id, {
    onDelete: 'set null',
  }),
  serviceId: uuid('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTimeSlot: text('scheduled_time_slot').notNull(),
  totalPrice: integer('total_price').notNull(),
  customerAddress: text('customer_address').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerNotes: text('customer_notes'),
  cancellationReason: text('cancellation_reason'),
  rating: integer('rating'),
  reviewText: text('review_text'),
  paymentStatus: paymentStatusEnum('payment_status')
    .default('pending')
    .notNull(),
  paymentMethod: paymentMethodEnum('payment_method')
    .default('cash_after_service')
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 6. Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id')
    .references(() => bookings.id, { onDelete: 'cascade' })
    .notNull(),
  customerId: uuid('customer_id')
    .references(() => profiles.id, { onDelete: 'cascade' })
    .notNull(),
  professionalId: uuid('professional_id')
    .references(() => profiles.id, { onDelete: 'cascade' })
    .notNull(),
  serviceId: uuid('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  customerBookings: many(bookings, { relationName: 'customer_bookings' }),
  professionalBookings: many(bookings, { relationName: 'professional_bookings' }),
  offeredServices: many(professionalServices),
  reviewsGiven: many(reviews, { relationName: 'customer_reviews' }),
  reviewsReceived: many(reviews, { relationName: 'professional_reviews' }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
  professionalOfferings: many(professionalServices),
  bookings: many(bookings),
}));

export const professionalServicesRelations = relations(
  professionalServices,
  ({ one }) => ({
    professional: one(profiles, {
      fields: [professionalServices.professionalId],
      references: [profiles.id],
    }),
    service: one(services, {
      fields: [professionalServices.serviceId],
      references: [services.id],
    }),
  })
);

export const bookingsRelations = relations(bookings, ({ one }) => ({
  customer: one(profiles, {
    fields: [bookings.customerId],
    references: [profiles.id],
    relationName: 'customer_bookings',
  }),
  professional: one(profiles, {
    fields: [bookings.professionalId],
    references: [profiles.id],
    relationName: 'professional_bookings',
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));
