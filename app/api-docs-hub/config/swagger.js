const globalSwaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Box Cricket Booking Platform - Global API Documentation",
        version: "1.0.0",
        description: "Unified OpenAPI 3.0 specification for all backend microservices (Auth, Owner Requests, Master, Venues, Bookings, Ops).",
    },
    servers: [
        {
            url: "http://localhost:3001",
            description: "Auth Service (Port 3001)",
        },
        {
            url: "http://localhost:3006",
            description: "Owner Request Service (Port 3006)",
        },
        {
            url: "http://localhost:3007",
            description: "Owner Document Service (Port 3007)",
        },
        {
            url: "http://localhost:3002",
            description: "Master Data Service (Port 3002)",
        },
        {
            url: "http://localhost:3003",
            description: "Venue & Court Service (Port 3003)",
        },
        {
            url: "http://localhost:3004",
            description: "Booking & Slot Service (Port 3004)",
        },
        {
            url: "http://localhost:3005",
            description: "Operations & Audit Service (Port 3005)",
        },
    ],
    tags: [
        { name: "Authentication", description: "User registration, login & profile endpoints" },
        { name: "Owner Requests", description: "Venue Owner KYC verification & admin approval requests" },
        { name: "Owner Documents", description: "Multiple document attachment & KYC verification status" },
        { name: "Master Data", description: "Cities, Categories & Amenities master records" },
        { name: "Venues & Courts", description: "Box Cricket venue listings, court details & management" },
        { name: "Bookings & Slots", description: "Slot generation, locking, checkout & booking management" },
        { name: "Operations & Audit", description: "Staff management, reviews, favourites & system logs" },
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
            OwnerDocumentItem: {
                type: "object",
                required: ["document_type", "document_url"],
                properties: {
                    document_type: { type: "string", enum: ["AADHAR", "PAN", "GST", "SHOP_LICENSE", "OTHER"], example: "GST" },
                    document_url: { type: "string", example: "https://storage.boxcricket.app/docs/gst_certificate.pdf" },
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
                    documents: {
                        type: "array",
                        items: { $ref: "#/components/schemas/OwnerDocumentItem" },
                    },
                },
            },
            UploadDocumentsRequest: {
                type: "object",
                required: ["owner_request_id", "documents"],
                properties: {
                    owner_request_id: { type: "integer", example: 1 },
                    documents: {
                        type: "array",
                        items: { $ref: "#/components/schemas/OwnerDocumentItem" },
                    },
                },
            },
            UpdateDocStatusRequest: {
                type: "object",
                required: ["verification_status"],
                properties: {
                    verification_status: { type: "string", enum: ["PENDING", "VERIFIED", "REJECTED"], example: "VERIFIED" },
                },
            },
            OwnerRequestVerify: {
                type: "object",
                required: ["status"],
                properties: {
                    status: { type: "string", enum: ["APPROVED", "REJECTED"], example: "APPROVED" },
                    adminRemark: { type: "string", example: "GST & KYC verified successfully." },
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
                summary: "Submit a new venue owner verification request with optional documents",
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
                summary: "Get all submitted owner requests with owner user details and attached documents",
                responses: {
                    "200": {
                        description: "List of all owner requests retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        count: { type: "integer", example: 1 },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer", example: 1 },
                                                    userId: { type: "integer", example: 1 },
                                                    businessName: { type: "string", example: "Royal Box Cricket Arena" },
                                                    businessType: { type: "string", example: "Individual" },
                                                    gstNumber: { type: "string", example: "22AAAAA0000A1Z5" },
                                                    status: { type: "string", example: "Pending" },
                                                    adminRemark: { type: "string", example: "Pending" },
                                                    createdAt: { type: "string", example: "2026-07-25T13:58:00.000Z" },
                                                    owner: {
                                                        type: "object",
                                                        properties: {
                                                            id: { type: "integer", example: 1 },
                                                            name: { type: "string", example: "Rajesh Sharma" },
                                                            email: { type: "string", example: "admin@gmail.com" },
                                                            phoneNumber: { type: "string", example: "9876543210" },
                                                            role: { type: "string", example: "Player" },
                                                        },
                                                    },
                                                    documents: {
                                                        type: "array",
                                                        items: { $ref: "#/components/schemas/OwnerDocumentItem" },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Internal server error" },
                },
            },
        },
        "/api/v1/owner-request/documents": {
            post: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Documents"],
                summary: "Upload / attach multiple documents to an owner request",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UploadDocumentsRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Documents uploaded successfully" },
                    "400": { description: "Missing owner_request_id or documents array" },
                },
            },
        },
        "/api/v1/owner-request/{ownerRequestId}/documents": {
            get: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Documents"],
                summary: "Get all attached documents for an owner request",
                parameters: [
                    {
                        name: "ownerRequestId",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "Owner Request ID",
                    },
                ],
                responses: {
                    "200": { description: "List of attached owner documents" },
                },
            },
        },
        "/api/v1/owner-request/document/{documentId}/status": {
            patch: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Documents"],
                summary: "Admin: Update verification status of a document (PENDING, VERIFIED, REJECTED)",
                parameters: [
                    {
                        name: "documentId",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "Owner Document ID",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateDocStatusRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Document verification status updated successfully" },
                    "400": { description: "Invalid verification status" },
                },
            },
        },
        "/api/v1/owner-requests/my-requests": {
            get: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Requests"],
                summary: "Fetch all owner requests submitted by logged-in user",
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": { description: "List of user's owner requests" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/api/v1/owner-requests/admin/all": {
            get: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Requests"],
                summary: "Admin: Fetch all submitted owner requests",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "status",
                        in: "query",
                        required: false,
                        schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] },
                        description: "Filter by status",
                    },
                ],
                responses: {
                    "200": { description: "All owner requests list" },
                    "403": { description: "Forbidden - Requires Admin role" },
                },
            },
        },
        "/api/v1/owner-requests/admin/{id}/verify": {
            patch: {
                servers: [{ url: "http://localhost:3006", description: "Owner Request Service (Port 3006)" }],
                tags: ["Owner Requests"],
                summary: "Admin: Approve or Reject an owner request",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Owner Request ID",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/OwnerRequestVerify" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Request status updated & user role updated" },
                    "400": { description: "Invalid status parameter" },
                },
            },
        },
    },
};

module.exports = globalSwaggerSpec;
