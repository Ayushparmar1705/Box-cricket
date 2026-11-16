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
  price: number;
  valid_from?: string;
  valid_to?: string;
  is_active?: boolean;
  isActive?: boolean;
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

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Failed to fetch pricing rules'));
  }

  const items = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
  return items.map(normalizePricingRule);
};

/**
 * 2. Fetch Pricing Rule by Integer ID
 * Endpoint: GET http://localhost:3040/api/pricing/{id}
 */
export const fetchPricingRuleByIdApi = async (id: number | string): Promise<PricingRuleItem> => {
  const url = `${baseUrl.venue}/api/pricing/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Failed to fetch pricing rule'));
  }

  return normalizePricingRule(result.data || result);
};

/**
 * 3. Fetch Pricing Rules for a Court (with optional isActive filter)
 * Endpoint: GET http://localhost:3040/api/pricing/court/{courtId}?isActive=true/false
 */
export const fetchPricingRulesByCourtApi = async (
  courtId: number | string,
  isActive?: boolean
): Promise<PricingRuleItem[]> => {
  const url = isActive !== undefined
    ? `${baseUrl.venue}/api/pricing/court/${courtId}?isActive=${isActive}`
    : `${baseUrl.venue}/api/pricing/court/${courtId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(getErrorMessage(result, `Failed to fetch pricing rules for court #${courtId}`));
  }

  const items = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
  return items.map(normalizePricingRule);
};

/**
 * 4. Create a New Pricing Rule
 * Endpoint: POST http://localhost:3040/api/pricing/create
 */
export const createPricingRuleApi = async (payload: PricingRulePayload): Promise<PricingRuleItem> => {
  const url = `${baseUrl.venue}/api/pricing/create`;

  const bodyData: Record<string, any> = {
    court_id: Number(payload.court_id),
    courtId: Number(payload.court_id),
    day_type: payload.day_type,
    dayType: payload.day_type,
    price: Number(payload.price),
    valid_from: payload.valid_from || null,
    validFrom: payload.valid_from || null,
    valid_to: payload.valid_to || null,
    validTo: payload.valid_to || null,
  };

  if (payload.is_active !== undefined) {
    bodyData.is_active = Boolean(payload.is_active);
    bodyData.isActive = Boolean(payload.is_active);
  }

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
  if (payload.is_active !== undefined) {
    bodyData.is_active = Boolean(payload.is_active);
    bodyData.isActive = Boolean(payload.is_active);
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
