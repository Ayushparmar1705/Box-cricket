const express = require("express");

// Step 1: Import the controllers
const { addVenueController, getActiveVenuesByOwnerIdController } = require("../Controller/Venue");

// Step 2: Create a new router
const router = express.Router();

const upload = require("../config/multer");

// Step 3: Define routes
// Add venue
router.post("/venue/add", upload.single("imageUrl"), addVenueController);

// Get active venues by owner ID
router.get("/venue/owner/:ownerId", getActiveVenuesByOwnerIdController);

// Step 4: Export the router so we can use it in server.js
module.exports = router;

