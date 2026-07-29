const express = require("express");
const categoryController = require("../Controller/Category");
const router = express.Router();

// Create category
router.post("/category", categoryController.createCategory);

// Get all categories
router.get("/category", categoryController.getCategory);

// Soft delete category by id
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;
