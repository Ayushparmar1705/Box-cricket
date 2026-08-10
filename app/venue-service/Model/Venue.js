const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Venue = sequelize.define(
    "Venue",
    {
        id: {
            type: DataTypes.INTEGER,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        ownerId: {
            field: "owner_id",
            type: DataTypes.INTEGER,
            references: {
                model: "user_accounts",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        cityId: {
            field: "city_id",
            type: DataTypes.INTEGER,
            references: {
                model: "cities",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        venueName: {
            field: "venue_name",
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        address: {
            type: DataTypes.TEXT,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
        },
        googleMapLink: {
            field: "google_map_link",
            type: DataTypes.TEXT,
        },
        contactNumber: {
            field: "contact_number",
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
        },
        openingTime: {
            field: "opening_time",
            type: DataTypes.TIME,
        },
        closingTime: {
            field: "closing_time",
            type: DataTypes.TIME,
        },
        venueAmenities: {
            field: "Venue_amenities",
            type: DataTypes.JSON,
        },
        cancellationPolicy: {
            field: "cancellation_policy",
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.ENUM("PENDING", "ACTIVE", "BLOCKED"),
            defaultValue: "PENDING",
        },
        averageRating: {
            field: "average_rating",
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
        },
        totalReviews: {
            field: "total_reviews",
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        isActive: {
            field: "is_active",
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        createdAt: {
            field: "created_at",
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            field: "updated_at",
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "venues",
        timestamps: true, // We have created_at and updated_at
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Venue;
