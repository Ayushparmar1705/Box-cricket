
const OwnerRequest = require("../model/owner-request");


/**
 * Service: Owner request
 */
async function ownerRequest({ userId, businessName, businessType, gstNumber }) {


    await OwnerRequest.create({
        userId: userId,
        businessName: businessName.trim(),
        businessType: businessType.trim(),
        gstNumber: gstNumber.trim(),
        status: "Pending",
        adminRemark: "Pending",
        approvedBy: null,
        approvedAt: null,
    });

    return "Owner request submitted successfully";
}
module.exports = {
    ownerRequest
};
