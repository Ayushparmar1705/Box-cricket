const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Owner Request Service API",
            version: "1.0.0",
            description: "Owner Request Management Microservice API Documentation",
        },
        servers: [
            {
                url: "http://localhost:3006",
                description: "Local Development Server",
            },
        ],
    },
    apis: [
        path.join(__dirname, "../route/*.js"),
        path.join(__dirname, "../server.js"),
    ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
