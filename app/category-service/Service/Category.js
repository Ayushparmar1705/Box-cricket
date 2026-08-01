const { Op } = require("sequelize");
const sequelize = require("../config/config");
const category = require("../Model/Category");

async function createCategory(name) {
    const t = await sequelize.transaction();
    try {
        const newRequest = await category.create({
            name: name,
        }, { transaction: t });
        await t.commit();
        return {
            message: "Category succesfully created",
            data: newRequest
        }
    } catch (err) {
        await t.rollback();
        throw err;
    }
}

async function getCategory(status) {
    const options = { paranoid: false };
    
    if (status === "active") {
        options.paranoid = true; // Sequelize natively handles deletedAt IS NULL when paranoid is true
    } else if (status === "inactive") {
        options.where = { deletedAt: { [Op.ne]: null } };
    }

    const result = await category.findAll(options);
    return result;
}

async function deleteCategory(id) {
    const found = await category.findByPk(id);
    if (!found) {
        throw new Error("Category not found");
    }
    await found.destroy();  // paranoid:true → sets deletedAt, does NOT delete the row
    return { message: "Category deleted successfully" };
}

async function getCategoryById(id) {
    const found = await category.findByPk(id, { paranoid: false });
    if (!found) {
        throw new Error("Category not found");
    }
    return found;
}

async function updateCategory(id, name) {
    const found = await category.findByPk(id, { paranoid: false });
    if (!found) {
        throw new Error("Category not found");
    }
    
    found.name = name;
    await found.save();
    
    return {
        message: "Category updated successfully",
        data: found
    };
}

module.exports = {
    createCategory,
    getCategory,
    deleteCategory,
    getCategoryById,
    updateCategory
};