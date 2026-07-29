require("dotenv").config();
const express = require("express");
const sequelize = require("./config/config");
const cors = require("cors");
const routes = require("./route/route");
require("./model"); // Load all models & unique associations from model/index.js

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "owner-request-service",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/v1", routes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("[Owner Request Service] Connected to PostgreSQL Database via Sequelize.");
        await sequelize.sync({ alter: false });
        console.log("[Owner Request Service] Database models synchronized.");
    } catch (error) {
        console.error("[Owner Request Service Error] Database connection error:", error.message);
    }
    app.listen(PORT, () => {
        console.log(`🚀 [Owner Request Service] Server listening on port ${PORT}`);
    });
}

startServer();
