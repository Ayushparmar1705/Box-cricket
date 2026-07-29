const { OwnerRequest, OwnerDocument, User } = require("../model");
const sequelize = require("../config/config");

/**
 * Service: Submit new Owner request along with optional multiple documents
 */
async function ownerRequest({ userId, businessName, businessType, gstNumber, documents }) {
    const t = await sequelize.transaction();
    try {
        const newRequest = await OwnerRequest.create({
            userId: userId,
            businessName: businessName.trim(),
            businessType: businessType.trim(),
            gstNumber: gstNumber.trim(),
            status: "Pending",
            adminRemark: "Pending",
            approvedBy: null,
            approvedAt: null,
        }, { transaction: t });

        if (Array.isArray(documents) && documents.length > 0) {
            const documentEntries = documents.map((doc) => ({
                ownerRequestId: newRequest.id,
                documentType: doc.document_type || doc.documentType,
                documentUrl: doc.document_url || doc.documentUrl,
                verificationStatus: "PENDING",
                uploadedAt: new Date(),
            }));
            await OwnerDocument.bulkCreate(documentEntries, { transaction: t });
        }

        await t.commit();
        return {
            message: "Owner request and documents submitted successfully",
            ownerRequestId: newRequest.id,
        };
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

/**
 * Service: View all owner requests with associated user & document details
 */
async function viewOwnerRequest() {
    const reqs = await OwnerRequest.findAll({
        include: [
            {
                model: User,
                as: "owner",
                attributes: ["id", "name", "email", "phoneNumber", "role"],
            },
            {
                model: OwnerDocument,
                as: "documents",
            },
        ],
        order: [["created_at", "DESC"]],
    });
    return reqs;
}

module.exports = {
    ownerRequest,
    viewOwnerRequest,
};
