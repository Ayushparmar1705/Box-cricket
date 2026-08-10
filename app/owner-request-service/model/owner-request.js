const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");


const OwnerRequestModel = sequelize.define(
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
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        businessName: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        businessType: {
            type: DataTypes.ENUM(
                "Individual",
                "Partnership",
                "Company"
            ),
            allowNull: false,
        },

        gstNumber: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },

        status: {
            type: DataTypes.ENUM(
                "Pending",
                "Approved",
                "Rejected"
            ),
            allowNull: false,
            defaultValue: "Pending",
        },

        adminRemark: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        approvedBy: {
            field: "approved_by",
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },

        approvedAt: {
            field: "approved_at",
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "owner_requests",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = OwnerRequestModel;