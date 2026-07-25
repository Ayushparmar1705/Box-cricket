const OwnerRequest = require("./owner-request");
const OwnerDocument = require("./owner-document");

// Association: An OwnerRequest has many OwnerDocuments
OwnerRequest.hasMany(OwnerDocument, { foreignKey: "ownerRequestId", as: "documents" });
OwnerDocument.belongsTo(OwnerRequest, { foreignKey: "ownerRequestId", as: "request" });

module.exports = {
    OwnerRequest,
    OwnerDocument,
};
