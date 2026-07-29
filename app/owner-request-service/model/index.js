const User = require("./User");
const OwnerRequest = require("./owner-request");
const OwnerDocument = require("./owner-document");

// User <-> OwnerRequest
User.hasMany(OwnerRequest, { foreignKey: "userId", as: "ownerRequests" });
OwnerRequest.belongsTo(User, { foreignKey: "userId", as: "owner" });

User.hasMany(OwnerRequest, { foreignKey: "approvedBy", as: "approvedRequests" });
OwnerRequest.belongsTo(User, { foreignKey: "approvedBy", as: "approvedByAdmin" });

// OwnerRequest <-> OwnerDocument
OwnerRequest.hasMany(OwnerDocument, { foreignKey: "ownerRequestId", as: "documents" });
OwnerDocument.belongsTo(OwnerRequest, { foreignKey: "ownerRequestId", as: "request" });

module.exports = {
    User,
    OwnerRequest,
    OwnerDocument,
};
