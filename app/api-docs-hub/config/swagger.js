const globalSwaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Box Cricket Booking Platform - Global API Documentation",
        version: "1.0.0",
        description: "Unified OpenAPI 3.0 specification for all backend microservices (Auth, Owner Requests, Master, Venues, Bookings, Ops).",
    },
    servers: [
        { url: "http://localhost:3001", description: "Auth Service (Port 3001)" },
        { url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" },
        { url: "http://localhost:3007", description: "Owner Document Service (Port 3007)" },
        { url: "http://localhost:3002", description: "Master Data Service (Port 3002)" },
        { url: "http://localhost:3003", description: "Venue & Court Service (Port 3003)" },
        { url: "http://localhost:3004", description: "Booking & Slot Service (Port 3004)" },
        { url: "http://localhost:3005", description: "Operations & Audit Service (Port 3005)" },
    ],
    tags: [
        { name: "Authentication", description: "User registration, login & profile endpoints" },
        { name: "Owner Requests", description: "Venue Owner KYC verification & admin approval requests" },
        { name: "Master Data", description: "Cities, Categories & Amenities master records" },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Enter your JWT token obtained from /api/v1/auth/login",
            },
        },
        schemas: {
            UserRegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", example: "Rajesh Sharma" },
                    email: { type: "string", example: "admin@gmail.com" },
                    password: { type: "string", example: "Admin@123" },
                    role: { type: "string", enum: ["Admin", "SUPER_ADMIN", "Owner", "Player", "Staff"], example: "Player" },
                    phoneNumber: { type: "string", example: "9876543210" },
                },
            },
            UserLoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", example: "admin@gmail.com" },
                    password: { type: "string", example: "Admin@123" },
                },
            },
            OwnerRequestSubmit: {
                type: "object",
                required: ["user_id", "business_name", "business_type", "gst_number"],
                properties: {
                    user_id: { type: "integer", example: 1 },
                    business_name: { type: "string", example: "Royal Box Cricket Arena" },
                    business_type: { type: "string", enum: ["Individual", "Partnership", "Company"], example: "Individual" },
                    gst_number: { type: "string", example: "22AAAAA0000A1Z5" },
                },
            },
            CategoryRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", example: "Box Cricket" },
                },
            },
        },
    },
    paths: {
        "/api/v1/auth/register": {
            post: {
                servers: [{ url: "http://localhost:3001", description: "Auth Service (Port 3001)" }],
                tags: ["Authentication"],
                summary: "Register a new user account",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserRegisterRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "User registered successfully" },
                    "400": { description: "Email or phone number already exists / validation error" },
                },
            },
        },
        "/api/v1/auth/login": {
            post: {
                servers: [{ url: "http://localhost:3001", description: "Auth Service (Port 3001)" }],
                tags: ["Authentication"],
                summary: "Authenticate user and receive JWT token",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserLoginRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Login successful with JWT token" },
                    "401": { description: "Invalid email or password" },
                },
            },
        },
        "/api/v1/auth/me": {
            get: {
                servers: [{ url: "http://localhost:3001", description: "Auth Service (Port 3001)" }],
                tags: ["Authentication"],
                summary: "Get current authenticated user profile",
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": { description: "User profile data returned" },
                    "401": { description: "Unauthorized / Missing JWT token" },
                },
            },
        },
        "/api/v1/owner-request": {
            post: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Requests"],
                summary: "Submit a new venue owner verification request",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/OwnerRequestSubmit" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Owner request submitted successfully" },
                    "400": { description: "Validation error or missing fields" },
                },
            },
        },
        "/api/v1/get-owner-request": {
            get: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Requests"],
                summary: "Get all submitted owner requests",
                responses: {
                    "200": { description: "List of all owner requests retrieved successfully" },
                    "500": { description: "Internal server error" },
                },
            },
        },
        "/api/v1/category": {
            post: {
                servers: [{ url: "http://localhost:3002", description: "Master Data Service (Port 3002)" }],
                tags: ["Master Data"],
                summary: "Create a new category",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CategoryRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Category created successfully" },
                    "400": { description: "Invalid category name" },
                    "500": { description: "Failed to create Category" },
                },
            },
            get: {
                servers: [{ url: "http://localhost:3002", description: "Master Data Service (Port 3002)" }],
                tags: ["Master Data"],
                summary: "Get all categories (supports status filtering)",
                parameters: [
                    {
                        name: "status",
                        in: "query",
                        required: false,
                        schema: { type: "string", enum: ["active", "inactive", "all"] },
                        description: "Filter categories by status. Defaults to all.",
                    },
                ],
                responses: {
                    "200": { description: "List of categories" },
                    "400": { description: "Failed to fetch category" },
                },
            },
        },
        "/api/v1/category/{id}": {
            delete: {
                servers: [{ url: "http://localhost:3002", description: "Master Data Service (Port 3002)" }],
                tags: ["Master Data"],
                summary: "Soft delete a category by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "Category ID",
                    },
                ],
                responses: {
                    "200": { description: "Category deleted successfully" },
                    "400": { description: "Invalid category id" },
                    "404": { description: "Category not found" },
                    "500": { description: "Failed to delete Category" },
                },
            },
        },
    },
};

module.exports = globalSwaggerSpec;
