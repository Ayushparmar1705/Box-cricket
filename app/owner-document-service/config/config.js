const { Sequelize } = require("sequelize");

/**
 * Initialize Sequelize PostgreSQL connection with environment variables
 */
const sequelize = new Sequelize(
    process.env.DB_NAME || "box_cricket_db",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        dialect: "postgres",
        logging: false, // Set to console.log to debug SQL queries if needed
    }
);

module.exports = sequelize;
