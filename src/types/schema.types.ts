// ══════════════════════════════════════════════════════════════════════════════
// BOX CRICKET BOOKING SYSTEM — COMPLETE DATABASE TYPES (Schema Version 2.0)
// ══════════════════════════════════════════════════════════════════════════════

export type Role = 'SUPER_ADMIN' | 'OWNER' | 'PLAYER' | 'STAFF';

// Table 1: users
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  profileImage?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export type OwnerRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Table 2: owner_requests
export interface OwnerRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessName: string;
  businessType: string;
  gstNumber: string;
  status: OwnerRequestStatus;
  adminRemark?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  documentsCount: number;
}

// Table 3: owner_documents
export interface OwnerDocument {
  id: string;
  ownerRequestId: string;
  documentType: 'AADHAR' | 'PAN' | 'GST' | 'SHOP_LICENSE' | 'OTHER';
  documentUrl: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
}

// Table 4: cities
export interface City {
  id: string;
  cityName: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  venueCount: number;
}

// Table 5: categories
export interface Category {
  id: string;
  categoryName: string;
  icon: string;
  isActive: boolean;
}

// Table 6: amenities
export interface Amenity {
  id: string;
  amenityName: string;
}

export type VenueStatus = 'PENDING' | 'ACTIVE' | 'BLOCKED';

// Table 7: venues
export interface Venue {
  id: string;
  ownerId: string;
  ownerName: string;
  cityId: string;
  cityName: string;
  venueName: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapLink: string;
  contactNumber: string;
  email: string;
  openingTime: string;
  closingTime: string;
  cancellationPolicy: string;
  status: VenueStatus;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  amenityNames: string[];
}

// Table 8: venue_images
export interface VenueImage {
  id: string;
  venueId: string;
  imageUrl: string;
  isCover: boolean;
}

export type SurfaceType = 'TURF' | 'MAT' | 'CONCRETE';

// Table 10: courts
export interface Court {
  id: string;
  venueId: string;
  venueName: string;
  categoryId: string;
  categoryName: string;
  courtName: string;
  surfaceType: SurfaceType;
  maxPlayers: number;
  description: string;
  isActive: boolean;
  pricePerHour: number;
}

// Table 12: pricing_rules
export interface PricingRule {
  id: string;
  courtId: string;
  courtName: string;
  dayType: 'WEEKDAY' | 'WEEKEND' | 'HOLIDAY';
  startTime: string;
  endTime: string;
  price: number;
  validFrom: string;
  validTo: string;
}

export type SlotStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED' | 'BLOCKED';

// Table 13: slots
export interface Slot {
  id: string;
  courtId: string;
  courtName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  lockedBy?: string;
  lockedUntil?: string;
  price: number;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// Table 14: bookings
export interface Booking {
  id: string;
  bookingReference: string;
  playerId: string;
  playerName: string;
  playerPhone: string;
  venueId: string;
  venueName: string;
  courtId: string;
  courtName: string;
  slotDate: string;
  slotTimes: string[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  convenienceFee: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  refundStatus: 'NOT_REQUIRED' | 'PENDING' | 'COMPLETED';
  paymentMethod: string;
  createdAt: string;
}

// Table 16: payments
export interface Payment {
  id: string;
  bookingId: string;
  bookingRef: string;
  transactionId: string;
  paymentGateway: 'RAZORPAY' | 'STRIPE' | 'PAYTM' | 'CASH';
  paymentMethod: string;
  amount: number;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paidAt: string;
}

// Table 17: coupons
export interface Coupon {
  id: string;
  couponCode: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumAmount: number;
  usageLimit: number;
  expiryDate: string;
  isActive: boolean;
}

// Table 21: staff
export interface Staff {
  id: string;
  userId: string;
  userName: string;
  ownerId: string;
  ownerName: string;
  venueId?: string;
  venueName?: string;
  designation: 'MANAGER' | 'RECEPTIONIST' | 'GROUND_STAFF';
  permissions: string[];
  isActive: boolean;
}

// Table 24: audit_logs
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  tableName: string;
  recordId: string;
  ipAddress: string;
  createdAt: string;
}
