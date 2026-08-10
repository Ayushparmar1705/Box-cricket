require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const sequelize = require("./Config/config");
const ownerRoutes = require("./Routes/Owner");

app.use("/api/v1", ownerRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "owner-basic-detail-service",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

const PORT = process.env.PORT || 3002;

sequelize.sync()
    .then(() => {
        console.log("Database connected & synced");
        app.listen(PORT, () => {
            console.log(`Owner basic detail service is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
