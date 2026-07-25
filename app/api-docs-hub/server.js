require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Configure Centralized Swagger UI Explorer options with microservice spec URLs
const swaggerExplorerOptions = {
    explorer: true,
    swaggerOptions: {
        urls: [
            {
                name: "🔑 Auth Service (v1)",
                url: process.env.AUTH_SERVICE_SPEC_URL || "http://localhost:3001/api-docs-json",
            },
            {
                name: "📝 Owner Request Service (v1)",
                url: process.env.OWNER_REQUEST_SERVICE_SPEC_URL || "http://localhost:3006/api-docs-json",
            },
            {
                name: "⚙️ Master Service (v1)",
                url: process.env.MASTER_SERVICE_SPEC_URL || "http://localhost:3002/api-docs-json",
            },
            {
                name: "🏟️ Venue Service (v1)",
                url: process.env.VENUE_SERVICE_SPEC_URL || "http://localhost:3003/api-docs-json",
            },
            {
                name: "📅 Booking Service (v1)",
                url: process.env.BOOKING_SERVICE_SPEC_URL || "http://localhost:3004/api-docs-json",
            },
            {
                name: "🛠️ Ops Service (v1)",
                url: process.env.OPS_SERVICE_SPEC_URL || "http://localhost:3005/api-docs-json",
            },
        ],
    },
};

// Serve Centralized Swagger UI at /api-docs and redirect root
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, swaggerExplorerOptions));

app.get("/", (req, res) => {
    res.redirect("/api-docs");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "api-docs-hub",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log(`🚀 [API Docs Hub] Centralized Documentation Server running on port ${PORT}`);
    console.log(`📑 [API Docs Hub] Swagger UI Hub available at http://localhost:${PORT}/api-docs`);
});
