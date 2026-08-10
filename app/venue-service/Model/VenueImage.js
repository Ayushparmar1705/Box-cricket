const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Venue = require("./Venue");

const VenueImage = sequelize.define(
    "VenueImage",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        venueId: {
            field: "venue_id",
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "venues", // or the Venue model
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        imageUrl: {
            field: "image_url",
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isCover: {
            field: "is_cover",
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "venue_images",
        timestamps: false, // According to the requirements, no timestamps listed for venue_images
    }
);

// Establish the relationship
Venue.hasMany(VenueImage, { foreignKey: "venueId", as: "images" });
VenueImage.belongsTo(Venue, { foreignKey: "venueId", as: "venue" });

module.exports = VenueImage;
