const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../Config/config");
const Owner = require("../Model/Owner");

async function createOwner(name, email, password, phoneNumber) {
    const t = await sequelize.transaction();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = await Owner.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        }, { transaction: t });
        await t.commit();

        // Exclude password from response
        const { password: _pwd, ...ownerData } = newOwner.toJSON();
        return {
            message: "Owner created successfully",
            data: ownerData,
        };
    } catch (err) {
        await t.rollback();
        if (err.name === "SequelizeUniqueConstraintError") {
            throw new Error("Owner already exists");
        }
        throw err;
    }
}

async function getOwners(status) {
    const options = { paranoid: false, attributes: { exclude: ["password"] } };

    if (status === "active") {
        options.paranoid = true;
    } else if (status === "inactive") {
        options.where = { deletedAt: { [Op.ne]: null } };
    }

    const result = await Owner.findAll(options);
    return result;
}

async function getOwnerById(id) {
    const found = await Owner.findByPk(id, {
        paranoid: false,
        attributes: { exclude: ["password"] },
    });
    if (!found) {
        throw new Error("Owner not found");
    }
    return found;
}

async function updateOwner(id, name, email, password, phoneNumber) {
    const found = await Owner.findByPk(id, { paranoid: false });
    if (!found) {
        throw new Error("Owner not found");
    }

    found.name = name || found.name;
    found.email = email || found.email;
    found.phoneNumber = phoneNumber || found.phoneNumber;

    if (password) {
        found.password = await bcrypt.hash(password, 10);
    }

    await found.save();

    const { password: _pwd, ...ownerData } = found.toJSON();
    return {
        message: "Owner updated successfully",
        data: ownerData,
    };
}

async function deleteOwner(id) {
    const found = await Owner.findByPk(id);
    if (!found) {
        throw new Error("Owner not found");
    }
    await found.destroy(); // paranoid: true sets deletedAt
    return { message: "Owner deleted successfully" };
}

module.exports = {
    createOwner,
    getOwners,
    getOwnerById,
    updateOwner,
    deleteOwner,
};
