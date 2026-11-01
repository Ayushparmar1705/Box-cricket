// ============================================================================
// File: pricingService.ts
// Description: Pure API Service for Court Pricing Rules
// Backend API: http://localhost:3040/api/pricing
// ============================================================================

import baseUrl from '../../api/Api';

export type DayType = 'WEEKDAY' | 'WEEKEND' | 'HOLIDAY';

/**
 * Interface representing a Pricing Rule record returned by the backend.
 * Matches backend Pricingruleentity (PostgreSQL table: pricing_rules).
 */
export interface PricingRuleItem {
  id: number; // Integer primary key (e.g. 1, 2, 3)
  court_id: number;
  courtId?: number;
  court_name?: string;
  venue_name?: string;
  day_type: DayType;
  dayType?: DayType;
  start_time: string; // format: HH:mm:ss
  startTime?: string;
  end_time: string;   // format: HH:mm:ss
  endTime?: string;
  price: number;      // price per hour / slot window
  valid_from?: string; // format: YYYY-MM-DD
  validFrom?: string;
  valid_to?: string;   // format: YYYY-MM-DD
  validTo?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Payload sent to backend when creating or updating a pricing rule.
 */
export interface PricingRulePayload {
  court_id: number;
  day_type: DayType;
  start_time: string;
  end_time: string;
  price: number;
  valid_from?: string;
  valid_to?: string;
}

/**
 * Common API Response wrapper from Spring Boot backend.
 */
export interface PricingApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

/**
 * Helper: Build Authorization headers with JWT token from localStorage.
 */
const getAuthHeaders = (): Record<string, string> => {
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
 * Helper: Extract meaningful error message from backend response.
 */
const getErrorMessage = (result: any, fallback: string): string => {
  if (result?.message) return result.message;
  if (result?.errors && typeof result.errors === 'object') {
    return Object.values(result.errors).join(', ');
  }
  return fallback;
};

/**
 * Normalizes raw backend JSON into standard frontend PricingRuleItem.
 */
const normalizePricingRule = (raw: any): PricingRuleItem => {
  return {
    id: typeof raw.id === 'number' ? raw.id : Number(raw.id) || raw.id,
    court_id: raw.court_id ?? raw.courtId,
    courtId: raw.courtId ?? raw.court_id,
    day_type: (raw.day_type || raw.dayType || 'WEEKDAY') as DayType,
    dayType: (raw.dayType || raw.day_type || 'WEEKDAY') as DayType,
    start_time: raw.start_time || raw.startTime || '09:00:00',
    startTime: raw.startTime || raw.start_time || '09:00:00',
    end_time: raw.end_time || raw.endTime || '18:00:00',
    endTime: raw.endTime || raw.end_time || '18:00:00',
    price: Number(raw.price || 0),
    valid_from: raw.valid_from || raw.validFrom || '',
    validFrom: raw.validFrom || raw.valid_from || '',
    valid_to: raw.valid_to || raw.validTo || '',
    validTo: raw.validTo || raw.valid_to || '',
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : (raw.isActive !== undefined ? Boolean(raw.isActive) : true),
    isActive: raw.is_active !== undefined ? Boolean(raw.is_active) : (raw.isActive !== undefined ? Boolean(raw.isActive) : true),
    created_at: raw.created_at || raw.createdAt,
    updated_at: raw.updated_at || raw.updatedAt,
  };
};

// ============================================================================
// API Functions
// ============================================================================

/**
 * 1. Fetch All Pricing Rules (with optional isActive filter)
 * Endpoint: GET http://localhost:3040/api/pricing?isActive=true/false
 */
export const fetchAllPricingRulesApi = async (isActive?: boolean): Promise<PricingRuleItem[]> => {
  const url = isActive !== undefined ? `${baseUrl.venue}/api/pricing?isActive=${isActive}` : `${baseUrl.venue}/api/pricing`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorJson, 'Failed to fetch pricing rules'));
  }

  const result = await response.json();
  const rawList = Array.isArray(result) ? result : result.data || [];
  return Array.isArray(rawList) ? rawList.map(normalizePricingRule) : [];
};

/**
 * 2. Fetch Pricing Rules for a Specific Court
 * Endpoint: GET http://localhost:3040/api/pricing/court/{courtId}
 */
export const fetchPricingRulesByCourtApi = async (courtId: number | string): Promise<PricingRuleItem[]> => {
  const url = `${baseUrl.venue}/api/pricing/court/${courtId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorJson, `Failed to fetch pricing rules for court ${courtId}`));
  }

  const result = await response.json();
  const rawList = Array.isArray(result) ? result : result.data || [];
  return Array.isArray(rawList) ? rawList.map(normalizePricingRule) : [];
};

/**
 * 3. Fetch Pricing Rule by Integer ID
 * Endpoint: GET http://localhost:3040/api/pricing/{id}
 */
export const fetchPricingRuleByIdApi = async (id: number | string): Promise<PricingRuleItem> => {
  const url = `${baseUrl.venue}/api/pricing/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorJson, 'Failed to fetch pricing rule details'));
  }

  const result = await response.json();
  return normalizePricingRule(result.data || result);
};

/**
 * 4. Create a New Pricing Rule
 * Endpoint: POST http://localhost:3040/api/pricing/create
 */
export const createPricingRuleApi = async (payload: PricingRulePayload): Promise<PricingRuleItem> => {
  const url = `${baseUrl.venue}/api/pricing/create`;

  // Format time values to HH:mm:ss if passed as HH:mm
  const formattedStartTime = payload.start_time.length === 5 ? `${payload.start_time}:00` : payload.start_time;
  const formattedEndTime = payload.end_time.length === 5 ? `${payload.end_time}:00` : payload.end_time;

  const bodyData = {
    court_id: Number(payload.court_id),
    courtId: Number(payload.court_id),
    day_type: payload.day_type,
    dayType: payload.day_type,
    start_time: formattedStartTime,
    startTime: formattedStartTime,
    end_time: formattedEndTime,
    endTime: formattedEndTime,
    price: Number(payload.price),
    valid_from: payload.valid_from || null,
    validFrom: payload.valid_from || null,
    valid_to: payload.valid_to || null,
    validTo: payload.valid_to || null,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bodyData),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Failed to create pricing rule'));
  }

  return normalizePricingRule(result.data || result);
};

/**
 * 5. Update an Existing Pricing Rule by Integer ID
 * Endpoint: PUT http://localhost:3040/api/pricing/{id}
 */
export const updatePricingRuleApi = async (
  id: number | string,
  payload: Partial<PricingRulePayload>
): Promise<PricingRuleItem> => {
  const url = `${baseUrl.venue}/api/pricing/${id}`;

  const bodyData: Record<string, any> = {};
  if (payload.court_id !== undefined) {
    bodyData.court_id = Number(payload.court_id);
    bodyData.courtId = Number(payload.court_id);
  }
  if (payload.day_type !== undefined) {
    bodyData.day_type = payload.day_type;
    bodyData.dayType = payload.day_type;
  }
  if (payload.start_time !== undefined) {
    bodyData.start_time = payload.start_time.length === 5 ? `${payload.start_time}:00` : payload.start_time;
    bodyData.startTime = bodyData.start_time;
  }
  if (payload.end_time !== undefined) {
    bodyData.end_time = payload.end_time.length === 5 ? `${payload.end_time}:00` : payload.end_time;
    bodyData.endTime = bodyData.end_time;
  }
  if (payload.price !== undefined) {
    bodyData.price = Number(payload.price);
  }
  if (payload.valid_from !== undefined) {
    bodyData.valid_from = payload.valid_from || null;
    bodyData.validFrom = payload.valid_from || null;
  }
  if (payload.valid_to !== undefined) {
    bodyData.valid_to = payload.valid_to || null;
    bodyData.validTo = payload.valid_to || null;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(bodyData),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Failed to update pricing rule'));
  }

  return normalizePricingRule(result.data || result);
};

/**
 * 6. Delete a Pricing Rule by Integer ID
 * Endpoint: DELETE http://localhost:3040/api/pricing/{id}
 */
export const deletePricingRuleApi = async (id: number | string): Promise<void> => {
  const url = `${baseUrl.venue}/api/pricing/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(result, 'Failed to delete pricing rule'));
  }
};

/**
 * 7. Change Status / Restore a Pricing Rule (Soft Delete Toggle)
 * Endpoint: PUT http://localhost:3040/api/pricing/{id}/status?status=true/false
 */
export const changePricingRuleStatusApi = async (
  id: number | string,
  status: boolean
): Promise<PricingRuleItem> => {
  const url = `${baseUrl.venue}/api/pricing/${id}/status?status=${status}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Failed to update pricing rule status'));
  }

  return normalizePricingRule(result.data || result);
};

