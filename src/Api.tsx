const Api = {
    login: "http://localhost:3001/api/v1/auth/login",
    register: "http://localhost:3001/api/v1/auth/register",
    ownerLogin: "http://localhost:3001/api/v1/owner/login",
    ownerRegister: "http://localhost:3001/api/v1/owner/register",
    ownerRequest: "http://localhost:3006/api/v1/get-owner-request",
    // Category Endpoints
    category: "http://localhost:3002/api/v1/category",
    getCategory: (status: string) => `http://localhost:3002/api/v1/category/${status}`,
    getCategoryById: (id: number) => `http://localhost:3002/api/v1/category-by-id/${id}`,
    updateCategory: (id: number) => `http://localhost:3002/api/v1/update-category/${id}`,

    // City Endpoints (Port 3008)
    city: "http://localhost:3008/api/v1/city",
    getCity: (status: string) => `http://localhost:3008/api/v1/city/${status}`,
    getCityById: (id: number) => `http://localhost:3008/api/v1/city-by-id/${id}`,
    updateCity: (id: number) => `http://localhost:3008/api/v1/update-city/${id}`,
}

export default Api