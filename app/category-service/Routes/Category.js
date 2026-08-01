const express = require("express");
const categoryController = require("../Controller/Category");
const router = express.Router();

// Create category
router.post("/category", categoryController.createCategory);

// Get all categories and by status
router.get("/category/:status", categoryController.getCategory);

// Soft delete category by id
router.delete("/category/:id", categoryController.deleteCategory);

// Get category by id
router.get("/category-by-id/:id", categoryController.getCategoryById);

// Update category by id
router.put("/update-category/:id", categoryController.updateCategory);
module.exports = router;
