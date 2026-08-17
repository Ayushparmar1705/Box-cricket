import type { Venue } from '../types/venue';
import Api from '../Api';

const getStoredUserId = (): number | string | undefined => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      return userData?.user?.id || userData?.data?.user?.id || userData?.data?.id || userData?.id;
    } catch (e) {
      console.error('Error parsing user data from localStorage', e);
    }
  }
  return undefined;
};

const mapVenueData = (v: any): Venue => ({
  ...v,
  id: v.id,
  owner_id: v.ownerId || v.owner_id,
  city_id: v.cityId || v.city_id,
  venue_name: v.venueName || v.venue_name,
  description: v.description,
  address: v.address,
  latitude: v.latitude,
  longitude: v.longitude,
  google_map_link: v.googleMapLink || v.google_map_link,
  contact_number: v.contactNumber || v.contact_number,
  email: v.email,
  opening_time: v.openingTime || v.opening_time,
  closing_time: v.closingTime || v.closing_time,
  cancellation_policy: v.cancellationPolicy || v.cancellation_policy,
  status: v.status,
  average_rating: Number(v.averageRating || v.average_rating || 0),
  total_reviews: Number(v.totalReviews || v.total_reviews || 0),
  is_active: v.isActive !== undefined ? v.isActive : v.is_active,
  created_at: v.createdAt || v.created_at,
  updated_at: v.updatedAt || v.updated_at,
  cover_image: v.images?.find((img: any) => img.isCover)?.imageUrl || v.images?.[0]?.imageUrl || v.cover_image,
  images: v.images?.map((img: any) => img.imageUrl) || [],
  amenities: Array.isArray(v.venueAmenities) ? v.venueAmenities : (typeof v.venueAmenities === 'string' ? JSON.parse(v.venueAmenities || '[]') : [])
});

export const venueService = {
  getVenuesByOwnerId: async (ownerId: number | string): Promise<Venue[]> => {
    try {
      const response = await fetch(Api.getVenuesByOwnerId(ownerId));
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch venues');
      }
      const result = await response.json();
      const rawVenues = Array.isArray(result.data) ? result.data : [];
      return rawVenues.map(mapVenueData);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch venues');
    }
  },

  getVenues: async (ownerId?: number | string): Promise<Venue[]> => {
    const targetOwnerId = ownerId || getStoredUserId();
    if (targetOwnerId) {
      return venueService.getVenuesByOwnerId(targetOwnerId);
    }
    return [];
  },

  getVenueById: async (id: string | number): Promise<Venue> => {
    try {
      const venues = await venueService.getVenues();
      const venue = venues.find(v => String(v.id) === String(id));
      if (venue) return venue;
      throw new Error('Venue not found');
    } catch (error: any) {
      throw new Error(error.message || 'Venue not found');
    }
  },

  createVenue: async (data: Partial<Venue> & Record<string, any>): Promise<Venue> => {
    try {
      const ownerId = getStoredUserId() || 1;
      const payload = {
        venueName: data.venue_name || data.venueName,
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        cityId: data.city_id || data.cityId,
        contactNumber: data.contact_number || data.contactNumber,
        email: data.email,
        openingTime: data.opening_time || data.openingTime,
        closingTime: data.closing_time || data.closingTime,
        venueAmenities: data.Venue_amenities || data.venueAmenities,
        cancellationPolicy: data.cancellation_policy || data.cancellationPolicy,
        ownerId: ownerId
      };

      const response = await fetch(Api.addVenue, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create venue');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create venue');
    }
  },

  updateVenue: async (id: string | number, data: Partial<Venue>): Promise<Venue> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...data, id } as Venue);
      }, 500);
    });
  },

  deleteVenue: async (id: string | number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
};

