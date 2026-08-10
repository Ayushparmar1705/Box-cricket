require("dotenv").config();
const express = require("express");
const sequelize = require("./config/config");
const userRoutes = require("./route/User");
const cors = require("cors");
require("./model/index");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
    });
}

startServer();
