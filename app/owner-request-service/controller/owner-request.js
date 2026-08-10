const OwnerRequestService = require("../service/owner-request");
const transporter = require("../config/nodemailer");
const { User } = require("../model");

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

        let mappedBusinessType = business_type;
        if (business_type === "Sole Proprietorship") {
            mappedBusinessType = "Individual";
        }

        const result = await OwnerRequestService.ownerRequest({
            userId: user_id,
            businessName: business_name,
            businessType: mappedBusinessType,
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
        console.log("Result = ", result);
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


/**
 * Controller: Approve request
 */




async function approveRequest(req, res) {
    try {
        const { id } = req.params;
        // const adminUserId = req.user.id; // If you have auth middleware

        // 1. Approve the request in the database
        const updatedRequest = await OwnerRequestService.approveRequest(id, null); // Pass adminUserId if available

        // 2. Update User Role and Send Approval Email
        try {
            const user = await User.findByPk(updatedRequest.userId);
            
            if (user) {
                // Upgrade user role to Owner
                user.role = "Owner";
                await user.save();
                console.log(`User ${user.id} role updated to Owner`);

                if (user.email) {
                    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; text-align: center; }
        .email-container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; position: relative; padding: 60px 20px 40px; }
        .header { color: #2c3e50; font-size: 28px; margin-bottom: 20px; z-index: 10; position: relative; }
        .content { color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 30px; z-index: 10; position: relative; padding: 0 20px; }
        .btn { display: inline-block; padding: 14px 30px; background-color: #27ae60; color: #ffffff !important; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; z-index: 10; position: relative; box-shadow: 0 4px 6px rgba(39, 174, 96, 0.2); transition: background-color 0.3s; }
        .btn:hover { background-color: #219653; }
        .footer { margin-top: 40px; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; z-index: 10; position: relative; }
    </style>
</head>
<body>
    <div class="email-container">
        <h1 class="header">🎉 Request Approved! 🎉</h1>
        <p class="content">
            Hello <strong>${user.name}</strong>,<br><br>
            Great news! Your owner request for <strong>${updatedRequest.businessName}</strong> has been successfully approved by the administration.<br><br>
            You can now log in and start managing your Box Cricket operations.
        </p>
       
        <div class="footer">
            &copy; ${new Date().getFullYear()} Box Cricket Admin Team
        </div>
    </div>
</body>
</html>`;

                const mailOptions = {
                    from: process.env.SMTP_USER || "noreply@boxcricket.com",
                    to: user.email,
                    subject: "🎉 Owner Request Approved!",
                    text: `Hello ${user.name},\n\nGreat news! Your owner request for ${updatedRequest.businessName} has been approved.\n\nThank you,\nAdmin Team`,
                    html: htmlTemplate,
                };
                    await transporter.sendMail(mailOptions);
                    console.log(`Approval email sent to ${user.email}`);
                }
            }
        } catch (emailError) {
            console.error("Error sending approval email:", emailError);
            // We don't return an error response here so the approval still succeeds even if email fails
        }

        return res.status(200).json({
            success: true,
            message: "Request approved successfully.",
            data: updatedRequest,
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
    viewOwnerRequest,
    approveRequest,
};