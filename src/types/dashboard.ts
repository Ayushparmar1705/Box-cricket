export interface DashboardMetrics {
  total_revenue: {
    value: number;
    trend: number; // percentage
  };
  total_bookings: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  };
  venues: {
    total: number;
    active: number;
    inactive: number;
  };
  courts: {
    total: number;
    active: number;
    inactive: number;
  };
  occupancy_rate: {
    value: number;
    trend: number; // percentage
  };
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface BookingOverviewData {
  name: string;
  Completed: number;
  Cancelled: number;
  Upcoming: number;
}

export interface VenuePerformance {
  venue_name: string;
  bookings: number;
  revenue: number;
  occupancy: number; // percentage
  status: 'ACTIVE' | 'INACTIVE';
}
