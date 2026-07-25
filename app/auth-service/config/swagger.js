const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth Service API",
            version: "1.0.0",
            description: "Authentication and User Management Microservice API Documentation",
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        path.join(__dirname, "../route/*.js"),
        path.join(__dirname, "../server.js"),
    ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
