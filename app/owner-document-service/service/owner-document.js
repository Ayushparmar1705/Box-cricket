const { OwnerDocument, OwnerRequest } = require("../model");

/**
 * Service: Attach multiple documents to an existing Owner Request
 * @param {Object} params
 * @param {number|string} params.ownerRequestId
 * @param {Array} params.documents
 */
async function addDocuments({ ownerRequestId, documents }) {
    const parsedRequestId = parseInt(ownerRequestId, 10);
    if (isNaN(parsedRequestId)) {
        throw new Error("Invalid owner request ID provided.");
    }

    // Verify that the owner request exists
    const request = await OwnerRequest.findByPk(parsedRequestId);
    if (!request) {
        throw new Error(`Owner request with ID ${parsedRequestId} does not exist.`);
    }

    if (!Array.isArray(documents) || documents.length === 0) {
        throw new Error("Documents list must be a non-empty array.");
    }

    // Map incoming array into database entry format
    const documentEntries = documents.map((doc) => {
        const type = doc.document_type || doc.documentType;
        const url = doc.document_url || doc.documentUrl;

        if (!type || !url) {
            throw new Error("Each document must include 'document_type' and 'document_url'.");
        }

        return {
            ownerRequestId: parsedRequestId,
            documentType: type.toUpperCase(),
            documentUrl: url,
            verificationStatus: "PENDING",
            uploadedAt: new Date(),
        };
    });

    const createdDocs = await OwnerDocument.bulkCreate(documentEntries);
    return createdDocs;
}

/**
 * Service: Retrieve all documents submitted for a specific owner request
 * @param {number|string} ownerRequestId
 */
async function getDocumentsByRequestId(ownerRequestId) {
    const parsedRequestId = parseInt(ownerRequestId, 10);
    if (isNaN(parsedRequestId)) {
        throw new Error("Invalid owner request ID.");
    }

    const docs = await OwnerDocument.findAll({
        where: { ownerRequestId: parsedRequestId },
        order: [["uploadedAt", "DESC"]],
    });

    return docs;
}

/**
 * Service: Retrieve details of a single document by ID
 * @param {number|string} documentId
 */
async function getDocumentById(documentId) {
    const parsedId = parseInt(documentId, 10);
    if (isNaN(parsedId)) {
        throw new Error("Invalid document ID.");
    }

    const document = await OwnerDocument.findByPk(parsedId, {
        include: [
            {
                model: OwnerRequest,
                as: "request",
                attributes: ["id", "userId", "businessName", "status"],
            },
        ],
    });

    if (!document) {
        throw new Error(`Document with ID ${parsedId} not found.`);
    }

    return document;
}

/**
 * Service: Update document verification status (PENDING, VERIFIED, REJECTED)
 * @param {Object} params
 * @param {number|string} params.documentId
 * @param {string} params.verificationStatus
 */
async function updateDocumentStatus({ documentId, verificationStatus }) {
    const parsedId = parseInt(documentId, 10);
    if (isNaN(parsedId)) {
        throw new Error("Invalid document ID.");
    }

    const validStatuses = ["PENDING", "VERIFIED", "REJECTED"];
    const normalizedStatus = verificationStatus ? verificationStatus.toUpperCase() : "";

    if (!validStatuses.includes(normalizedStatus)) {
        throw new Error(`Invalid verification status. Must be one of: ${validStatuses.join(", ")}.`);
    }

    const document = await OwnerDocument.findByPk(parsedId);
    if (!document) {
        throw new Error(`Document with ID ${parsedId} not found.`);
    }

    document.verificationStatus = normalizedStatus;
    await document.save();

    return document;
}

/**
 * Service: Delete a document record by ID
 * @param {number|string} documentId
 */
async function deleteDocument(documentId) {
    const parsedId = parseInt(documentId, 10);
    if (isNaN(parsedId)) {
        throw new Error("Invalid document ID.");
    }

    const document = await OwnerDocument.findByPk(parsedId);
    if (!document) {
        throw new Error(`Document with ID ${parsedId} not found.`);
    }

    await document.destroy();
    return { message: `Document with ID ${parsedId} deleted successfully.` };
}

module.exports = {
    addDocuments,
    getDocumentsByRequestId,
    getDocumentById,
    updateDocumentStatus,
    deleteDocument,
};
