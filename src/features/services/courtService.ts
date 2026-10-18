// ============================================================================
// File: courtService.ts
// Description: Court & Ground Specification API Service for Box Cricket App
// Columns: venue_id, category_id, court_name, surface_type, max_players, description
// ============================================================================

import baseUrl from '../../api/Api';

export type SurfaceType = 'TURF' | 'MAT' | 'CONCRETE';

export interface CourtItem {
  id: string | number;
  venue_id: string | number;
  venue_name?: string;
  category_id: string | number;
  category_name?: string;
  court_name: string;
  surface_type: SurfaceType;
  max_players: number;
  description: string;
  status: 'ACTIVE' | 'MAINTENANCE';
  createdAt?: string;
  updatedAt?: string;

  // Backward compatibility aliases if needed
  turfId?: string | number;
  turfName?: string;
  courtNumber?: string;
}

export interface CourtPayload {
  venue_id: string | number;
  venue_name?: string;
  category_id: string | number;
  category_name?: string;
  court_name: string;
  surface_type: SurfaceType;
  max_players: number;
  description: string;
  status?: 'ACTIVE' | 'MAINTENANCE';
}

export interface CourtApiResponse<T = CourtItem> {
  status: number;
  message: string;
  data: T;
}

// Initial mock fallback courts matching new DB schema
export const INITIAL_COURTS: CourtItem[] = [
  {
    id: 'crt-1',
    venue_id: '1',
    venue_name: 'Apex Arena Ground',
    category_id: 'cat-1',
    category_name: 'Box Cricket',
    court_name: 'Apex Arena Pitch A',
    surface_type: 'TURF',
    max_players: 14,
    description: 'High-density synthetic turf with perimeter netting and full night LED floodlights.',
    status: 'ACTIVE',
  },
  {
    id: 'crt-2',
    venue_id: '1',
    venue_name: 'Apex Arena Ground',
    category_id: 'cat-1',
    category_name: 'Box Cricket',
    court_name: 'Apex Arena Pitch B',
    surface_type: 'MAT',
    max_players: 12,
    description: 'Pro cushion shock-absorbing rubber mat suited for high-speed bowling and spin.',
    status: 'ACTIVE',
  },
  {
    id: 'crt-3',
    venue_id: '2',
    venue_name: 'Champions Cricket Turf',
    category_id: 'cat-1',
    category_name: 'Box Cricket',
    court_name: 'Main Stadium Court',
    surface_type: 'CONCRETE',
    max_players: 16,
    description: 'Solid concrete base court with marked creases and heavy-duty boundary wire mesh.',
    status: 'ACTIVE',
  },
];

const LOCAL_STORAGE_KEY = 'boxcricket_courts_cache_v2';

const getStoredCourts = (): CourtItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_COURTS;
};

const saveStoredCourts = (courts: CourtItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courts));
  } catch {
    // fallback
  }
};

export const getCourtAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Fetch courts for an owner or specific venue.
 * Endpoint: GET http://localhost:3040/api/courts
 */
export const fetchCourtsApi = async (venueId?: string | number): Promise<CourtItem[]> => {
  const query = venueId ? `?venueId=${venueId}` : '';
  const url = `${baseUrl.venue}/api/courts${query}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getCourtAuthHeaders(),
    });

    if (response.ok) {
      const result = await response.json();
      const list = Array.isArray(result) ? result : (result.data || []);
      if (Array.isArray(list) && list.length > 0) {
        saveStoredCourts(list);
        return list;
      }
    }
  } catch (err) {
    console.warn('Backend courts endpoint offline or returned error, using local state:', err);
  }

  // Graceful fallback to persistent localStorage / initial items
  const stored = getStoredCourts();
  if (venueId) {
    return stored.filter(c => String(c.venue_id) === String(venueId));
  }
  return stored;
};

/**
 * Create a new Court
 * Endpoint: POST http://localhost:3040/api/courts
 */
export const createCourtApi = async (courtData: CourtPayload): Promise<CourtItem> => {
  const url = `${baseUrl.venue}/api/courts`;
  const headers = getCourtAuthHeaders();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(courtData),
    });

    if (response.ok) {
      const result = await response.json();
      const item: CourtItem = result.data || result;
      // Sync local storage
      const current = getStoredCourts();
      saveStoredCourts([item, ...current]);
      return item;
    }
  } catch (err) {
    console.warn('Backend court creation offline, storing locally:', err);
  }

  // Fallback locally
  const created: CourtItem = {
    id: `crt-${Date.now()}`,
    venue_id: courtData.venue_id,
    venue_name: courtData.venue_name || 'Arena Ground',
    category_id: courtData.category_id,
    category_name: courtData.category_name || 'Sport Category',
    court_name: courtData.court_name,
    surface_type: courtData.surface_type,
    max_players: Number(courtData.max_players) || 12,
    description: courtData.description || '',
    status: courtData.status || 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  const current = getStoredCourts();
  saveStoredCourts([created, ...current]);
  return created;
};

/**
 * Update Court Details
 * Endpoint: PUT http://localhost:3040/api/courts/{id}
 */
export const updateCourtApi = async (id: string | number, updates: Partial<CourtPayload>): Promise<CourtItem> => {
  const url = `${baseUrl.venue}/api/courts/${id}`;
  const headers = getCourtAuthHeaders();

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const result = await response.json();
      return result.data || result;
    }
  } catch (err) {
    console.warn('Backend court update offline, updating locally:', err);
  }

  const current = getStoredCourts();
  const updated = current.map(c => (String(c.id) === String(id) ? { ...c, ...updates } : c));
  saveStoredCourts(updated);
  return updated.find(c => String(c.id) === String(id))!;
};

/**
 * Toggle or change Court Status (ACTIVE / MAINTENANCE)
 * Endpoint: PUT http://localhost:3040/api/courts/{id}/status?status=...
 */
export const changeCourtStatusApi = async (id: string | number, status: 'ACTIVE' | 'MAINTENANCE'): Promise<void> => {
  const url = `${baseUrl.venue}/api/courts/${id}/status?status=${status}`;
  const headers = getCourtAuthHeaders();

  try {
    await fetch(url, {
      method: 'PUT',
      headers,
    });
  } catch (err) {
    console.warn('Backend court status offline, updating locally:', err);
  }

  const current = getStoredCourts();
  const updated = current.map(c => (String(c.id) === String(id) ? { ...c, status } : c));
  saveStoredCourts(updated);
};

/**
 * Delete Court
 * Endpoint: DELETE http://localhost:3040/api/courts/{id}
 */
export const deleteCourtApi = async (id: string | number): Promise<void> => {
  const url = `${baseUrl.venue}/api/courts/${id}`;
  const headers = getCourtAuthHeaders();

  try {
    await fetch(url, {
      method: 'DELETE',
      headers,
    });
  } catch (err) {
    console.warn('Backend court delete offline, deleting locally:', err);
  }

  const current = getStoredCourts();
  saveStoredCourts(current.filter(c => String(c.id) !== String(id)));
};
