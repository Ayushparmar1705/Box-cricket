const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

/**
 * OwnerRequest Model (Reference for document foreign keys)
 */
const OwnerRequest = sequelize.define(
    "OwnerRequest",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            field: "user_id",
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        businessName: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        businessType: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        gstNumber: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "Pending",
        },
    },
    {
        tableName: "owner_requests",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = OwnerRequest;
