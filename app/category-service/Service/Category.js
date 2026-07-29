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

async function getCategory() {
    const result = await category.findAll();
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

module.exports = {
    createCategory,
    getCategory,
    deleteCategory
};