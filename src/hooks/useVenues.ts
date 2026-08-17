import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { venueService } from '../services/venueService';
import type { Venue } from '../types/venue';

export const useVenues = (ownerId?: string | number) => {
  return useQuery({
    queryKey: ['venues', ownerId || 'default'],
    queryFn: () => venueService.getVenues(ownerId),
  });
};


export const useVenue = (id: string) => {
  return useQuery({
    queryKey: ['venues', id],
    queryFn: () => venueService.getVenueById(id),
    enabled: !!id,
  });
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Venue>) => venueService.createVenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
};

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Venue> }) => venueService.updateVenue(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venues', variables.id] });
    },
  });
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => venueService.deleteVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
};
