// countryService.ts
// Handles all API requests related to countries

import baseUrl from "../../api/Api";

export interface CountryItem {
  id: number | string;
  country_name: string;
  country_code: string;
  is_active?: boolean;
  [key: string]: any;
}

export interface CountryPayload {
  country_name: string;
  country_code: string;
  is_active?: boolean;
}

export interface CountryApiResponse<T = CountryItem[]> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Helper to get headers with the auth token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchCountriesApi = async (status: string | boolean = true): Promise<CountryApiResponse<CountryItem[]>> => {
  const response = await fetch(`${baseUrl.location}/api/country?status=${status}&id=0`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }

  return await response.json();
};

export const filterCountry = async (status: boolean | string = true): Promise<CountryItem[] | CountryApiResponse<CountryItem[]>> => {
  const response = await fetch(`${baseUrl.location}/api/country/status?status=${status}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch countries by status');
  }

  return await response.json();
};

export const createCountryApi = async (countryData: CountryPayload) => {
  const response = await fetch(`${baseUrl.location}/api/country`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      country_name: countryData.country_name,
      country_code: countryData.country_code
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create country');
  }

  return await response.json();
};

export const updateCountryApi = async (id: number | string, countryData: CountryPayload) => {
  const response = await fetch(`${baseUrl.location}/api/country/update?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(countryData)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update country');
  }

  return await response.json();
};

export const changeCountryStatusApi = async (id: number | string) => {
  const response = await fetch(`${baseUrl.location}/api/country?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to change country status');
  }

  return await response.json();
};

