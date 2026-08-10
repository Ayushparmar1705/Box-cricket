const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const JWT_SECRET = process.env.JWT_SECRET || "box_cricket_super_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

/**
 * Service: Register new user in database
 */
async function registerUser({ name, email, password, role, phoneNumber }) {
    const existingUser = await User.findOne({
        where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
        throw new Error("User with this email already exists.");
    }

    if (phoneNumber) {
        const existingPhone = await User.findOne({
            where: { phoneNumber: phoneNumber.trim() },
        });
        if (existingPhone) {
            throw new Error("User with this phone number already exists.");
        }
    }

    await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role || "Player",
        phoneNumber: phoneNumber ? phoneNumber.trim() : null,
        isActive: true,
    });

    return "User registered successfully";
}

/**
 * Service: Authenticate user login
 */
async function loginUser({ email, password }) {
    console.log("email", email);
    console.log("password", password);
    const user = await User.findOne({
        where: { email: email.trim().toLowerCase() },
    });
    console.log("user", user);
    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (!user.isActive) {
        throw new Error("Account is deactivated. Please contact administrator.");
    }

    const isMatch = password === user.password;
    if (!isMatch) {
        throw new Error("Invalid email or password.");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const userJson = user.toJSON();
    delete userJson.password;

    return {
        token,
        user: userJson,
    };
}

/**
 * Service: Get user by ID
 */
async function getUserById(userId) {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        throw new Error("User profile not found.");
    }

    return user;
}


module.exports = {
    registerUser,
    loginUser,
    getUserById,
};
