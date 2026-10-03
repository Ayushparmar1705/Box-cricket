import baseUrl from '../../api/Api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export interface PaginatedStateResponse {
  content: any[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  [key: string]: any;
}

export const fetchStatesApi = async (page: number = 0, size: number = 10, isActive: boolean = true) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const params = new URLSearchParams({
      isActive: String(isActive),
      page: String(page),
      size: String(size),
    });

    const response = await fetch(`${baseUrl.location}/api/state/view?${params}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('403 Forbidden: You do not have permission to view states.');
      }
      throw new Error(`Failed to fetch states: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchStatesApi Error:", error);
    throw error;
  }
};

export const createStateApi = async (stateData: any) => {
  try {
    const response = await fetch(`${baseUrl.location}/api/state/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(stateData)
    });
    return await response.json();
  } catch (err) {
    console.error('createStateApi Error:', err);
    throw err;
  }
};

export const updateStateApi = async (id: number | string, stateData: any) => {
  try {
    const response = await fetch(`${baseUrl.location}/api/state/update/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(stateData)
    });
    return await response.json();
  } catch (err) {
    console.error('updateStateApi Error:', err);
    throw err;
  }
};

export const deleteStateApi = async (id: number | string) => {
  try {
    const response = await fetch(`${baseUrl.location}/api/state/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return await response.json();
  } catch (err) {
    console.error('deleteStateApi Error:', err);
    throw err;
  }
};