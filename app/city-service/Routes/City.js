const express = require("express");
const cityController = require("../Controller/City");
const router = express.Router();

// Create city
router.post("/city", cityController.createCity);

// Get all cities (supports :status = active/inactive/all)
router.get("/city/:status", cityController.getCities);

// Get city by id
router.get("/city-by-id/:id", cityController.getCityById);

// Update city by id
router.put("/update-city/:id", cityController.updateCity);

// Soft delete city by id
router.delete("/city/:id", cityController.deleteCity);

module.exports = router;
