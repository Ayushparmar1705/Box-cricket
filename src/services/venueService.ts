import AsyncStorage from '@react-native-async-storage/async-storage';
import LIVE_URL from '../../Api';

export interface Venue {
  id: number | string;
  name: string;
  venue_name?: string;
  address: string;
  city?: string | number;
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
  is_active?: boolean;
}

const baseUrl =
  (LIVE_URL as any)?.venue_service ||
  'https://backend-facility-service.onrender.com';

export const fetchVenues = async (search: string = ''): Promise<Venue[]> => {
  try {
    const trimmed = search.trim();
    const searchParam = trimmed ? `&search=${encodeURIComponent(trimmed)}` : '';
    const url = `${baseUrl}/api/venues?status=true${searchParam}`;

    const token =
      (await AsyncStorage.getItem('token')) ||
      (await AsyncStorage.getItem('authToken'));

    console.log(token);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    const result = await response.json();

    const list = Array.isArray(result) ? result : result?.data || [];
    return list;
  } catch (err) {
    console.error('fetchVenues error:', err);
    return [];
  }
};

export default fetchVenues;
