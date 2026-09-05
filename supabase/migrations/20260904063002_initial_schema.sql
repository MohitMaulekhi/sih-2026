-- Urban Company monorepo idempotent schema migration

-- 1. Create Enums safely
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('customer', 'professional');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('cash_after_service', 'upi', 'card', 'wallet');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT DEFAULT 'Bengaluru',
  address TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00,
  experience_years INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  discounted_price INTEGER,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  image_url TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  whats_included JSONB NOT NULL DEFAULT '[]'::jsonb,
  whats_excluded JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.85,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Professional Services table
CREATE TABLE IF NOT EXISTS public.professional_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  custom_price INTEGER,
  is_available BOOLEAN NOT NULL DEFAULT true,
  experience_notes TEXT,
  completed_jobs_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (professional_id, service_id)
);

-- 6. Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status public.booking_status NOT NULL DEFAULT 'pending',
  scheduled_date TEXT NOT NULL,
  scheduled_time_slot TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_notes TEXT,
  cancellation_reason TEXT,
  rating INTEGER,
  review_text TEXT,
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  payment_method public.payment_method NOT NULL DEFAULT 'cash_after_service',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_popular ON public.services(is_popular);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional ON public.bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_prof_services_prof ON public.professional_services(professional_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies: Drop existing before re-creating
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Categories viewable by all authenticated" ON public.categories;
CREATE POLICY "Categories viewable by all authenticated"
  ON public.categories FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Services viewable by all authenticated" ON public.services;
CREATE POLICY "Services viewable by all authenticated"
  ON public.services FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Professional services viewable by authenticated" ON public.professional_services;
CREATE POLICY "Professional services viewable by authenticated"
  ON public.professional_services FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Professionals can manage their offered services" ON public.professional_services;
CREATE POLICY "Professionals can manage their offered services"
  ON public.professional_services FOR ALL
  TO authenticated
  USING (auth.uid() = professional_id);

DROP POLICY IF EXISTS "Customers view own bookings" ON public.bookings;
CREATE POLICY "Customers view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Professionals view assigned or open pending bookings" ON public.bookings;
CREATE POLICY "Professionals view assigned or open pending bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = professional_id OR 
    (status = 'pending' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'professional'
    ))
  );

DROP POLICY IF EXISTS "Customers create bookings" ON public.bookings;
CREATE POLICY "Customers create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users update relevant bookings" ON public.bookings;
CREATE POLICY "Users update relevant bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id OR auth.uid() = professional_id);

-- Auth Trigger on User Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Optional initial seed categories & services (Safe with ON CONFLICT)
INSERT INTO public.categories (id, name, slug, description, icon, image_url, sort_order)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'AC Service & Repair', 'ac-repair', 'Expert servicing, gas refill, deep jet wash & repair for split and window ACs', 'wind', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', 1),
  ('a0000000-0000-0000-0000-000000000002', 'Home Cleaning', 'home-cleaning', 'Deep home, kitchen, bathroom cleaning & sofa shampooing by trained professionals', 'sparkles', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', 2),
  ('a0000000-0000-0000-0000-000000000003', 'Electrician', 'electrician', 'Switchboard installation, fan repair, wiring fixes & appliance setups', 'zap', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80', 3),
  ('a0000000-0000-0000-0000-000000000004', 'Plumbing', 'plumbing', 'Tap & shower repair, leak fixing, pipe fitting, water tank & motor repair', 'droplet', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 4),
  ('a0000000-0000-0000-0000-000000000005', 'Men Salon & Spa', 'men-salon', 'Haircut, beard grooming, facial massage, detan & head massage at home', 'scissors', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80', 5),
  ('a0000000-0000-0000-0000-000000000006', 'Women Spa & Salon', 'women-salon', 'Facial, waxing, manicure, pedicure, hair spa & cleanup by top beauticians', 'smile', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80', 6),
  ('a0000000-0000-0000-0000-000000000007', 'Appliance Repair', 'appliance-repair', 'Washing machine, refrigerator, microwave & water purifier repair', 'tool', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', 7),
  ('a0000000-0000-0000-0000-000000000008', 'Painting & Waterproofing', 'painting', 'Home wall painting, waterproofing, damp proofing & texture styling', 'brush', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.services (
  id, category_id, title, slug, short_description, full_description, base_price, discounted_price, duration_minutes, image_url, features, whats_included, whats_excluded, rating, reviews_count, is_popular
)
VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Foam Jet AC Deep Servicing',
    'foam-jet-ac-servicing',
    '2X deeper cleaning with high pressure foam jet technology & cooling coil wash',
    'Complete AC deep cleaning with patented foam jet technology that removes 99% embedded dirt, debris and bacterial mold. Restores cooling efficiency and lowers electricity bills.',
    599, 499, 45,
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    '["High-pressure jet pump wash for indoor & outdoor units", "Advanced anti-bacterial foam cleaning", "Gas leak & compressor performance check", "30-day post-service warranty"]'::jsonb,
    '["Indoor unit coil deep wash with foam", "Outdoor unit pressure cleaning", "Filter & drain tray sanitization", "Cooling temperature & airflow verification"]'::jsonb,
    '["Gas refill charges (charged extra if needed)", "Spare parts replacement"]'::jsonb,
    4.89, 1420, true
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Full Home Deep Cleaning (2-3 BHK)',
    'full-home-deep-cleaning',
    'Exhaustive 6-hour deep cleaning of rooms, kitchen, washrooms & balcony',
    'Transform your home with industrial-grade single disc scrubbing machines, taski chemicals, vacuuming of sofas & mattresses, and deep sanitization of all surfaces.',
    3999, 3499, 240,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    '["Single disc mechanized floor scrubbing", "Deep stain & grease degreasing in kitchen", "Hard water scale removal in all bathrooms", "3-person verified professional team"]'::jsonb,
    '["Living room, bedrooms, kitchen & bathrooms", "Window glass, tracks, cobwebs & fans cleaning", "Cabinet interior & exterior cleaning"]'::jsonb,
    '["Wall washing / paint stain scraping", "Cleaning inside locked wardrobes with personal items"]'::jsonb,
    4.92, 2310, true
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'Ceiling Fan & Switchboard Repair',
    'fan-switch-repair',
    'Fan regulator change, switch replacement, short-circuit troubleshooting',
    'Certified electricians for safe electrical diagnostics, switchboard repair, MCB tripping fixes, and ceiling fan replacement.',
    299, 249, 45,
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    '["Insulated safety tools & multimeter check", "Fix socket sparking, burnt wires & regulators", "30-day service guarantee"]'::jsonb,
    '["Inspection & labor for replacement of up to 3 points", "Testing of earthing & phase voltage"]'::jsonb,
    '["Cost of new switches, fans or MCBs"]'::jsonb,
    4.81, 1140, true
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000004',
    'Tap, Mixer & Leakage Repair',
    'tap-mixer-leakage-repair',
    'Dripping tap repair, cartridge replacement, pipe joints & diverter fixing',
    'Quick and lasting solutions for leaking taps, wall mixers, basin traps, angle valves and dripping pipe joints.',
    299, 249, 30,
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    '["Thread tape sealing & spindle replacement", "Fix low water pressure issues", "Clean work area after completion"]'::jsonb,
    '["Labor for repair of up to 2 taps or 1 mixer", "Diagnosis of pressure imbalance"]'::jsonb,
    '["Cost of replacement fixtures/cartridges"]'::jsonb,
    4.85, 1450, true
  ),
  (
    'b0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000005',
    'Haircut & Royal Beard Styling',
    'men-haircut-beard',
    'Custom haircut, beard shaping with razor finish, hot towel & head massage',
    'Premium salon experience at your doorstep. Includes trend haircut, beard fading/grooming, hot towel refresh and relaxing 10-min head massage.',
    499, 399, 45,
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    '["Single-use sanitized salon cape & blades", "Consultation for face-matched hairstyles", "Herbal soothing after-shave lotion"]'::jsonb,
    '["Haircut + Beard trim/shape", "Hot towel steam wipe", "Head massage with cooling almond oil"]'::jsonb,
    '["Hair color / Hair spa treatment"]'::jsonb,
    4.93, 3100, true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  base_price = EXCLUDED.base_price,
  discounted_price = EXCLUDED.discounted_price,
  features = EXCLUDED.features,
  whats_included = EXCLUDED.whats_included,
  whats_excluded = EXCLUDED.whats_excluded;
