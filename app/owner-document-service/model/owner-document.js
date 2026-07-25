const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

/**
 * OwnerDocument Model Definition
 * Represents KYC & Business verification documents attached to owner requests.
 */
const OwnerDocument = sequelize.define(
    "OwnerDocument",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ownerRequestId: {
            field: "owner_request_id",
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "owner_requests",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        documentType: {
            field: "document_type",
            type: DataTypes.ENUM("AADHAR", "PAN", "GST", "SHOP_LICENSE", "OTHER"),
            allowNull: false,
        },
        documentUrl: {
            field: "document_url",
            type: DataTypes.TEXT,
            allowNull: false,
        },
        verificationStatus: {
            field: "verification_status",
            type: DataTypes.ENUM("PENDING", "VERIFIED", "REJECTED"),
            allowNull: false,
            defaultValue: "PENDING",
        },
        uploadedAt: {
            field: "uploaded_at",
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "owner_documents",
        timestamps: false,
    }
);

module.exports = OwnerDocument;
