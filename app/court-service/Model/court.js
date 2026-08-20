const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const court = sequelize.define("court", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    venue: {
        type: DataTypes.INTEGER,
        references: {
            key: "id",
            model: "venue",
        }
    },
    category: {
        type: DataTypes.INTEGER,
        references: {
            key: "id",
            model: "category",
        }
    },

    court_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    surface_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surface_type: {
        type: DataTypes.ENUM("Turf", "Mat", "Concrete"),
        allowNull: false,
    },
    max_players: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
});

module.exports = court;
