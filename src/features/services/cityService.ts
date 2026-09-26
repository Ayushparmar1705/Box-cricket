import baseUrl from '../../api/Api';

export const fetchCitiesApi = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Assuming the location service is at port 3035 and the endpoint is /api/city/view
    // We use dynamic baseUrl if configured, else default to location service URL
    const locationServiceUrl = baseUrl.countries || 'http://localhost:3035';
    const response = await fetch(`${locationServiceUrl}/api/city/view?isActive=true&page=0&size=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('403 Forbidden: You do not have permission to view cities.');
      }
      throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchCitiesApi Error:", error);
    throw error;
  }
};
