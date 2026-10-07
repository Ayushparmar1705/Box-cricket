// cityService.ts
// Handles all API requests related to Cities

import baseUrl from '../../api/Api';

export interface CityItem {
  id: number | string;
  city_name: string;
  city_code: string;
  state_name?: string;
  state?: any;
  stateId?: number | string;
  is_active?: boolean;
  [key: string]: any;
}

export interface CityPayload {
  state: number | string;
  city_name: string;
  city_code: string;
  is_active?: boolean;
}

export interface CityApiResponse<T = CityItem[]> {
  status?: number;
  success?: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * 1. View / Fetch Cities List
 * Endpoint: GET http://localhost:3035/api/city?status={status}&id={id}
 */
export const fetchCitiesApi = async (
  status: boolean | string = true,
  id: number = 0
): Promise<CityApiResponse<CityItem[]>> => {

  const response = await fetch(`${baseUrl.location}/api/city?status=${status}&id=${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch cities');
  }

  return await response.json();
};

/**
 * 2. Filter Cities by status
 * Endpoint: GET http://localhost:3035/api/city/status?status={status}
 */
export const filterCity = async (
  status: boolean | string = true
): Promise<CityItem[] | CityApiResponse<CityItem[]>> => {
  const response = await fetch(`${baseUrl.location}/api/city/status?status=${status}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch cities by status');
  }

  return await response.json();
};

/**
 * 3. Create City
 * Endpoint: POST http://localhost:3035/api/city
 */
export const createCityApi = async (cityData: CityPayload) => {
  const response = await fetch(`${baseUrl.location}/api/city`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      state: Number(cityData.state),
      city_name: cityData.city_name,
      city_code: cityData.city_code,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create city');
  }

  return await response.json();
};

/**
 * 4. Update City
 * Endpoint: PUT http://localhost:3035/api/city/update?id={id}
 */
export const updateCityApi = async (id: number | string, cityData: CityPayload) => {
  const response = await fetch(`${baseUrl.location}/api/city/update?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      state: Number(cityData.state),
      city_name: cityData.city_name,
      city_code: cityData.city_code,
      is_active: cityData.is_active,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update city');
  }

  return await response.json();
};

/**
 * 5. Soft Delete / Toggle Active Status
 * Endpoint: PUT http://localhost:3035/api/city?id={id}
 */
export const changeCityStatusApi = async (id: number | string) => {
  const response = await fetch(`${baseUrl.location}/api/city?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to change city status');
  }

  return await response.json();
};