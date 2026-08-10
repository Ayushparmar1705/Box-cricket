const { DataTypes } = require("sequelize");
const sequelize = require("../Config/config");

const Owner = sequelize.define("Owner", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[0-9]{10,15}$/,
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    paranoid: true, // Soft deletes (adds deletedAt)
    tableName: "owners",
});

module.exports = Owner;
