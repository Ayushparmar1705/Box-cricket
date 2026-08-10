const ownerService = require("../Service/Owner");

async function createOwner(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!email || email.trim() === "") {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "Password is required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const result = await ownerService.createOwner(name.trim(), email.trim().toLowerCase(), password);
        return res.status(201).json({
            message: result.message,
            data: result.data,
        });
    } catch (err) {
        if (err.message === "Owner already exists") {
            return res.status(409).json({ message: "Owner already exists" });
        }
        console.error("Failed to create owner", err);
        return res.status(500).json({ message: "Failed to create owner" });
    }
}

async function getOwners(req, res) {
    try {
        const { status } = req.params;
        const result = await ownerService.getOwners(status);
        return res.status(200).json({ data: result });
    } catch (err) {
        console.error("Failed to fetch owners", err);
        return res.status(500).json({ message: "Failed to fetch owners" });
    }
}

async function getOwnerById(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid owner id" });
        }
        const result = await ownerService.getOwnerById(Number(id));
        return res.status(200).json({ data: result });
    } catch (err) {
        if (err.message === "Owner not found") {
            return res.status(404).json({ message: "Owner not found" });
        }
        console.error("Failed to fetch owner", err);
        return res.status(500).json({ message: "Failed to fetch owner" });
    }
}

async function updateOwner(req, res) {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid owner id" });
        }

        const result = await ownerService.updateOwner(Number(id), name, email, password);
        return res.status(200).json({
            message: result.message,
            data: result.data,
        });
    } catch (err) {
        if (err.message === "Owner not found") {
            return res.status(404).json({ message: "Owner not found" });
        }
        console.error("Failed to update owner", err);
        return res.status(500).json({ message: "Failed to update owner" });
    }
}

async function deleteOwner(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid owner id" });
        }
        const result = await ownerService.deleteOwner(Number(id));
        return res.status(200).json({ message: result.message });
    } catch (err) {
        if (err.message === "Owner not found") {
            return res.status(404).json({ message: "Owner not found" });
        }
        console.error("Failed to delete owner", err);
        return res.status(500).json({ message: "Failed to delete owner" });
    }
}

module.exports = {
    createOwner,
    getOwners,
    getOwnerById,
    updateOwner,
    deleteOwner,
};
