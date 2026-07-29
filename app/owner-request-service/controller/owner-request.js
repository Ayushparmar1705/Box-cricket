const OwnerRequestService = require("../service/owner-request");

/**
 * Controller: Handle Owner request submission
 */
async function ownerrequest(req, res) {
    try {
        const { user_id, business_name, business_type, gst_number, documents } = req.body;

        if (!user_id || !business_name || !business_type || !gst_number) {
            return res.status(400).json({
                success: false,
                message: "User ID, business name, business type, and GST number are required.",
            });
        }

        const result = await OwnerRequestService.ownerRequest({
            userId: user_id,
            businessName: business_name,
            businessType: business_type,
            gstNumber: gst_number,
            documents: documents,
        });

        return res.status(201).json({
            success: true,
            message: typeof result === "string" ? result : result.message,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}


/**
 * Controller: View all owner requests
 */
async function viewOwnerRequest(req, res) {
    try {
        const result = await OwnerRequestService.viewOwnerRequest();

        return res.status(200).json({
            success: true,
            count: result.length,
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

module.exports = {
    ownerrequest,
    viewOwnerRequest,
};