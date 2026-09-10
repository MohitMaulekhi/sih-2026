-- Seeds the full service catalog (matching packages/db/src/seed-data.ts) into Supabase
-- and enables Realtime change broadcasting for bookings & professional_services so the
-- professional app receives new job requests live instead of only on cold start.
--
-- Safe to run multiple times (idempotent upserts via ON CONFLICT).
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query) if you
-- don't have the Supabase CLI linked locally.

-- 1. Remaining services from seed-data.ts that were missing from the DB
--    (only 5 of 13 services were previously seeded).
INSERT INTO public.services (
  id, category_id, title, slug, short_description, full_description,
  base_price, discounted_price, duration_minutes, image_url,
  features, whats_included, whats_excluded, rating, reviews_count, is_popular
)
VALUES
  (
    'b0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000001',
    'AC Gas Leak Repair & Refill',
    'ac-gas-leak-refill',
    'Nitrogen testing, leak detection, brazing and 100% genuine refrigerant gas refill',
    'Detailed diagnosis for cooling loss, nitrogen leak testing, copper pipe brazing, and complete gas charging for Split or Window ACs.',
    2499, 2199, 60,
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    '["Nitrogen pressure testing for micro leaks", "Leak sealing & copper welding", "R32 / R410A / R22 genuine gas refill", "60-day warranty on gas charging"]'::jsonb,
    '["Leak identification and welding", "Complete gas cylinder charge by weight", "Post-fill amperage & pressure testing"]'::jsonb,
    '["Replacement of damaged coils or compressors"]'::jsonb,
    4.82, 680, false
  ),
  (
    'b0000000-0000-0000-0000-000000000007',
    'a0000000-0000-0000-0000-000000000001',
    'AC Installation / Uninstallation',
    'ac-installation',
    'Standard installation with bracket mounting, piping & vacuum testing',
    'Professional installation of Split or Window AC units ensuring perfect leveling, secure outdoor bracket mounting, vacuum pump testing and pipe insulation.',
    1299, 1099, 90,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    '["Precision wall drilling & core cutting", "Vibration-free heavy outdoor bracket mounting", "Vacuum pipe testing to eliminate moisture"]'::jsonb,
    '["Mounting of indoor and outdoor units", "Connecting existing copper pipes & drain pipe", "Electrical connection testing"]'::jsonb,
    '["Extra copper pipes beyond 3 meters", "Outdoor wall bracket (available on purchase)"]'::jsonb,
    4.78, 420, false
  ),
  (
    'b0000000-0000-0000-0000-000000000008',
    'a0000000-0000-0000-0000-000000000002',
    'Intense Bathroom Cleaning',
    'bathroom-deep-cleaning',
    'Tile scrubbing, hard water stain removal, WC sanitization & tap shining',
    'Specialized bathroom scrubbing with eco-friendly Diversey chemicals that eliminate yellow scaling, mildew, tile grime and restore sparkle.',
    599, 499, 60,
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    '["Rotary brush tile and grout scrubbing", "Mirror & chrome fittings de-scaling", "Toilet bowl & drain sanitization"]'::jsonb,
    '["Wall tiles, floor tiles & grouting", "Shower head, taps, washbasin & mirrors", "Exhaust fan & geyser wiping"]'::jsonb,
    '["Chipped tile repair or plumbing repairs"]'::jsonb,
    4.88, 1890, true
  ),
  (
    'b0000000-0000-0000-0000-000000000009',
    'a0000000-0000-0000-0000-000000000002',
    'Sofa & Upholstery Shampooing',
    'sofa-shampooing',
    'Wet shampoo extraction & stain treatment for 3-5 seater sofas & recliners',
    'Restore the fresh look and hygiene of fabric or leather sofas with high-suction extraction cleaning and hypoallergenic foaming agents.',
    999, 799, 75,
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    '["Deep dust extraction with German vacuum", "Organic foam shampoo application", "Moisture extraction leaving sofa 90% dry"]'::jsonb,
    '["Seats, backrests, cushions & armrests", "Stain treatment for food & beverage spills"]'::jsonb,
    '["Torn fabric or spring repair"]'::jsonb,
    4.84, 910, false
  ),
  (
    'b0000000-0000-0000-0000-000000000010',
    'a0000000-0000-0000-0000-000000000003',
    'Designer Lights & Chandelier Setup',
    'chandelier-lights-setup',
    'Pendant lights, ceiling chandeliers, strip LED & track lighting installation',
    'Expert hanging and wiring of decorative lights, crystal chandeliers, false ceiling profile lights with neat concealed cabling.',
    699, 599, 60,
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    '["Heavy anchor ceiling fasteners", "Neat concealed wiring connections", "Dimmer switch compatibility check"]'::jsonb,
    '["Assembly of light fixture & bracket mounting", "Testing with power controller"]'::jsonb,
    '["False ceiling cutting if structural modification needed"]'::jsonb,
    4.87, 360, false
  ),
  (
    'b0000000-0000-0000-0000-000000000011',
    'a0000000-0000-0000-0000-000000000004',
    'Commode & Flush Tank Repair',
    'commode-flush-repair',
    'Continuous flush water flow fix, siphon replacement, jet spray installation',
    'Complete repair of internal flush tank fittings, push buttons, float valves, and health faucet/jet spray replacements.',
    449, 399, 45,
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    '["Dual flush siphon calibration", "Leak-proof valve seal replacement", "Prevents water wastage"]'::jsonb,
    '["Flush mechanism inspection & repair", "Jet spray testing & seal fitting"]'::jsonb,
    '["New flush tank unit cost"]'::jsonb,
    4.79, 520, false
  ),
  (
    'b0000000-0000-0000-0000-000000000012',
    'a0000000-0000-0000-0000-000000000006',
    'Instant Glow Facial & Cleanup',
    'women-glow-facial',
    'O3+ / Cheryls facial, fruit scrub, blackhead extraction & brightening mask',
    'Revitalize your skin with premium branded facial products, deep steam pore cleansing, gentle ultrasonic blackhead removal and relaxing lymphatic facial massage.',
    1499, 1249, 60,
    'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
    '["100% sealed, single-use mono dose kits", "Steam & vacuum pore cleansing", "Therapeutic neck & shoulder massage"]'::jsonb,
    '["Cleansing, exfoliating scrub & toner", "Hydrating massage cream & glow mask", "Sunscreen barrier finish"]'::jsonb,
    '["Chemical peels"]'::jsonb,
    4.91, 2190, true
  ),
  (
    'b0000000-0000-0000-0000-000000000013',
    'a0000000-0000-0000-0000-000000000007',
    'Washing Machine Repair & Checkup',
    'washing-machine-repair',
    'Fix spin drum issues, water drainage, noise vibrations & PCB errors',
    'Certified technicians for Front Load, Top Load & Semi-Automatic washing machines of all major brands (LG, Samsung, IFB, Bosch, Whirlpool).',
    499, 399, 60,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    '["Comprehensive electronic PCB testing", "Motor & belt tension inspection", "90-day spare parts warranty"]'::jsonb,
    '["Complete machine diagnosis & error code scan", "Filter and drum scaling check"]'::jsonb,
    '["Cost of replacement components (motor, pump, board)"]'::jsonb,
    4.83, 840, true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category_id = EXCLUDED.category_id,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  base_price = EXCLUDED.base_price,
  discounted_price = EXCLUDED.discounted_price,
  duration_minutes = EXCLUDED.duration_minutes,
  image_url = EXCLUDED.image_url,
  features = EXCLUDED.features,
  whats_included = EXCLUDED.whats_included,
  whats_excluded = EXCLUDED.whats_excluded,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  is_popular = EXCLUDED.is_popular;

-- 2. Enable Realtime so INSERT/UPDATE on bookings & professional_services broadcast
--    to subscribed clients. Without this, a professional's app only ever sees jobs
--    that existed at the moment the app was opened (dbStore only fetches once on
--    construction) -- new customer bookings never arrive until app restart.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'professional_services'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.professional_services;
  END IF;
END $$;

-- Ensure replica identity is FULL so UPDATE/DELETE payloads include old row data
-- (needed for accurate realtime diffing on status transitions).
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.professional_services REPLICA IDENTITY FULL;
