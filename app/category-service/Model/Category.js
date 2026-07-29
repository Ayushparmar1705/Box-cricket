const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const category = sequelize.define("category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        field: 'deletedat',   // maps camelCase JS name → existing lowercase DB column
    }
}, {
    paranoid: true,  // soft delete: sets deletedAt instead of removing the row
})

module.exports = category;