const OwnerRequestService = require("../service/owner-request");

/**
 * Controller: Handle Owner request
 */
async function ownerrequest(req, res) {
    try {
        const { user_id, business_name, business_type, gst_number } = req.body;

        if (!user_id || !business_name || !business_type || !gst_number) {
            return res.status(400).json({
                success: false,
                message: "User name, business name, business type, and GST number are required.",
            });
        }

        const message = await OwnerRequestService.ownerRequest({
            userId: user_id,
            businessName: business_name,
            businessType: business_type,
            gstNumber: gst_number
        });

        return res.status(201).json({
            success: true,
            message: message,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}


module.exports = {
    ownerrequest,
};