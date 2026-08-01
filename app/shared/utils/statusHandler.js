const { Op } = require("sequelize");

/**
 * Common utility to handle status filtering across any microservice.
 * This dynamically generates Sequelize query options for any model based on how it tracks status.
 * 
 * @param {string} status - The requested status ('active', 'inactive', 'all')
 * @param {string} strategy - How the model tracks status: 'paranoid' (soft-delete), 'boolean' (isActive), or 'string' (status text)
 * @param {string} fieldName - The database column name used if strategy is 'boolean' or 'string' (e.g. 'isActive')
 * @returns {object} - Sequelize query options to pass directly into findAll() or findOne()
 */
function getStatusQueryOptions(status, strategy = "paranoid", fieldName = "isActive") {
    const options = { where: {} };

    if (strategy === "paranoid") {
        if (status === "active") {
            options.paranoid = true; // Sequelize automatically handles deletedAt IS NULL
        } else if (status === "inactive") {
            options.paranoid = false;
            options.where.deletedAt = { [Op.ne]: null }; // deletedAt IS NOT NULL
        } else {
            // 'all'
            options.paranoid = false;
        }
    } 
    else if (strategy === "boolean") {
        if (status === "active") {
            options.where[fieldName] = true;
        } else if (status === "inactive") {
            options.where[fieldName] = false;
        }
    } 
    else if (strategy === "string") {
        if (status === "active") {
            options.where[fieldName] = "active";
        } else if (status === "inactive") {
            options.where[fieldName] = "inactive";
        }
    }

    // Clean up empty where clause if not used
    if (Object.keys(options.where).length === 0) {
        delete options.where;
    }

    return options;
}

module.exports = {
    getStatusQueryOptions
};
