const { Op } = require("sequelize");
const sequelize = require("../config/config");
const City = require("../Model/City");

async function createCity(name, state) {
    const t = await sequelize.transaction();
    try {
        const newCity = await City.create({
            name: name,
            state: state
        }, { transaction: t });
        await t.commit();
        return {
            message: "City successfully created",
            data: newCity
        };
    } catch (err) {
        await t.rollback();
        if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Error("City already exists");
        }
        throw err;
    }
}

async function getCities(status) {
    const options = { paranoid: false };
    
    if (status === "active") {
        options.paranoid = true; 
    } else if (status === "inactive") {
        options.where = { deletedAt: { [Op.ne]: null } };
    }

    const result = await City.findAll(options);
    return result;
}

async function getCityById(id) {
    const found = await City.findByPk(id, { paranoid: false });
    if (!found) {
        throw new Error("City not found");
    }
    return found;
}

async function updateCity(id, name, state) {
    const found = await City.findByPk(id, { paranoid: false });
    if (!found) {
        throw new Error("City not found");
    }
    
    found.name = name || found.name;
    found.state = state || found.state;
    await found.save();
    
    return {
        message: "City updated successfully",
        data: found
    };
}

async function deleteCity(id) {
    const found = await City.findByPk(id);
    if (!found) {
        throw new Error("City not found");
    }
    await found.destroy();  // paranoid:true sets deletedAt
    return { message: "City deleted successfully" };
}

module.exports = {
    createCity,
    getCities,
    getCityById,
    updateCity,
    deleteCity
};
