const express = require("express");
const ownerRequestController = require("../controller/owner-request");
const router = express.Router();

/**
 * @swagger
 * /api/v1/owner-request:
 *   post:
 *     summary: Submit a new owner verification request
 *     tags: [Owner Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - business_name
 *               - business_type
 *               - gst_number
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               business_name:
 *                 type: string
 *                 example: Royal Turf Arena
 *               business_type:
 *                 type: string
 *                 example: Box Cricket
 *               gst_number:
 *                 type: string
 *                 example: 22AAAAA0000A1Z5
 *     responses:
 *       201:
 *         description: Owner request submitted successfully
 *       400:
 *         description: Validation error or missing required fields
 */
router.post("/owner-request", ownerRequestController.ownerrequest);

module.exports = router;
