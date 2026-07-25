const express = require("express");
const controller = require("../controller/owner-document");

const router = express.Router();

/**
 * @route   POST /api/v1/owner-documents
 * @desc    Upload / attach multiple documents to an existing owner request
 */
router.post("/owner-documents", controller.uploadDocuments);

/**
 * @route   GET /api/v1/owner-documents/request/:ownerRequestId
 * @desc    Get all documents for a specific owner request ID
 */
router.get("/owner-documents/request/:ownerRequestId", controller.getDocumentsByRequestId);

/**
 * @route   GET /api/v1/owner-documents/:documentId
 * @desc    Get details of a single document by ID
 */
router.get("/owner-documents/:documentId", controller.getDocumentById);

/**
 * @route   PATCH /api/v1/owner-documents/:documentId/status
 * @desc    Admin: Update document verification status (PENDING, VERIFIED, REJECTED)
 */
router.patch("/owner-documents/:documentId/status", controller.updateDocumentStatus);

/**
 * @route   DELETE /api/v1/owner-documents/:documentId
 * @desc    Delete a document record by ID
 */
router.delete("/owner-documents/:documentId", controller.deleteDocument);

module.exports = router;
