const categoryservice = require("../Service/Category");
async function createCategory(req, res) {
    try {
        const { name } = req.body;
        if (name === "" || !isNaN(name)) {
            return res.status(400).json({
                message: "Invalid category name",
            });
        }
        const result = await categoryservice.createCategory(name);
        return res.status(200).json({
            message: result.message,
            data: result,
        });
    } catch (err) {
        console.error("Failed to create Category", err);
        return res.status(500).json({
            message: "Failed to create Category",
        });
    }
}

async function getCategory(req, res) {
    try {
        const { status } = req.params;
        console.log(status);
        const result = await categoryservice.getCategory(status);
        return res.status(200).json({
            data: result,
        });
    } catch (err) {
        return res.status(400).json({ message: "Failed to fetch category" });
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid category id" });
        }
        const result = await categoryservice.deleteCategory(Number(id));
        return res.status(200).json({ message: result.message });
    } catch (err) {
        if (err.message === "Category not found") {
            return res.status(404).json({ message: "Category not found" });
        }
        console.error("Failed to delete Category", err);
        return res.status(500).json({ message: "Failed to delete Category" });
    }
}

async function getCategoryById(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid category id" });
        }
        const result = await categoryservice.getCategoryById(Number(id));
        return res.status(200).json({ data: result });
    } catch (err) {
        if (err.message === "Category not found") {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(500).json({ message: "Failed to fetch category" });
    }
}

async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid category id" });
        }
        if (!name || name.trim() === "" || !isNaN(name)) {
            return res.status(400).json({ message: "Invalid category name" });
        }
        
        const result = await categoryservice.updateCategory(Number(id), name.trim());
        return res.status(200).json({
            message: result.message,
            data: result.data
        });
    } catch (err) {
        if (err.message === "Category not found") {
            return res.status(404).json({ message: "Category not found" });
        }
        console.error("Failed to update Category", err);
        return res.status(500).json({ message: "Failed to update Category" });
    }
}

module.exports = {
    createCategory,
    getCategory,
    deleteCategory,
    getCategoryById,
    updateCategory
}