import type {
  User,
  OwnerRequest,
  OwnerDocument,
  City,
  Category,
  Amenity,
  Venue,
  VenueImage,
  Court,
  PricingRule,
  Slot,
  Booking,
  Payment,
  Coupon,
  Staff,
  AuditLog,
} from '../types/schema.types';

// Table 1: users
export const MOCK_USERS: User[] = [
  {
    id: 'u-101',
    fullName: 'Rajesh Sharma (Super Admin)',
    email: 'admin@boxcricket.app',
    phone: '+91 98201 11000',
    role: 'SUPER_ADMIN',
    emailVerified: true,
    phoneVerified: true,
    isActive: true,
    lastLogin: '2026-07-24T17:30:00Z',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'u-102',
    fullName: 'Aniket Varma',
    email: 'aniket@pitchperfect.com',
    phone: '+91 98765 43210',
    role: 'OWNER',
    emailVerified: true,
    phoneVerified: true,
    isActive: true,
    lastLogin: '2026-07-24T16:00:00Z',
    createdAt: '2025-03-15T00:00:00Z',
  },
  {
    id: 'u-103',
    fullName: 'Vikramaditya Rao',
    email: 'vikram@strikezone.com',
    phone: '+91 97112 88201',
    role: 'OWNER',
    emailVerified: true,
    phoneVerified: true,
    isActive: true,
    lastLogin: '2026-07-24T15:20:00Z',
    createdAt: '2025-04-10T00:00:00Z',
  },
  {
    id: 'u-104',
    fullName: 'Siddharth Patel',
    email: 'siddharth@gmail.com',
    phone: '+91 99001 55432',
    role: 'PLAYER',
    emailVerified: true,
    phoneVerified: true,
    isActive: true,
    lastLogin: '2026-07-24T18:00:00Z',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'u-105',
    fullName: 'Karan Malhotra',
    email: 'karan@groundzero.in',
    phone: '+91 98334 11200',
    role: 'OWNER',
    emailVerified: true,
    phoneVerified: false,
    isActive: true,
    lastLogin: '2026-07-23T10:15:00Z',
    createdAt: '2026-07-23T10:00:00Z',
  },
];

// Table 2: owner_requests
export const MOCK_OWNER_REQUESTS: OwnerRequest[] = [
  {
    id: 'req-201',
    userId: 'u-105',
    userName: 'Karan Malhotra',
    userEmail: 'karan@groundzero.in',
    businessName: 'GroundZero Box Cricket Arena',
    businessType: 'Partnership Firm',
    gstNumber: '27AAAAA0000A1Z5',
    status: 'PENDING',
    createdAt: '2026-07-23T10:15:00Z',
    documentsCount: 3,
  },
  {
    id: 'req-202',
    userId: 'u-106',
    userName: 'Priya Sundaram',
    userEmail: 'priya@chennaiturf.com',
    businessName: 'Chennai Super Sixes Sports Hub',
    businessType: 'Sole Proprietorship',
    gstNumber: '33BBBCC1111B1Z2',
    status: 'PENDING',
    createdAt: '2026-07-24T09:00:00Z',
    documentsCount: 4,
  },
  {
    id: 'req-203',
    userId: 'u-102',
    userName: 'Aniket Varma',
    userEmail: 'aniket@pitchperfect.com',
    businessName: 'Pitch Perfect Turf Pvt Ltd',
    businessType: 'Private Limited',
    gstNumber: '27ABCDE1234F1Z8',
    status: 'APPROVED',
    approvedBy: 'Rajesh Sharma',
    approvedAt: '2025-03-16T12:00:00Z',
    createdAt: '2025-03-15T00:00:00Z',
    documentsCount: 4,
  },
];

// Table 3: owner_documents
export const MOCK_OWNER_DOCUMENTS: OwnerDocument[] = [
  { id: 'doc-1', ownerRequestId: 'req-201', documentType: 'GST', documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop', verificationStatus: 'PENDING', uploadedAt: '2026-07-23T10:20:00Z' },
  { id: 'doc-2', ownerRequestId: 'req-201', documentType: 'PAN', documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop', verificationStatus: 'VERIFIED', uploadedAt: '2026-07-23T10:21:00Z' },
  { id: 'doc-3', ownerRequestId: 'req-201', documentType: 'AADHAR', documentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop', verificationStatus: 'VERIFIED', uploadedAt: '2026-07-23T10:22:00Z' },
];

// Table 4: cities
export const MOCK_CITIES: City[] = [
  { id: 'c-1', cityName: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.076, longitude: 72.877, isActive: true, venueCount: 8 },
  { id: 'c-2', cityName: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.971, longitude: 77.594, isActive: true, venueCount: 5 },
  { id: 'c-3', cityName: 'Delhi NCR', state: 'Delhi', country: 'India', latitude: 28.613, longitude: 77.209, isActive: true, venueCount: 3 },
  { id: 'c-4', cityName: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.385, longitude: 78.486, isActive: true, venueCount: 2 },
  { id: 'c-5', cityName: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 13.082, longitude: 80.27, isActive: true, venueCount: 4 },
];

// Table 5: categories
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', categoryName: 'Box Cricket', icon: '🏏', isActive: true },
  { id: 'cat-2', categoryName: 'Futsal / Football', icon: '⚽', isActive: true },
  { id: 'cat-3', categoryName: 'Pickleball', icon: '🏓', isActive: true },
  { id: 'cat-4', categoryName: 'Badminton', icon: '🏸', isActive: true },
];

// Table 6: amenities
export const MOCK_AMENITIES: Amenity[] = [
  { id: 'am-1', amenityName: 'Floodlights (1000 Lux)' },
  { id: 'am-2', amenityName: 'Free Parking Lot' },
  { id: 'am-3', amenityName: 'AC Dressing Rooms' },
  { id: 'am-4', amenityName: 'Cafeteria & Juice Bar' },
  { id: 'am-5', amenityName: 'Chilled RO Drinking Water' },
  { id: 'am-6', amenityName: 'Digital Scoreboard' },
];

// Table 7: venues
export const MOCK_VENUES: Venue[] = [
  {
    id: 'v-301',
    ownerId: 'u-102',
    ownerName: 'Aniket Varma',
    cityId: 'c-1',
    cityName: 'Mumbai',
    venueName: 'Pitch Perfect Box Cricket Arena',
    description: 'Premier 12mm FIFA artificial turf with international floodlights and lounge area.',
    address: 'Plot 45, Veera Desai Road, Andheri West, Mumbai',
    latitude: 19.135,
    longitude: 72.836,
    googleMapLink: 'https://maps.google.com',
    contactNumber: '+91 98201 44510',
    email: 'info@pitchperfect.com',
    openingTime: '06:00:00',
    closingTime: '23:59:00',
    cancellationPolicy: 'Full refund if cancelled 4 hours prior to slot time.',
    status: 'ACTIVE',
    averageRating: 4.9,
    totalReviews: 128,
    isActive: true,
    createdAt: '2025-03-16T00:00:00Z',
    amenityNames: ['Floodlights (1000 Lux)', 'Free Parking Lot', 'AC Dressing Rooms', 'Cafeteria & Juice Bar'],
  },
  {
    id: 'v-302',
    ownerId: 'u-103',
    ownerName: 'Vikramaditya Rao',
    cityId: 'c-2',
    cityName: 'Bengaluru',
    venueName: 'Strike Zone Floodlight Turf',
    description: 'High-density multi-sport indoor turf with high safety side nets.',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
    latitude: 12.935,
    longitude: 77.624,
    googleMapLink: 'https://maps.google.com',
    contactNumber: '+91 97112 88201',
    email: 'support@strikezone.com',
    openingTime: '05:00:00',
    closingTime: '23:00:00',
    cancellationPolicy: '50% refund on cancellation within 6 hours.',
    status: 'ACTIVE',
    averageRating: 4.8,
    totalReviews: 94,
    isActive: true,
    createdAt: '2025-04-12T00:00:00Z',
    amenityNames: ['Floodlights (1000 Lux)', 'Free Parking Lot', 'Chilled RO Drinking Water'],
  },
  {
    id: 'v-303',
    ownerId: 'u-103',
    ownerName: 'Vikramaditya Rao',
    cityId: 'c-4',
    cityName: 'Hyderabad',
    venueName: 'Thunderbolt Box Cricket Arena B',
    description: 'Indoor box turf with pro-grade turf mat and LED surround light towers.',
    address: 'Near Bio-Diversity Park, Gachibowli, Hyderabad',
    latitude: 17.44,
    longitude: 78.348,
    googleMapLink: 'https://maps.google.com',
    contactNumber: '+91 98450 12390',
    email: 'hyderabad@thunderbolt.in',
    openingTime: '06:00:00',
    closingTime: '23:00:00',
    cancellationPolicy: 'No refunds allowed within 2 hours of slot.',
    status: 'BLOCKED',
    averageRating: 4.5,
    totalReviews: 42,
    isActive: false,
    createdAt: '2025-05-01T00:00:00Z',
    amenityNames: ['Floodlights (1000 Lux)', 'Digital Scoreboard'],
  },
];

// Table 8: venue_images
export const MOCK_VENUE_IMAGES: VenueImage[] = [
  { id: 'img-1', venueId: 'v-301', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop', isCover: true },
  { id: 'img-2', venueId: 'v-301', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop', isCover: false },
  { id: 'img-3', venueId: 'v-302', imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop', isCover: true },
];

// Table 10: courts
export const MOCK_COURTS: Court[] = [
  {
    id: 'crt-401',
    venueId: 'v-301',
    venueName: 'Pitch Perfect Box Cricket Arena',
    categoryId: 'cat-1',
    categoryName: 'Box Cricket',
    courtName: 'Court A (Main Stadium Turf)',
    surfaceType: 'TURF',
    maxPlayers: 16,
    description: 'Main competition turf with electronic scoreboard.',
    isActive: true,
    pricePerHour: 1400,
  },
  {
    id: 'crt-402',
    venueId: 'v-301',
    venueName: 'Pitch Perfect Box Cricket Arena',
    categoryId: 'cat-1',
    categoryName: 'Box Cricket',
    courtName: 'Court B (Practice Box)',
    surfaceType: 'MAT',
    maxPlayers: 12,
    description: 'Standard practice turf for 6v6 matches.',
    isActive: true,
    pricePerHour: 1100,
  },
  {
    id: 'crt-403',
    venueId: 'v-302',
    venueName: 'Strike Zone Floodlight Turf',
    categoryId: 'cat-1',
    categoryName: 'Box Cricket',
    courtName: 'Stadium Turf 1',
    surfaceType: 'TURF',
    maxPlayers: 18,
    description: 'Premium floodlit turf with boundary nets.',
    isActive: true,
    pricePerHour: 1600,
  },
];

// Table 12: pricing_rules
export const MOCK_PRICING_RULES: PricingRule[] = [
  { id: 'pr-1', courtId: 'crt-401', courtName: 'Court A (Main Stadium Turf)', dayType: 'WEEKDAY', startTime: '06:00', endTime: '18:00', price: 1200, validFrom: '2026-01-01', validTo: '2026-12-31' },
  { id: 'pr-2', courtId: 'crt-401', courtName: 'Court A (Main Stadium Turf)', dayType: 'WEEKEND', startTime: '18:00', endTime: '23:59', price: 1600, validFrom: '2026-01-01', validTo: '2026-12-31' },
];

// Table 13: slots
export const MOCK_SLOTS: Slot[] = [
  { id: 's-1', courtId: 'crt-401', courtName: 'Court A', slotDate: '2026-07-24', startTime: '18:00', endTime: '19:00', status: 'BOOKED', price: 1400 },
  { id: 's-2', courtId: 'crt-401', courtName: 'Court A', slotDate: '2026-07-24', startTime: '19:00', endTime: '20:00', status: 'BOOKED', price: 1400 },
  { id: 's-3', courtId: 'crt-401', courtName: 'Court A', slotDate: '2026-07-24', startTime: '20:00', endTime: '21:00', status: 'LOCKED', lockedBy: 'u-104', lockedUntil: '2026-07-24T18:50:00Z', price: 1400 },
  { id: 's-4', courtId: 'crt-401', courtName: 'Court A', slotDate: '2026-07-24', startTime: '21:00', endTime: '22:00', status: 'AVAILABLE', price: 1400 },
];

// Table 14: bookings
export const MOCK_BOOKINGS: Booking[] = [
  { id: 'bk-501', bookingReference: 'BC-2026-8901', playerId: 'u-104', playerName: 'Siddharth Patel', playerPhone: '+91 99001 55432', venueId: 'v-301', venueName: 'Pitch Perfect Box Cricket Arena', courtId: 'crt-401', courtName: 'Court A (Main Stadium Turf)', slotDate: '2026-07-24', slotTimes: ['18:00-19:00', '19:00-20:00'], subtotal: 2800, discountAmount: 300, taxAmount: 225, convenienceFee: 50, totalAmount: 2775, bookingStatus: 'CONFIRMED', paymentStatus: 'SUCCESS', refundStatus: 'NOT_REQUIRED', paymentMethod: 'UPI (GPay)', createdAt: '2026-07-24T14:30:00Z' },
  { id: 'bk-502', bookingReference: 'BC-2026-8902', playerId: 'u-107', playerName: 'Rohan Deshmukh', playerPhone: '+91 98902 33411', venueId: 'v-302', venueName: 'Strike Zone Floodlight Turf', courtId: 'crt-403', courtName: 'Stadium Turf 1', slotDate: '2026-07-24', slotTimes: ['21:00-22:00'], subtotal: 1600, discountAmount: 0, taxAmount: 144, convenienceFee: 30, totalAmount: 1774, bookingStatus: 'PENDING', paymentStatus: 'PENDING', refundStatus: 'NOT_REQUIRED', paymentMethod: 'Cash on Ground', createdAt: '2026-07-24T16:45:00Z' },
];

// Table 16: payments
export const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay-601', bookingId: 'bk-501', bookingRef: 'BC-2026-8901', transactionId: 'pay_NzX9021KmA', paymentGateway: 'RAZORPAY', paymentMethod: 'UPI (GPay)', amount: 2775, paymentStatus: 'SUCCESS', paidAt: '2026-07-24T14:31:12Z' },
];

// Table 17: coupons
export const MOCK_COUPONS: Coupon[] = [
  { id: 'coup-701', couponCode: 'CRICKET50', discountType: 'PERCENTAGE', discountValue: 15, minimumAmount: 1000, usageLimit: 500, expiryDate: '2026-12-31', isActive: true },
];

// Table 21: staff
export const MOCK_STAFF: Staff[] = [
  { id: 'stf-801', userId: 'u-110', userName: 'Mahesh Patil', ownerId: 'u-102', ownerName: 'Aniket Varma', venueId: 'v-301', venueName: 'Pitch Perfect Box Cricket Arena', designation: 'MANAGER', permissions: ['CAN_CANCEL_BOOKING', 'CAN_BLOCK_SLOT', 'CAN_VIEW_PAYMENTS'], isActive: true },
];

// Table 24: audit_logs
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-901', userId: 'u-101', userName: 'Rajesh Sharma', action: 'APPROVED_OWNER_REQUEST', tableName: 'owner_requests', recordId: 'req-203', ipAddress: '103.45.12.98', createdAt: '2026-07-24T17:10:00Z' },
];
