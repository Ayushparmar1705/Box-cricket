const express = require("express");
const ownerController = require("../Controller/Owner");
const router = express.Router();

// Create owner
router.post("/owner", ownerController.createOwner);

// Get all owners (supports :status = active/inactive/all)
router.get("/owner/:status", ownerController.getOwners);

// Get owner by id
router.get("/owner-by-id/:id", ownerController.getOwnerById);

// Update owner by id
router.put("/update-owner/:id", ownerController.updateOwner);

// Soft delete owner by id
router.delete("/owner/:id", ownerController.deleteOwner);

module.exports = router;
