export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type PaymentStatus = 'PAID' | 'UNPAID' | 'REFUNDED' | 'PARTIAL';

export interface Booking {
  id: string | number;
  user_id: string | number;
  venue_id: string | number;
  court_id: string | number;
  customer_name: string;
  venue_name: string;
  court_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  created_at: string;
  updated_at: string;
}
