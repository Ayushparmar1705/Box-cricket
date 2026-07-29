const express = require("express");
const ownerRequestController = require("../controller/owner-request");
const router = express.Router();

// Submit new Owner Request (with optional documents)
router.post("/owner-request", ownerRequestController.ownerrequest);


// Get all owner requests
router.get("/get-owner-request", ownerRequestController.viewOwnerRequest);
module.exports = router;
