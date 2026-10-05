// stateService.ts
// Handles all API requests related to States

import baseUrl from '../../api/Api';
import type { CountryItem } from './countryService';

export interface StateItem {
  id: number | string;
  state_name: string;
  state_code: string;
  country_name?: string;
  country?: CountryItem | any;
  countryId?: number | string;
  is_active?: boolean;
  [key: string]: any;
}

export interface StatePayload {
  country: number | string;
  state_name: string;
  state_code: string;
  is_active?: boolean;
}

export interface StateApiResponse<T = StateItem[]> {
  status?: number;
  success?: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Helper function to get authorization headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Fetch states list
 * Endpoint: GET http://localhost:3035/api/state?status=true&id=0
 */
export const fetchStatesApi = async (
  status: boolean | string = true,
  id: number = 0
): Promise<StateApiResponse<StateItem[]>> => {
  const response = await fetch(`${baseUrl.location}/api/state?status=${status}&id=${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch states');
  }

  return await response.json();
};

/**
 * Filter states by status
 * Endpoint: GET http://localhost:3035/api/state/status?status={status}
 */
export const filterState = async (
  status: boolean | string = true
): Promise<StateItem[] | StateApiResponse<StateItem[]>> => {
  const response = await fetch(`${baseUrl.location}/api/state/status?status=${status}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch states by status');
  }

  return await response.json();
};

/**
 * Create a new state
 * Endpoint: POST http://localhost:3035/api/state
 */
export const createStateApi = async (stateData: StatePayload) => {
  const response = await fetch(`${baseUrl.location}/api/state`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      country: Number(stateData.country),
      state_name: stateData.state_name,
      state_code: stateData.state_code,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create state');
  }

  return await response.json();
};

/**
 * Update an existing state
 * Endpoint: PUT http://localhost:3035/api/state/update?id={id}
 */
export const updateStateApi = async (id: number | string, stateData: StatePayload) => {
  const response = await fetch(`${baseUrl.location}/api/state/update?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      country: Number(stateData.country),
      state_name: stateData.state_name,
      state_code: stateData.state_code,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update state');
  }

  return await response.json();
};

export const deleteStateApi = async (id: number) => {
  const response = await fetch(`${baseUrl.location}/api/state?id=${id}`, {
    method: "PUT",
    headers: getHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete state');
  }
  return await response.json();
};