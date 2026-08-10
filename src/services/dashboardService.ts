import type { BookingOverviewData, DashboardMetrics, RevenueDataPoint, VenuePerformance } from '../types/dashboard';
import type { Booking } from '../types/booking';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        total_revenue: { value: 124500, trend: 12.5 },
        total_bookings: { total: 450, completed: 320, upcoming: 115, cancelled: 15 },
        venues: { total: 3, active: 2, inactive: 1 },
        courts: { total: 8, active: 7, inactive: 1 },
        occupancy_rate: { value: 74.5, trend: 4.2 }
      }), 600);
    });
  },
  
  getRevenueOverview: async (): Promise<RevenueDataPoint[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { date: 'Jan', revenue: 45000 },
        { date: 'Feb', revenue: 52000 },
        { date: 'Mar', revenue: 48000 },
        { date: 'Apr', revenue: 61000 },
        { date: 'May', revenue: 59000 },
        { date: 'Jun', revenue: 75000 },
      ]), 500);
    });
  },

  getBookingOverview: async (): Promise<BookingOverviewData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { name: 'Mon', Completed: 12, Cancelled: 1, Upcoming: 4 },
        { name: 'Tue', Completed: 15, Cancelled: 0, Upcoming: 5 },
        { name: 'Wed', Completed: 18, Cancelled: 2, Upcoming: 6 },
        { name: 'Thu', Completed: 22, Cancelled: 1, Upcoming: 10 },
        { name: 'Fri', Completed: 35, Cancelled: 3, Upcoming: 15 },
        { name: 'Sat', Completed: 45, Cancelled: 2, Upcoming: 20 },
        { name: 'Sun', Completed: 48, Cancelled: 4, Upcoming: 25 },
      ]), 500);
    });
  },

  getVenuePerformance: async (): Promise<VenuePerformance[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { venue_name: 'Premium Box Cricket Andheri', bookings: 210, revenue: 75000, occupancy: 85, status: 'ACTIVE' },
        { venue_name: 'Bandra Turf Arena', bookings: 160, revenue: 49500, occupancy: 70, status: 'ACTIVE' },
        { venue_name: 'Juhu Beach Side Nets', bookings: 0, revenue: 0, occupancy: 0, status: 'INACTIVE' },
      ]), 500);
    });
  },

  getRecentBookings: async (): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        {
          id: 'BKG-001',
          user_id: 'u1',
          venue_id: '1',
          court_id: 'c1',
          customer_name: 'Rahul Sharma',
          venue_name: 'Premium Box Cricket',
          court_name: 'Court A',
          booking_date: new Date().toISOString().split('T')[0],
          start_time: '18:00:00',
          end_time: '19:00:00',
          amount: 1200,
          payment_status: 'PAID',
          booking_status: 'CONFIRMED',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'BKG-002',
          user_id: 'u2',
          venue_id: '2',
          court_id: 'c3',
          customer_name: 'Amit Patel',
          venue_name: 'Bandra Turf Arena',
          court_name: 'Turf 1',
          booking_date: new Date().toISOString().split('T')[0],
          start_time: '19:00:00',
          end_time: '20:30:00',
          amount: 1800,
          payment_status: 'PAID',
          booking_status: 'COMPLETED',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'BKG-003',
          user_id: 'u3',
          venue_id: '1',
          court_id: 'c2',
          customer_name: 'Vikram Singh',
          venue_name: 'Premium Box Cricket',
          court_name: 'Court B',
          booking_date: new Date().toISOString().split('T')[0],
          start_time: '20:00:00',
          end_time: '21:00:00',
          amount: 1000,
          payment_status: 'UNPAID',
          booking_status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'BKG-004',
          user_id: 'u4',
          venue_id: '2',
          court_id: 'c4',
          customer_name: 'Sneha Rao',
          venue_name: 'Bandra Turf Arena',
          court_name: 'Turf 2',
          booking_date: new Date().toISOString().split('T')[0],
          start_time: '21:00:00',
          end_time: '22:00:00',
          amount: 1200,
          payment_status: 'REFUNDED',
          booking_status: 'CANCELLED',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]), 500);
    });
  }
};
