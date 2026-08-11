const express = require("express");

// Step 1: Import the controller we just created
const { addVenueController } = require("../Controller/Venue");

// Step 2: Create a new router
const router = express.Router();

// Step 3: Define a POST route for adding a venue
// When the frontend sends a POST request to '/api/v1/venue/add', this will run our controller
router.post("/venue/add", addVenueController);

// Step 4: Export the router so we can use it in server.js
module.exports = router;
