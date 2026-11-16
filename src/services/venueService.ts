import LIVE_URL from '../../Api';
import { clearAuthData, getValidToken } from '../utils/auth';

export interface PricingRule {
  id: number;
  court_id: number;
  day_type: string;
  price: number;
  valid_from?: string | null;
  valid_to?: string | null;
  is_active?: boolean;
}

export interface CourtImage {
  id: number;
  court_id: number;
  image_url: string;
}

export interface Court {
  id: number;
  venue_id: number;
  venue_name?: string;
  category_id?: number;
  court_name: string;
  surface_type?: string;
  max_players?: number;
  description?: string;
  is_active?: boolean;
  images?: CourtImage[];
  image_urls?: string[];
  pricing_rules?: PricingRule[];
  min_price?: number;
  max_price?: number;
}

export interface Venue {
  id: number | string;
  name: string;
  venue_name?: string;
  address: string;
  city?: string | number;
  city_id?: string | number;
  description: string;
  imageUrl?: string;
  rating?: number;
  pricePerHour?: number;
  opening_time?: string;
  closing_time?: string;
  venue_amenities?: string[];
  amenities?: string[];
  contact_number?: string;
  phone_number?: string;
  email?: string;
  google_map_link?: string;
  cancellation_policy?: string;
  is_active?: boolean;
  courts?: Court[];
  total_courts?: number;
  owner_id?: number;
}
export interface Category {
  category_name: string,

}
const baseUrl =
  (LIVE_URL as any)?.venue_service ||
  'https://backend-facility-service.onrender.com';

export const fetchVenues = async (search: string = ''): Promise<Venue[]> => {
  try {
    const trimmed = search.trim();
    const searchParam = trimmed ? `&search=${encodeURIComponent(trimmed)}` : '';
    const url = `${baseUrl}/api/venues?status=true${searchParam}`;

    const token = await getValidToken();

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });

    if (response.status === 401) {
      await clearAuthData();
      return [];
    }

    const result = await response.json();
    const list = Array.isArray(result) ? result : result?.data || [];
    return list;
  } catch (err) {
    console.error('fetchVenues error:', err);
    return [];
  }
};

export const fetchDescription = async (
  id: number | string
): Promise<Venue | null> => {
  try {
    const url = `${baseUrl}/api/venues/${id}`;
    const token = await getValidToken();

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });

    if (response.status === 401) {
      await clearAuthData();
      return null;
    }

    const result = await response.json();
    const venue = result?.data || result;
    return venue;
  } catch (err) {
    console.error('fetchDescription error:', err);
    return null;
  }
};




export const fetchCategory = async () => {
  try {
    const data = await fetch(LIVE_URL.category_service + "/api/category");
    const response = await data.json();
    return response;

  } catch (err) {
    console.log(err);
  }
}

export const fetchVenue = async () => {
  try {
    const data = await fetch(LIVE_URL.venue_service + "/api/venues");
    const response = await data.json();
    return response.data;
  } catch (err) {
    console.log(err)
  }
}

export const venueDescription = async (id: number | string) => {
  try {
    const token = await getValidToken();

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const data = await fetch(LIVE_URL.venue_service + `/api/venues/${id}`, {
      headers,
    });
    const result = await data.json();
    return result.data;
  } catch (err) {
    console.log(err);
  }
}