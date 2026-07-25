require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/config");
const documentRoutes = require("./route/owner-document");
require("./model"); // Initialize models and associations

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "owner-document-service",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api/v1", documentRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route '${req.originalUrl}' not found on Owner Document Service.`,
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("[Owner Document Service Error]:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error.",
    });
});

// Start Server and Sync Database
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("[Owner Document Service] Database connection established.");
        await sequelize.sync({ alter: false });
        console.log("[Owner Document Service] Database models synchronized.");
    } catch (error) {
        console.error("[Owner Document Service Error] Database error:", error.message);
    }

    app.listen(PORT, () => {
        console.log(`🚀 [Owner Document Service] Running on port ${PORT}`);
    });
}

startServer();
