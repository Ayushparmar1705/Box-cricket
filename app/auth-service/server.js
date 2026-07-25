require("dotenv").config();
const express = require("express");
const sequelize = require("./config/config");
const userRoutes = require("./route/User");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Swagger API Documentation UI & JSON Spec
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs-json", (req, res) => res.json(swaggerSpec));

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "auth-service",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/v1/auth", userRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("[Auth Service] Connected to PostgreSQL Database via Sequelize.");
        await sequelize.sync({ alter: false });
        console.log("[Auth Service] Database models synchronized.");
    } catch (error) {
        console.error("[Auth Service Error] Database connection error:", error.message);
    }
    app.listen(PORT, () => {
        console.log(`🚀 [Auth Service] Server listening on port ${PORT}`);
        console.log(`📑 [Auth Service] Swagger API Docs available at http://localhost:${PORT}/api-docs`);
    });
}

startServer();
