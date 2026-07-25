require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const globalSwaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Serve Single Global Swagger UI at /api-docs and root /
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(globalSwaggerSpec));

app.get("/api-docs-json", (req, res) => {
    res.json(globalSwaggerSpec);
});

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
    console.log(`🚀 [Global API Docs Hub] Centralized Documentation Server running on port ${PORT}`);
    console.log(`📑 [Global API Docs Hub] Swagger UI available at http://localhost:${PORT}/api-docs`);
});
