import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardService.getMetrics,
  });
};

export const useRevenueOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'revenue-overview'],
    queryFn: dashboardService.getRevenueOverview,
  });
};

export const useBookingOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'booking-overview'],
    queryFn: dashboardService.getBookingOverview,
  });
};

export const useVenuePerformance = () => {
  return useQuery({
    queryKey: ['dashboard', 'venue-performance'],
    queryFn: dashboardService.getVenuePerformance,
  });
};

export const useRecentBookings = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-bookings'],
    queryFn: dashboardService.getRecentBookings,
  });
};
