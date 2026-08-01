const cityService = require("../Service/City");

async function createCity(req, res) {
    try {
        const { name, state } = req.body;
        if (!name || name.trim() === "" || !isNaN(name)) {
            return res.status(400).json({ message: "Invalid city name" });
        }
        if (!state || state.trim() === "" || !isNaN(state)) {
            return res.status(400).json({ message: "Invalid state name" });
        }
        
        const result = await cityService.createCity(name.trim(), state.trim());
        return res.status(201).json({
            message: result.message,
            data: result.data,
        });
    } catch (err) {
        if (err.message === "City already exists") {
            return res.status(409).json({ message: "City already exists" });
        }
        console.error("Failed to create City", err);
        return res.status(500).json({ message: "Failed to create City" });
    }
}

async function getCities(req, res) {
    try {
        const { status } = req.params;
        const result = await cityService.getCities(status);
        return res.status(200).json({ data: result });
    } catch (err) {
        console.error("Failed to fetch cities", err);
        return res.status(500).json({ message: "Failed to fetch cities" });
    }
}

async function getCityById(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid city id" });
        }
        const result = await cityService.getCityById(Number(id));
        return res.status(200).json({ data: result });
    } catch (err) {
        if (err.message === "City not found") {
            return res.status(404).json({ message: "City not found" });
        }
        console.error("Failed to fetch city", err);
        return res.status(500).json({ message: "Failed to fetch city" });
    }
}

async function updateCity(req, res) {
    try {
        const { id } = req.params;
        const { name, state } = req.body;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid city id" });
        }
        
        const result = await cityService.updateCity(Number(id), name, state);
        return res.status(200).json({
            message: result.message,
            data: result.data
        });
    } catch (err) {
        if (err.message === "City not found") {
            return res.status(404).json({ message: "City not found" });
        }
        console.error("Failed to update City", err);
        return res.status(500).json({ message: "Failed to update City" });
    }
}

async function deleteCity(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid city id" });
        }
        const result = await cityService.deleteCity(Number(id));
        return res.status(200).json({ message: result.message });
    } catch (err) {
        if (err.message === "City not found") {
            return res.status(404).json({ message: "City not found" });
        }
        console.error("Failed to delete City", err);
        return res.status(500).json({ message: "Failed to delete City" });
    }
}

module.exports = {
    createCity,
    getCities,
    getCityById,
    updateCity,
    deleteCity
};
