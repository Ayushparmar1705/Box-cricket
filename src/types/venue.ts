export type VenueStatus = 'PENDING' | 'ACTIVE' | 'BLOCKED';

export interface Venue {
  id: string | number;
  owner_id: string | number;
  city_id: string | number;
  venue_name: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  google_map_link?: string;
  contact_number: string;
  email: string;
  opening_time: string;
  closing_time: string;
  cancellation_policy: string;
  status: VenueStatus;
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // UI Specific helpers
  cover_image?: string;
  images?: string[];
  amenities?: string[];
}
