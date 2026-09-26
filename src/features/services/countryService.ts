// countryService.ts
// Handles all API requests related to countries

import Api from "../../api/Api";


// Helper to get headers with the auth token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchCountriesApi = async () => {
  const response = await fetch(`${Api.countries}/api/country/view`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }

  return await response.json();
};

export const createCountryApi = async (countryData: { name: string, code: string, is_active: boolean }) => {
  const response = await fetch(`http://localhost:3035/api/country/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(countryData)
  });

  if (!response.ok) {
    throw new Error('Failed to create country');
  }

  return await response.json();
};
