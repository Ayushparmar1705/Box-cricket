import baseUrl from '../../api/Api';
const locationServiceUrl = baseUrl.location || 'http://localhost:3035';
export const fetchCitiesApi = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Assuming the location service is at port 3035 and the endpoint is /api/city/view
    // We use dynamic baseUrl if configured, else default to location service URL

    const response = await fetch(`${locationServiceUrl}/api/city`, {
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


export const addCityApi = async (cityData: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    const response = await fetch(`${locationServiceUrl}/api/city/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(cityData)
    })
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("403 Forbidden: You do not have permission to add city");
      }
      throw new Error(`Failed to add city : ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("addCityApi Error:", error);
    throw error;
  }
}

export const changeStatusApi = async (id: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    const response = await fetch(`${locationServiceUrl}/api/city/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("403 Forbidden: You do not have permission to change status of city");
      }
      throw new Error(`Failed to change status of city : ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.log("deleteCityApi Error:", error);
    throw error;
  }

}