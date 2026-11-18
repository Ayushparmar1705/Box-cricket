import LIVE_URL from '../../Api';
import { getValidToken } from '../utils/auth';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

// -------------------------------------------------------------
// 1. DATA TYPES (Simple definitions of what our data looks like)
// -------------------------------------------------------------
export interface BookingItem {
  id?: number;
  bookingid?: number;
  userId: number;
  venueId: number;
  ownerId?: number;
  courtId: number;
  bookingDate: string; // "YYYY-MM-DD" e.g., "2026-11-17"
  startTime: string;   // "HH:mm:ss" e.g., "18:00:00"
  duration: number;    // hours, e.g., 1 or 2
  total: number;       // total price, e.g., 1200
  bookingStatus?: string; // "PENDING", "CONFIRMED", "CANCELLED"
  venueName?: string;
  courtName?: string;
}

// -------------------------------------------------------------
// Helper: Get Base URL for Booking Service (Docker Port 3038)
// -------------------------------------------------------------
const BASE_URL = LIVE_URL.booking_service || 'http://192.168.1.4:3038';

// -------------------------------------------------------------
// 2. HELPER: Format 12-hour time ("06:00 PM") to 24-hour ("18:00:00")
// -------------------------------------------------------------
export const convertTo24HourTime = (time12h: string): string => {
  if (!time12h) return '18:00:00';
  const parts = time12h.trim().split(' ');
  if (parts.length < 2) return time12h; // already 24h

  const [time, period] = parts;
  let [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);

  if (period.toUpperCase() === 'PM' && h < 12) h += 12;
  if (period.toUpperCase() === 'AM' && h === 12) h = 0;

  const hh = String(h).padStart(2, '0');
  const mm = minutes ? minutes.padStart(2, '0') : '00';
  return `${hh}:${mm}:00`;
};

// -------------------------------------------------------------
// 3. HELPER: Format "DD-MM-YYYY" to backend "YYYY-MM-DD"
// -------------------------------------------------------------
export const convertDateToBackendFormat = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const parts = dateStr.split('-');
  // If DD-MM-YYYY, reverse to YYYY-MM-DD
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

// -------------------------------------------------------------
// 4. API CALL: Create a new booking
// -------------------------------------------------------------
export const createBooking = async (bookingData: {
  userId: number;
  venueId: number;
  ownerId?: number;
  courtId: number;
  venueName?: string;
  courtName?: string;
  bookingDate: string; // "YYYY-MM-DD"
  startTime: string;   // "HH:mm:ss"
  duration: number;
  total: number;
}) => {
  try {
    const token = await getValidToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend returned error message (e.g., "Slot already booked")
      throw new Error(data.message || data || 'Failed to create booking');
    }

    return data;
  } catch (error: any) {
    console.error('Error in createBooking:', error.message);
    throw error;
  }
};

// -------------------------------------------------------------
// 5. API CALL: Fetch all bookings for a user
// -------------------------------------------------------------
export const getUserBookings = async (userId: number) => {
  try {
    const token = await getValidToken();
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/api/bookings/user/${userId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to load bookings');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getUserBookings:', error.message);
    return [];
  }
};

// -------------------------------------------------------------
// 6. API CALL: Fetch existing court bookings for a specific date
// -------------------------------------------------------------
export const getCourtBookings = async (courtId: number, date?: string) => {
  try {
    const queryDate = date ? `?date=${date}` : '';
    const response = await fetch(`${BASE_URL}/api/bookings/court/${courtId}${queryDate}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error: any) {
    console.error('Error in getCourtBookings:', error.message);
    return [];
  }
};

// -------------------------------------------------------------
// 7. API CALL: Cancel a booking
// -------------------------------------------------------------
export const cancelBooking = async (
  bookingId: number,
  cancelledBy: number = 1,
  reason: string = 'User cancelled booking'
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/bookings/${bookingId}/cancel?cancelledBy=${cancelledBy}&reason=${encodeURIComponent(
        reason
      )}`,
      { method: 'PUT' }
    );
    return await response.json();
  } catch (error: any) {
    console.error('Error in cancelBooking:', error.message);
    throw error;
  }
};

// -------------------------------------------------------------
// 8. PAYMENT: Create Razorpay Order
// -------------------------------------------------------------
export const createPaymentOrder = async (bookingId: number, amount: number) => {
  try {
    const response = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, amount }),
    });

    return await response.json();
  } catch (error: any) {
    console.error('Error in createPaymentOrder:', error.message);
    throw error;
  }
};

// -------------------------------------------------------------
// 9. PAYMENT: Verify Payment Signature
// -------------------------------------------------------------
export const verifyPayment = async (verificationData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });

    return await response.json();
  } catch (error: any) {
    console.error('Error in verifyPayment:', error.message);
    throw error;
  }
};

// -------------------------------------------------------------
// 10. COMPLETE FLOW: Book Court + Process Payment (Updates Both Tables)
// -------------------------------------------------------------
export const processBookingWithPayment = async (params: {
  userId: number;
  venueId: number;
  ownerId?: number;
  courtId: number;
  venueName?: string;
  courtName?: string;
  bookingDate: string; // "YYYY-MM-DD"
  startTime: string;   // "HH:mm:ss"
  duration: number;
  total: number;
}) => {
  // STEP 1: Insert record into "bookings" table (status = PENDING)
  const savedBooking = await createBooking({
    userId: params.userId,
    venueId: params.venueId,
    ownerId: params.ownerId,
    courtId: params.courtId,
    venueName: params.venueName,
    courtName: params.courtName,
    bookingDate: params.bookingDate,
    startTime: params.startTime,
    duration: params.duration,
    total: params.total,
  });

  const bookingId = savedBooking.id;

  // STEP 2: Insert record into "payments" table (status = PENDING)
  const orderData = await createPaymentOrder(bookingId, params.total);
  const razorpayOrderId = orderData.orderId;

  // STEP 3: SHOW OFFICIAL RAZORPAY PAYMENT SCREEN
  // Uses openAuthSessionAsync with redirectUrl to AUTOMATICALLY close the browser when done!
  const redirectUrl = Linking.createURL('payment-success');
  const checkoutUrl = `${BASE_URL}/api/payments/checkout?bookingId=${bookingId}&orderId=${razorpayOrderId}&amount=${orderData.amount}&keyId=${orderData.keyId}&redirectUrl=${encodeURIComponent(redirectUrl)}`;

  try {
    await WebBrowser.openAuthSessionAsync(checkoutUrl, redirectUrl);
  } catch (err) {
    // Fallback if auth session is cancelled or not supported
    await WebBrowser.openBrowserAsync(checkoutUrl);
  }

  return {
    ...savedBooking,
    id: bookingId,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'SUCCESS',
    orderId: razorpayOrderId,
  };
};

