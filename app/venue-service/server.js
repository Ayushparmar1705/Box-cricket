const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const sequelize = require('./config/config');
const venueRoutes = require('./Routes/Venue');

app.use('/api/v1', venueRoutes);
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "venue-service",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});
const PORT = process.env.PORT || 3009;

sequelize.sync()
    .then(() => {
        console.log("Database connected & synced");
        app.listen(PORT, () => {
            console.log(`Venue service is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });