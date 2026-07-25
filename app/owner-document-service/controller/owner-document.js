const OwnerDocumentService = require("../service/owner-document");

/**
 * Controller: Handle bulk upload of documents for an owner request
 */
async function uploadDocuments(req, res) {
    try {
        const { owner_request_id, documents } = req.body;

        if (!owner_request_id || !documents) {
            return res.status(400).json({
                success: false,
                message: "'owner_request_id' and 'documents' array are required.",
            });
        }

        const createdDocs = await OwnerDocumentService.addDocuments({
            ownerRequestId: owner_request_id,
            documents,
        });

        return res.status(201).json({
            success: true,
            message: "Documents uploaded successfully.",
            data: createdDocs,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

/**
 * Controller: Get all attached documents for a specific owner request
 */
async function getDocumentsByRequestId(req, res) {
    try {
        const { ownerRequestId } = req.params;
        const docs = await OwnerDocumentService.getDocumentsByRequestId(ownerRequestId);

        return res.status(200).json({
            success: true,
            count: docs.length,
            data: docs,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

/**
 * Controller: Get details of a single document by ID
 */
async function getDocumentById(req, res) {
    try {
        const { documentId } = req.params;
        const document = await OwnerDocumentService.getDocumentById(documentId);

        return res.status(200).json({
            success: true,
            data: document,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

/**
 * Controller: Update verification status of a document (Admin endpoint)
 */
async function updateDocumentStatus(req, res) {
    try {
        const { documentId } = req.params;
        const { verification_status } = req.body;

        if (!verification_status) {
            return res.status(400).json({
                success: false,
                message: "'verification_status' (PENDING, VERIFIED, REJECTED) is required.",
            });
        }

        const updatedDoc = await OwnerDocumentService.updateDocumentStatus({
            documentId,
            verificationStatus: verification_status,
        });

        return res.status(200).json({
            success: true,
            message: "Document verification status updated successfully.",
            data: updatedDoc,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

/**
 * Controller: Delete a document by ID
 */
async function deleteDocument(req, res) {
    try {
        const { documentId } = req.params;
        const result = await OwnerDocumentService.deleteDocument(documentId);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    uploadDocuments,
    getDocumentsByRequestId,
    getDocumentById,
    updateDocumentStatus,
    deleteDocument,
};
