const sequelize = require("../config/config");
const OwnerRequestModel = require("../model/owner-request");

async function ownerRequest(data) {
    const { userId, businessName, businessType, gstNumber, documents } = data;
    const t = await sequelize.transaction();
    try {
        const newRequest = await OwnerRequestModel.create({
            userId,
            businessName,
            businessType,
            gstNumber,
        }, { transaction: t });

        console.log(documents);

        const documentArray = documents ? Object.keys(documents).map((key) => ({
            document_type: key,
            document_url: documents[key].url || documents[key].document_url || "",
        })).filter(doc => doc.document_url !== "") : [];

        await t.commit(); // Commit first so the external service can see it in the DB

        if (documentArray.length > 0) {
            const documentResponse = await fetch("http://owner-document-service:3007/api/v1/owner-documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner_request_id: newRequest.id,
                    documents: documentArray,
                }),
            });

            if (!documentResponse.ok) {
                const errorText = await documentResponse.text();
                // Rollback manually since we already committed
                await OwnerRequestModel.destroy({ where: { id: newRequest.id } });
                throw new Error(`Failed to create documents. Status: ${documentResponse.status}. Msg: ${errorText}`);
            }
        }

        return {
            message: "Owner request created successfully",
            data: newRequest,
        };
    } catch (err) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error("Error creating owner request:", err);
        throw err;
    }
}

async function viewOwnerRequest() {
    // 1. Fetch requests
    const requests = await OwnerRequestModel.findAll({ raw: true });

    if (requests.length === 0) return [];

    // 2. Collect all the request IDs
    const requestIds = requests.map(req => req.id).join(',');
    console.log(requestIds);
    try {
        // 3. Fetch documents from the document service API
        const documentResponse = await fetch(`http://owner-document-service:3007/api/v1/owner-documents/bulk-by-requests?ids=${requestIds}`);
        console.log("Document Response = ", documentResponse);
        let allDocuments = [];
        if (documentResponse.ok) {
            const documentData = await documentResponse.json();
            allDocuments = documentData.data || [];
        } else {
            console.error("Failed to fetch documents from document service", await documentResponse.text());
        }

        // 4. Merge the documents with the requests
        const mergedRequests = requests.map(request => {
            return {
                ...request,
                documents: allDocuments.filter(doc => doc.ownerRequestId === request.id)
            };
        });

        // Return all requests, even those without documents
        return mergedRequests;
    } catch (err) {
        console.error("Error communicating with owner-document-service:", err);
        // Fallback: return requests with empty documents if document service fails
        return requests.map(request => ({ ...request, documents: [] }));
    }
}

async function approveRequest(id, adminUserId) {
    const request = await OwnerRequestModel.findByPk(id);
    if (!request) {
        throw new Error("Owner request not found");
    }

    if (request.status === "Approved") {
        throw new Error("Request is already approved");
    }

    request.status = "Approved";
    request.approvedBy = adminUserId || null;
    request.approvedAt = new Date();

    await request.save();
    return request;
}

module.exports = {
    ownerRequest,
    viewOwnerRequest,
    approveRequest,
};