import {
  ServiceCategory,
  Service,
  UserProfile,
  ProfessionalService,
  Booking,
} from '@repo/types';

export const SEED_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-ac-repair',
    name: 'AC Service & Repair',
    slug: 'ac-repair',
    description: 'Expert servicing, gas refill, deep jet wash & repair for split and window ACs',
    icon: 'wind',
    imageUrl:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-home-cleaning',
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'Deep home, kitchen, bathroom cleaning & sofa shampooing by trained professionals',
    icon: 'sparkles',
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-electrician',
    name: 'Electrician',
    slug: 'electrician',
    description: 'Switchboard installation, fan repair, wiring fixes & appliance setups',
    icon: 'zap',
    imageUrl:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Tap & shower repair, leak fixing, pipe fitting, water tank & motor repair',
    icon: 'droplet',
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-salon-men',
    name: 'Men Salon & Spa',
    slug: 'men-salon',
    description: 'Haircut, beard grooming, facial massage, detan & head massage at home',
    icon: 'scissors',
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-salon-women',
    name: 'Women Spa & Salon',
    slug: 'women-salon',
    description: 'Facial, waxing, manicure, pedicure, hair spa & cleanup by top beauticians',
    icon: 'smile',
    imageUrl:
      'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-appliances',
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'Washing machine, refrigerator, microwave & water purifier repair',
    icon: 'tool',
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 'cat-painting',
    name: 'Painting & Waterproofing',
    slug: 'painting',
    description: 'Home wall painting, waterproofing, damp proofing & texture styling',
    icon: 'brush',
    imageUrl:
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    sortOrder: 8,
    isActive: true,
  },
];

export const SEED_SERVICES: Service[] = [
  // AC Repair & Service
  {
    id: 'srv-ac-foam-jet',
    categoryId: 'cat-ac-repair',
    title: 'Foam Jet AC Deep Servicing',
    slug: 'foam-jet-ac-servicing',
    shortDescription: '2X deeper cleaning with high pressure foam jet technology & cooling coil wash',
    fullDescription:
      'Complete AC deep cleaning with patented foam jet technology that removes 99% embedded dirt, debris and bacterial mold. Restores cooling efficiency and lowers electricity bills.',
    basePrice: 599,
    discountedPrice: 499,
    durationMinutes: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    features: [
      'High-pressure jet pump wash for indoor & outdoor units',
      'Advanced anti-bacterial foam cleaning',
      'Gas leak & compressor performance check',
      '30-day post-service warranty',
    ],
    whatsIncluded: [
      'Indoor unit coil deep wash with foam',
      'Outdoor unit pressure cleaning',
      'Filter & drain tray sanitization',
      'Cooling temperature & airflow verification',
    ],
    whatsExcluded: [
      'Gas refill charges (charged extra if needed)',
      'Spare parts replacement',
    ],
    rating: 4.89,
    reviewsCount: 1420,
    isPopular: true,
    isActive: true,
  },
  {
    id: 'srv-ac-gas-refill',
    categoryId: 'cat-ac-repair',
    title: 'AC Gas Leak Repair & Refill',
    slug: 'ac-gas-leak-refill',
    shortDescription: 'Nitrogen testing, leak detection, brazing and 100% genuine refrigerant gas refill',
    fullDescription:
      'Detailed diagnosis for cooling loss, nitrogen leak testing, copper pipe brazing, and complete gas charging for Split or Window ACs.',
    basePrice: 2499,
    discountedPrice: 2199,
    durationMinutes: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    features: [
      'Nitrogen pressure testing for micro leaks',
      'Leak sealing & copper welding',
      'R32 / R410A / R22 genuine gas refill',
      '60-day warranty on gas charging',
    ],
    whatsIncluded: [
      'Leak identification and welding',
      'Complete gas cylinder charge by weight',
      'Post-fill amperage & pressure testing',
    ],
    whatsExcluded: [
      'Replacement of damaged coils or compressors',
    ],
    rating: 4.82,
    reviewsCount: 680,
    isPopular: false,
    isActive: true,
  },
  {
    id: 'srv-ac-install',
    categoryId: 'cat-ac-repair',
    title: 'AC Installation / Uninstallation',
    slug: 'ac-installation',
    shortDescription: 'Standard installation with bracket mounting, piping & vacuum testing',
    fullDescription:
      'Professional installation of Split or Window AC units ensuring perfect leveling, secure outdoor bracket mounting, vacuum pump testing and pipe insulation.',
    basePrice: 1299,
    discountedPrice: 1099,
    durationMinutes: 90,
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    features: [
      'Precision wall drilling & core cutting',
      'Vibration-free heavy outdoor bracket mounting',
      'Vacuum pipe testing to eliminate moisture',
    ],
    whatsIncluded: [
      'Mounting of indoor and outdoor units',
      'Connecting existing copper pipes & drain pipe',
      'Electrical connection testing',
    ],
    whatsExcluded: [
      'Extra copper pipes beyond 3 meters',
      'Outdoor wall bracket (available on purchase)',
    ],
    rating: 4.78,
    reviewsCount: 420,
    isPopular: false,
    isActive: true,
  },

  // Home Cleaning
  {
    id: 'srv-home-deep-cleaning',
    categoryId: 'cat-home-cleaning',
    title: 'Full Home Deep Cleaning (2-3 BHK)',
    slug: 'full-home-deep-cleaning',
    shortDescription: 'Exhaustive 6-hour deep cleaning of rooms, kitchen, washrooms & balcony',
    fullDescription:
      'Transform your home with industrial-grade single disc scrubbing machines, taski chemicals, vacuuming of sofas & mattresses, and deep sanitization of all surfaces.',
    basePrice: 3999,
    discountedPrice: 3499,
    durationMinutes: 240,
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    features: [
      'Single disc mechanized floor scrubbing',
      'Deep stain & grease degreasing in kitchen',
      'Hard water scale removal in all bathrooms',
      '3-person verified professional team',
    ],
    whatsIncluded: [
      'Living room, bedrooms, kitchen & bathrooms',
      'Window glass, tracks, cobwebs & fans cleaning',
      'Cabinet interior & exterior cleaning',
    ],
    whatsExcluded: [
      'Wall washing / paint stain scraping',
      'Cleaning inside locked wardrobes with personal items',
    ],
    rating: 4.92,
    reviewsCount: 2310,
    isPopular: true,
    isActive: true,
  },
  {
    id: 'srv-bathroom-cleaning',
    categoryId: 'cat-home-cleaning',
    title: 'Intense Bathroom Cleaning',
    slug: 'bathroom-deep-cleaning',
    shortDescription: 'Tile scrubbing, hard water stain removal, WC sanitization & tap shining',
    fullDescription:
      'Specialized bathroom scrubbing with eco-friendly Diversey chemicals that eliminate yellow scaling, mildew, tile grime and restore sparkle.',
    basePrice: 599,
    discountedPrice: 499,
    durationMinutes: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    features: [
      'Rotary brush tile and grout scrubbing',
      'Mirror & chrome fittings de-scaling',
      'Toilet bowl & drain sanitization',
    ],
    whatsIncluded: [
      'Wall tiles, floor tiles & grouting',
      'Shower head, taps, washbasin & mirrors',
      'Exhaust fan & geyser wiping',
    ],
    whatsExcluded: [
      'Chipped tile repair or plumbing repairs',
    ],
    rating: 4.88,
    reviewsCount: 1890,
    isPopular: true,
    isActive: true,
  },
  {
    id: 'srv-sofa-cleaning',
    categoryId: 'cat-home-cleaning',
    title: 'Sofa & Upholstery Shampooing',
    slug: 'sofa-shampooing',
    shortDescription: 'Wet shampoo extraction & stain treatment for 3-5 seater sofas & recliners',
    fullDescription:
      'Restore the fresh look and hygiene of fabric or leather sofas with high-suction extraction cleaning and hypoallergenic foaming agents.',
    basePrice: 999,
    discountedPrice: 799,
    durationMinutes: 75,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    features: [
      'Deep dust extraction with German vacuum',
      'Organic foam shampoo application',
      'Moisture extraction leaving sofa 90% dry',
    ],
    whatsIncluded: [
      'Seats, backrests, cushions & armrests',
      'Stain treatment for food & beverage spills',
    ],
    whatsExcluded: [
      'Torn fabric or spring repair',
    ],
    rating: 4.84,
    reviewsCount: 910,
    isPopular: false,
    isActive: true,
  },

  // Electrician
  {
    id: 'srv-fan-switch-repair',
    categoryId: 'cat-electrician',
    title: 'Ceiling Fan & Switchboard Repair',
    slug: 'fan-switch-repair',
    shortDescription: 'Fan regulator change, switch replacement, short-circuit troubleshooting',
    fullDescription:
      'Certified electricians for safe electrical diagnostics, switchboard repair, MCB tripping fixes, and ceiling fan replacement.',
    basePrice: 299,
    discountedPrice: 249,
    durationMinutes: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    features: [
      'Insulated safety tools & multimeter check',
      'Fix socket sparking, burnt wires & regulators',
      '30-day service guarantee',
    ],
    whatsIncluded: [
      'Inspection & labor for replacement of up to 3 points',
      'Testing of earthing & phase voltage',
    ],
    whatsExcluded: [
      'Cost of new switches, fans or MCBs',
    ],
    rating: 4.81,
    reviewsCount: 1140,
    isPopular: true,
    isActive: true,
  },
  {
    id: 'srv-chandelier-light',
    categoryId: 'cat-electrician',
    title: 'Designer Lights & Chandelier Setup',
    slug: 'chandelier-lights-setup',
    shortDescription: 'Pendant lights, ceiling chandeliers, strip LED & track lighting installation',
    fullDescription:
      'Expert hanging and wiring of decorative lights, crystal chandeliers, false ceiling profile lights with neat concealed cabling.',
    basePrice: 699,
    discountedPrice: 599,
    durationMinutes: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    features: [
      'Heavy anchor ceiling fasteners',
      'Neat concealed wiring connections',
      'Dimmer switch compatibility check',
    ],
    whatsIncluded: [
      'Assembly of light fixture & bracket mounting',
      'Testing with power controller',
    ],
    whatsExcluded: [
      'False ceiling cutting if structural modification needed',
    ],
    rating: 4.87,
    reviewsCount: 360,
    isPopular: false,
    isActive: true,
  },

  // Plumbing
  {
    id: 'srv-tap-leak-fix',
    categoryId: 'cat-plumbing',
    title: 'Tap, Mixer & Leakage Repair',
    slug: 'tap-mixer-leakage-repair',
    shortDescription: 'Dripping tap repair, cartridge replacement, pipe joints & diverter fixing',
    fullDescription:
      'Quick and lasting solutions for leaking taps, wall mixers, basin traps, angle valves and dripping pipe joints.',
    basePrice: 299,
    discountedPrice: 249,
    durationMinutes: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    features: [
      'Thread tape sealing & spindle replacement',
      'Fix low water pressure issues',
      'Clean work area after completion',
    ],
    whatsIncluded: [
      'Labor for repair of up to 2 taps or 1 mixer',
      'Diagnosis of pressure imbalance',
    ],
    whatsExcluded: [
      'Cost of replacement fixtures/cartridges',
    ],
    rating: 4.85,
    reviewsCount: 1450,
    isPopular: true,
    isActive: true,
  },
  {
    id: 'srv-toilet-pot-fitting',
    categoryId: 'cat-plumbing',
    title: 'Commode & Flush Tank Repair',
    slug: 'commode-flush-repair',
    shortDescription: 'Continuous flush water flow fix, siphon replacement, jet spray installation',
    fullDescription:
      'Complete repair of internal flush tank fittings, push buttons, float valves, and health faucet/jet spray replacements.',
    basePrice: 449,
    discountedPrice: 399,
    durationMinutes: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    features: [
      'Dual flush siphon calibration',
      'Leak-proof valve seal replacement',
      'Prevents water wastage',
    ],
    whatsIncluded: [
      'Flush mechanism inspection & repair',
      'Jet spray testing & seal fitting',
    ],
    whatsExcluded: [
      'New flush tank unit cost',
    ],
    rating: 4.79,
    reviewsCount: 520,
    isPopular: false,
    isActive: true,
  },

  // Men Salon & Grooming
  {
    id: 'srv-men-haircut-beard',
    categoryId: 'cat-salon-men',
    title: 'Haircut & Royal Beard Styling',
    slug: 'men-haircut-beard',
    shortDescription: 'Custom haircut, beard shaping with razor finish, hot towel & head massage',
    fullDescription:
      'Premium salon experience at your doorstep. Includes trend haircut, beard fading/grooming, hot towel refresh and relaxing 10-min head massage.',
    basePrice: 499,
    discountedPrice: 399,
    durationMinutes: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    features: [
      'Single-use sanitized salon cape & blades',
      'Consultation for face-matched hairstyles',
      'Herbal soothing after-shave lotion',
    ],
    whatsIncluded: [
      'Haircut + Beard trim/shape',
      'Hot towel steam wipe',
      'Head massage with cooling almond oil',
    ],
    whatsExcluded: [
      'Hair color / Hair spa treatment',
    ],
    rating: 4.93,
    reviewsCount: 3100,
    isPopular: true,
    isActive: true,
  },

  // Women Spa & Salon
  {
    id: 'srv-women-glow-facial',
    categoryId: 'cat-salon-women',
    title: 'Instant Glow Facial & Cleanup',
    slug: 'women-glow-facial',
    shortDescription: 'O3+ / Cheryls facial, fruit scrub, blackhead extraction & brightening mask',
    fullDescription:
      'Revitalize your skin with premium branded facial products, deep steam pore cleansing, gentle ultrasonic blackhead removal and relaxing lymphatic facial massage.',
    basePrice: 1499,
    discountedPrice: 1249,
    durationMinutes: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
    features: [
      '100% sealed, single-use mono dose kits',
      'Steam & vacuum pore cleansing',
      'Therapeutic neck & shoulder massage',
    ],
    whatsIncluded: [
      'Cleansing, exfoliating scrub & toner',
      'Hydrating massage cream & glow mask',
      'Sunscreen barrier finish',
    ],
    whatsExcluded: [
      'Chemical peels',
    ],
    rating: 4.91,
    reviewsCount: 2190,
    isPopular: true,
    isActive: true,
  },

  // Appliance Repair
  {
    id: 'srv-washing-machine',
    categoryId: 'cat-appliances',
    title: 'Washing Machine Repair & Checkup',
    slug: 'washing-machine-repair',
    shortDescription: 'Fix spin drum issues, water drainage, noise vibrations & PCB errors',
    fullDescription:
      'Certified technicians for Front Load, Top Load & Semi-Automatic washing machines of all major brands (LG, Samsung, IFB, Bosch, Whirlpool).',
    basePrice: 499,
    discountedPrice: 399,
    durationMinutes: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    features: [
      'Comprehensive electronic PCB testing',
      'Motor & belt tension inspection',
      '90-day spare parts warranty',
    ],
    whatsIncluded: [
      'Complete machine diagnosis & error code scan',
      'Filter and drum scaling check',
    ],
    whatsExcluded: [
      'Cost of replacement components (motor, pump, board)',
    ],
    rating: 4.83,
    reviewsCount: 840,
    isPopular: true,
    isActive: true,
  },
];

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'user-cust-001',
    role: 'customer',
    fullName: 'Rahul Sharma',
    email: 'customer@urban.local',
    phone: '+91 98765 43210',
    avatarUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    bio: 'Tech professional living in Bengaluru',
    city: 'Bengaluru',
    address: 'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103',
    rating: 5.0,
    experienceYears: null,
    isVerified: true,
    isOnline: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-pro-001',
    role: 'professional',
    fullName: 'Vikram Singh',
    email: 'pro@urban.local',
    phone: '+91 91234 56789',
    avatarUrl:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    bio: 'Certified HVAC & Appliance Specialist with 7+ years of experience across top home service platforms.',
    city: 'Bengaluru',
    address: 'Indiranagar 100ft Road, Bengaluru',
    rating: 4.92,
    experienceYears: 7,
    isVerified: true,
    isOnline: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-pro-002',
    role: 'professional',
    fullName: 'Anita Reddy',
    email: 'anita.pro@urban.local',
    phone: '+91 98450 12345',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    bio: 'Licensed beautician and skin specialist with 5+ years of salon experience.',
    city: 'Bengaluru',
    address: 'Koramangala 4th Block, Bengaluru',
    rating: 4.95,
    experienceYears: 5,
    isVerified: true,
    isOnline: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_PROFESSIONAL_SERVICES: ProfessionalService[] = [
  {
    id: 'ps-001',
    professionalId: 'user-pro-001',
    serviceId: 'srv-ac-foam-jet',
    customPrice: 499,
    isAvailable: true,
    experienceNotes: 'Specialized in high-pressure coil deep cleaning and split ACs.',
    completedJobsCount: 142,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ps-002',
    professionalId: 'user-pro-001',
    serviceId: 'srv-ac-gas-refill',
    customPrice: 2199,
    isAvailable: true,
    experienceNotes: 'Equipped with nitrogen detector and manifold gauges.',
    completedJobsCount: 88,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ps-003',
    professionalId: 'user-pro-001',
    serviceId: 'srv-washing-machine',
    customPrice: 399,
    isAvailable: true,
    experienceNotes: 'Certified for IFB, Bosch and Samsung front loaders.',
    completedJobsCount: 65,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ps-004',
    professionalId: 'user-pro-001',
    serviceId: 'srv-fan-switch-repair',
    customPrice: 249,
    isAvailable: true,
    experienceNotes: 'Licensed electrician with complete insulated kit.',
    completedJobsCount: 110,
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    bookingNumber: 'UC-98214',
    customerId: 'user-cust-001',
    professionalId: 'user-pro-001',
    serviceId: 'srv-ac-foam-jet',
    status: 'in_progress',
    scheduledDate:
      new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString().split('T')[0] ??
      '2026-10-15',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    totalPrice: 499,
    customerAddress: 'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103',
    customerPhone: '+91 98765 43210',
    customerNotes: 'Master bedroom split AC cooling is slightly weak. Please inspect thoroughly.',
    paymentStatus: 'pending',
    paymentMethod: 'cash_after_service',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bk-002',
    bookingNumber: 'UC-97430',
    customerId: 'user-cust-001',
    professionalId: 'user-pro-001',
    serviceId: 'srv-home-deep-cleaning',
    status: 'accepted',
    scheduledDate:
      new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString().split('T')[0] ??
      '2026-10-16',
    scheduledTimeSlot: '02:00 PM - 04:00 PM',
    totalPrice: 3499,
    customerAddress: 'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103',
    customerPhone: '+91 98765 43210',
    customerNotes: 'Require 3 BHK deep clean before housewarming.',
    paymentStatus: 'pending',
    paymentMethod: 'upi',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bk-003',
    bookingNumber: 'UC-95112',
    customerId: 'user-cust-001',
    professionalId: null,
    serviceId: 'srv-tap-leak-fix',
    status: 'pending',
    scheduledDate:
      new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().split('T')[0] ??
      '2026-10-17',
    scheduledTimeSlot: '04:00 PM - 06:00 PM',
    totalPrice: 249,
    customerAddress: 'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103',
    customerPhone: '+91 98765 43210',
    customerNotes: 'Kitchen sink tap is constantly leaking at the spindle.',
    paymentStatus: 'pending',
    paymentMethod: 'cash_after_service',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bk-004',
    bookingNumber: 'UC-92301',
    customerId: 'user-cust-001',
    professionalId: 'user-pro-001',
    serviceId: 'srv-men-haircut-beard',
    status: 'completed',
    scheduledDate:
      new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString().split('T')[0] ??
      '2026-10-12',
    scheduledTimeSlot: '06:00 PM - 08:00 PM',
    totalPrice: 399,
    customerAddress: 'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103',
    customerPhone: '+91 98765 43210',
    rating: 5,
    reviewText: 'Punctual, super clean setup, and great haircut styling! Will book again.',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
  },
];

export const SEED_PROFILES = DEMO_PROFILES;

