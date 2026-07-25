const userService = require("../service/User");

/**
 * Controller: Handle User Registration HTTP Request
 */
async function register(req, res) {
    try {
        const { name, email, password, role, phoneNumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
            });
        }

        const message = await userService.registerUser({ name, email, password, role, phoneNumber });

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

/**
 * Controller: Handle User Login HTTP Request
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const result = await userService.loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

/**
 * Controller: Handle Fetch Profile HTTP Request
 */
async function getProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await userService.getUserById(userId);

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    register,
    login,
    getProfile,
};