// ============================================================================
// File: venueService.ts
// Description: Venue API Service for Box Cricket Application
// Written for beginners: Simple, clean, and step-by-step explained code.
// ============================================================================

import baseUrl from '../../api/Api';

// ----------------------------------------------------------------------------
// 1. DATA TYPES (INTERFACES)
// These define the structure (shape) of the data we send and receive.
// ----------------------------------------------------------------------------

/**
 * Data required when an Owner creates or updates a venue.
 * Supports exact requested database fields:
 * - city_id (FK → cities)
 * - venue_name (VARCHAR 150)
 * - description (TEXT)
 * - address (TEXT)
 * - latitude (DECIMAL)
 * - longitude (DECIMAL)
 * - google_map_link (TEXT)
 * - contact_number (VARCHAR)
 * - email (VARCHAR)
 * - opening_time (TIME)
 * - closing_time (TIME)
 * - cancellation_policy (TEXT)
 */
export interface VenuePayload {
  venue_name?: string;           // Exact field: venue_name
  name?: string;                 // Alternate / fallback: name
  city_id?: string | number;     // Exact field: city_id (FK to cities)
  city?: string | number;        // Alternate / fallback: city
  description: string;           // Description
  address?: string;              // Exact field: Street address
  latitude: number;              // Map coordinate: Latitude
  longitude: number;             // Map coordinate: Longitude
  google_map_link: string;       // Google Maps link
  contact_number?: string;       // Exact field: contact_number
  phone_number?: string;         // Alternate / fallback: phone_number
  email: string;                 // Contact email address
  opening_time: string;          // Daily opening time (HH:mm:ss or HH:mm)
  closing_time: string;          // Daily closing time (HH:mm:ss or HH:mm)
  cancellation_policy: string;   // Cancellation policy text
  venue_amenities?: string;      // Comma-separated amenities
  image?: File | null;           // Optional image file uploaded from computer
  imageUrl?: string;             // Optional direct image URL
}

/**
 * Data structure returned by backend for each venue item.
 */
export interface VenueItem {
  id: number;                    // Unique Venue ID
  owner_id: number;              // ID of venue owner
  name: string;                  // Venue name
  venue_name?: string;           // Venue name alias
  city: string | number;         // City ID
  city_id?: string | number;     // City ID alias
  description: string;           // Description
  address?: string;              // Street address
  longitude: number;             // Longitude
  latitude: number;              // Latitude
  google_map_link: string;       // Google Maps link
  phone_number: string;          // Contact phone number
  contact_number?: string;       // Contact phone number alias
  email: string;                 // Email address
  imageUrl?: string;             // Cloudinary image URL
  venue_amenities: string[];     // Array of amenities
  opening_time: string;          // Opening time (HH:mm:ss)
  closing_time: string;          // Closing time (HH:mm:ss)
  cancellation_policy: string;   // Cancellation policy text
  is_active?: boolean;           // Status: true = active, false = deactivated
  created_at?: string;           // Creation timestamp
  updated_at?: string;           // Last update timestamp
}

/**
 * Standard backend response wrapper structure.
 * Example: { status: 200, message: "Success", data: ... }
 */
export interface VenueApiResponse<T = VenueItem> {
  status: number;
  message: string;
  data: T;
}

export const getVenueAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};



export const createVenueApi = async (venueData: VenuePayload): Promise<VenueApiResponse<VenueItem>> => {
  // Direct endpoint: http://localhost:3040/api/venues
  const url = `${baseUrl.venue}/api/venues`;

  // Format times properly (e.g. "06:00" -> "06:00:00")


  // Extract field values
  const venueName = venueData.venue_name || venueData.name || '';
  const cityVal = String(venueData.city_id !== undefined ? venueData.city_id : venueData.city || 1);
  const phoneVal = venueData.contact_number || venueData.phone_number || '';
  const addressVal = venueData.address || '';
  const amenitiesVal = venueData.venue_amenities || 'Floodlights, Synthetic Turf, Changing Room';
  const opening_time = venueData.opening_time;
  const closing_time = venueData.closing_time;

  // Build FormData for Spring Boot @ModelAttribute Venuerequestdto
  const formData = new FormData();
  formData.append('name', venueName);
  formData.append('venue_name', venueName);
  formData.append('city', cityVal);
  formData.append('city_id', cityVal);
  formData.append('description', venueData.description || '');
  formData.append('address', addressVal);
  formData.append('longitude', String(venueData.longitude));
  formData.append('latitude', String(venueData.latitude));
  formData.append('google_map_link', venueData.google_map_link || '');
  formData.append('phone_number', phoneVal);
  formData.append('contact_number', phoneVal);
  formData.append('email', venueData.email || '');
  formData.append('opening_time', opening_time);
  formData.append('closing_time', closing_time);
  formData.append('venue_amenities', amenitiesVal);
  formData.append('cancellation_policy', venueData.cancellation_policy || '');

  // If user selected an image file, attach it
  if (venueData.image && venueData.image instanceof File) {
    formData.append('image', venueData.image);
  }

  // Get Auth headers with Bearer token (true = multipart, browser manages boundary)
  const headers = getVenueAuthHeaders();

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = result.message || 'Failed to create venue';
    throw new Error(errorMsg);
  }

  return result;
};

/**
 * API #2: FETCH VENUES FOR LOGGED-IN OWNER
 * Endpoint: GET http://localhost:3040/api/venues?status=true
 * Gets the list of venues for owner panel. Status defaults to true.
 *
 * @param status - Active status of venues to fetch (defaults to true)
 */
export const fetchMyVenuesApi = async (status: boolean = true): Promise<VenueApiResponse<VenueItem[]>> => {
  const url = `${baseUrl.venue}/api/venues?status=${status}`;
  const headers = getVenueAuthHeaders();

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = result.message || 'Failed to fetch owner venues';
    throw new Error(errorMsg);
  }

  // Handle both direct array and wrapped { status, data: [...] } responses
  if (Array.isArray(result)) {
    return {
      status: response.status,
      message: 'Success',
      data: result,
    };
  }

  return result;
};

/**
 * API #3: FETCH ALL PUBLIC VENUES
 * Endpoint: GET http://localhost:3040/api/venues?status=true
 * Public endpoint to view all available box cricket grounds. Status defaults to true.
 */
export const fetchAllVenuesApi = async (status: boolean = true): Promise<VenueItem[]> => {
  const url = `${baseUrl.venue}/api/venues?status=${status}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const result = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error('Failed to fetch public venues');
  }

  // Ensure an array is returned safely
  if (Array.isArray(result)) {
    return result;
  }
  return result.data || [];
};


export const updateVenueStatusApi = async (
  venueId: number,
  status: boolean
) => {
  // Build API endpoint URL with query parameters
  const url = `${baseUrl.venue}/api/venues?venueid=${venueId}&status=${status}`;

  // Get authentication headers containing owner's Bearer token
  const headers = getVenueAuthHeaders();

  // Send PUT request to facility-service (port 3040)
  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const actionName = status ? 'activate' : 'deactivate';
    const errorMsg = result.message || `Failed to ${actionName} venue`;
    throw new Error(errorMsg);
  }

  return result;
};

export const searchVenueApi = async (search: string) => {
  const url = `${baseUrl.venue}/api/venues/search?search=${encodeURIComponent(search.trim())}`;
  const headers = getVenueAuthHeaders();

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = result.message || 'Failed to search venues';
    throw new Error(errorMsg);
  }

  if (Array.isArray(result)) {
    return result;
  }
  return result.data || [];
};