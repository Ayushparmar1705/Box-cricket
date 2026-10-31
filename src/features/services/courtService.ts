// ============================================================================
// File: courtService.ts
// Description: Pure API Service for Courts & Ground Operations
// Integrates with backend at: http://localhost:3040/api/court
// ============================================================================

import baseUrl from '../../api/Api';

export type SurfaceType = 'TURF' | 'MAT' | 'CONCRETE';

export interface CourtImage {
  id?: number | string;
  courtId?: number | string;
  court_id?: number | string;
  imageUrl?: string;
  image_url?: string;
  createdAt?: string;
  created_at?: string;
}

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
  status: 'ACTIVE' | 'INACTIVE';
  images?: CourtImage[];
  createdAt?: string;
  updatedAt?: string;

  // Aliases for compatibility
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
  status?: 'ACTIVE' | 'INACTIVE';
  files?: File[];
  images?: File[];
}

export interface CourtApiResponse<T = CourtItem> {
  status: number;
  message: string;
  data: T;
}

/**
 * Returns Bearer token headers.
 * When isMultipart = true, Content-Type is omitted so browser sets boundary.
 */
export const getCourtAuthHeaders = (isMultipart: boolean = false): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Normalizes backend CourtEntity JSON into a clean frontend CourtItem.
 */
const normalizeCourt = (raw: any): CourtItem => {
  const images: CourtImage[] = (raw.images || []).map((img: any) => ({
    id: img.id,
    courtId: img.courtId || img.court_id,
    imageUrl: img.imageUrl || img.image_url,
    createdAt: img.createdAt || img.created_at,
  }));

  const isActive =
    raw.is_active !== undefined
      ? raw.is_active
      : raw.isActive !== undefined
      ? raw.isActive
      : true;

  return {
    id: raw.id,
    venue_id: raw.venue_id || raw.venueId,
    venue_name: raw.venue?.name || raw.venue?.venue_name || raw.venue_name || 'Arena Ground',
    category_id: raw.category_id || raw.categoryId,
    category_name: raw.category_name || 'Sport Category',
    court_name: raw.court_name || raw.courtName || raw.courtNumber || 'Court',
    surface_type: raw.surface_type || raw.surfaceType || 'TURF',
    max_players: Number(raw.max_players || raw.maxPlayers || 12),
    description: raw.description || '',
    status: isActive ? 'ACTIVE' : 'INACTIVE',
    images,
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
};

/**
 * Helper to extract user-friendly error messages from backend responses.
 */
const getErrorMessage = (result: any, fallback: string): string => {
  if (result?.message) return result.message;
  if (result?.errors && typeof result.errors === 'object') {
    return Object.values(result.errors).join(', ');
  }
  return fallback;
};

// ============================================================================
// API Functions
// ============================================================================

export interface CourtFilterParams {
  venueId?: string | number;
  isActive?: boolean;
  search?: string;
  court_name?: string;
  courtName?: string;
  page?: number;
  size?: number;
}

/**
 * 1. Fetch Courts with Filters (venueId, isActive, search, court_name, pagination)
 * Endpoint: GET http://localhost:3040/api/courts
 */
export const fetchCourtsApi = async (
  params?: CourtFilterParams | string | number
): Promise<CourtItem[]> => {
  let query = '';
  if (params !== undefined && params !== null) {
    if (typeof params === 'object') {
      const qp = new URLSearchParams();
      if (params.venueId && params.venueId !== 'ALL') {
        qp.append('venueId', String(params.venueId));
      }
      if (params.isActive !== undefined) {
        qp.append('isActive', String(params.isActive));
      }
      if (params.search && params.search.trim()) {
        qp.append('search', params.search.trim());
      }
      if (params.court_name && params.court_name.trim()) {
        qp.append('court_name', params.court_name.trim());
      } else if (params.courtName && params.courtName.trim()) {
        qp.append('court_name', params.courtName.trim());
      }
      if (params.page !== undefined) {
        qp.append('page', String(params.page));
      }
      if (params.size !== undefined) {
        qp.append('size', String(params.size));
      }
      const qs = qp.toString();
      if (qs) query = `?${qs}`;
    } else if (params !== 'ALL') {
      query = `?venueId=${params}`;
    }
  }

  const url = `${baseUrl.venue}/api/courts${query}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getCourtAuthHeaders(false),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorJson, 'Failed to fetch courts from server'));
  }

  const result = await response.json();
  const rawList = Array.isArray(result) ? result : result.data || [];

  return Array.isArray(rawList) ? rawList.map(normalizeCourt) : [];
};

/**
 * 2. Create Court with optional images
 * Endpoint: POST http://localhost:3040/api/court/create
 */
export const createCourtApi = async (courtData: CourtPayload): Promise<CourtItem> => {
  const url = `${baseUrl.venue}/api/court/create`;

  // Build FormData for multipart upload
  const formData = new FormData();
  formData.append('venue_id', String(courtData.venue_id));
  formData.append('venueId', String(courtData.venue_id));
  formData.append('category_id', String(courtData.category_id));
  formData.append('categoryId', String(courtData.category_id));
  formData.append('court_name', courtData.court_name.trim());
  formData.append('courtName', courtData.court_name.trim());
  formData.append('surface_type', courtData.surface_type);
  formData.append('surfaceType', courtData.surface_type);
  formData.append('max_players', String(courtData.max_players || 12));
  formData.append('maxPlayers', String(courtData.max_players || 12));
  formData.append('description', courtData.description || '');

  const isActive = courtData.status === 'ACTIVE' || courtData.status === undefined;
  formData.append('is_active', String(isActive));
  formData.append('isActive', String(isActive));

  // Attach multiple image files
  const fileList = courtData.files || courtData.images || [];
  if (Array.isArray(fileList) && fileList.length > 0) {
    fileList.forEach((file) => {
      if (file instanceof File) {
        formData.append('files', file);
      }
    });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: getCourtAuthHeaders(true),
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Failed to create court'));
  }

  const created = normalizeCourt(result.data || result);
  if (courtData.venue_name) created.venue_name = courtData.venue_name;
  if (courtData.category_name) created.category_name = courtData.category_name;

  return created;
};

/**
 * 3. Update Court Details
 * Endpoint: PUT http://localhost:3040/api/courts/{id}
 */
export const updateCourtApi = async (
  id: string | number,
  updates: Partial<CourtPayload>
): Promise<CourtItem> => {
  const url = `${baseUrl.venue}/api/courts/${id}`;
  const fileList = updates.files || updates.images || [];
  const hasFiles = Array.isArray(fileList) && fileList.length > 0;

  let response: Response;

  if (hasFiles) {
    const formData = new FormData();
    if (updates.venue_id) {
      formData.append('venue_id', String(updates.venue_id));
      formData.append('venueId', String(updates.venue_id));
    }
    if (updates.category_id) {
      formData.append('category_id', String(updates.category_id));
      formData.append('categoryId', String(updates.category_id));
    }
    if (updates.court_name) {
      formData.append('court_name', updates.court_name.trim());
      formData.append('courtName', updates.court_name.trim());
    }
    if (updates.surface_type) {
      formData.append('surface_type', updates.surface_type);
      formData.append('surfaceType', updates.surface_type);
    }
    if (updates.max_players !== undefined) {
      formData.append('max_players', String(updates.max_players));
      formData.append('maxPlayers', String(updates.max_players));
    }
    if (updates.description !== undefined) {
      formData.append('description', updates.description);
    }
    if (updates.status) {
      const isActive = updates.status === 'ACTIVE';
      formData.append('is_active', String(isActive));
      formData.append('isActive', String(isActive));
    }

    fileList.forEach((file) => {
      if (file instanceof File) {
        formData.append('files', file);
      }
    });

    response = await fetch(url, {
      method: 'PUT',
      headers: getCourtAuthHeaders(true),
      body: formData,
    });
  } else {
    response = await fetch(url, {
      method: 'PUT',
      headers: getCourtAuthHeaders(false),
      body: JSON.stringify(updates),
    });
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Failed to update court'));
  }

  const updated = normalizeCourt(result.data || result);
  if (updates.venue_name) updated.venue_name = updates.venue_name;
  if (updates.category_name) updated.category_name = updates.category_name;

  return updated;
};

/**
 * 4. Change Court Status (ACTIVE / MAINTENANCE)
 * Endpoint: PUT http://localhost:3040/api/courts/{id}/status?status=...
 */
export const changeCourtStatusApi = async (
  id: string | number,
  status: 'ACTIVE' | 'INACTIVE' | boolean | string
): Promise<void> => {
  const isBool = typeof status === 'boolean' ? status : status === 'ACTIVE';
  const url = `${baseUrl.venue}/api/court/${id}/status?status=${isBool}&statusStr=${isBool ? 'ACTIVE' : 'INACTIVE'}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: getCourtAuthHeaders(false),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(result, 'Failed to update court status'));
  }
};

/**
 * 5. Delete Court
 * Endpoint: DELETE http://localhost:3040/api/courts/{id}
 */
export const deleteCourtApi = async (id: string | number): Promise<void> => {
  const url = `${baseUrl.venue}/api/courts/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: getCourtAuthHeaders(false),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(result, 'Failed to delete court'));
  }
};
