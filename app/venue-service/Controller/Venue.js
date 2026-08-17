const cloudinary = require("../config/cloudinary");
const { addVenue, getActiveVenuesByOwnerId } = require("../Service/Venue");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "venues" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

const addVenueController = async (req, res) => {
    try {
        // Step 1: Get the data sent from the frontend (the form data)
        // Everything the user typed in the form is stored in "req.body"
        const venueData = req.body;
        
        // Parse JSON fields if they are sent as strings
        if (typeof venueData.venueAmenities === 'string') {
            try {
                venueData.venueAmenities = JSON.parse(venueData.venueAmenities);
            } catch (e) {
                // If it fails to parse, leave it as is
            }
        }

        // Upload image to Cloudinary if a file was provided
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            venueData.imageUrl = uploadResult.secure_url;
        }

        // Step 2: Basic Validation (just checking if the name exists)
        // If there's no venue name provided, we stop here and send an error back
        if (!venueData.venueName) {
            return res.status(400).json({
                success: false,
                message: "Venue name is required!"
            });
        }

        // Step 3: Pass the form data to our Service to save it into the Database
        // We wait for it to finish and store the result in "newVenue"
        const newVenue = await addVenue(venueData);


        // Step 4: Send a successful message back to the frontend
        // 201 means "Created successfully"
        return res.status(201).json({
            success: true,
            message: "Venue added successfully!",
            data: newVenue
        });

    } catch (error) {
        // Step 5: If anything crashes or fails, we catch the error here
        console.error("Error adding venue:", error);

        // 500 means "Internal Server Error"
        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding the venue.",
            error: error.message
        });
    }
};

const getActiveVenuesByOwnerIdController = async (req, res) => {
    try {
        const { ownerId } = req.params;

        if (!ownerId || isNaN(ownerId)) {
            return res.status(400).json({
                success: false,
                message: "Valid owner ID is required."
            });
        }

        const venues = await getActiveVenuesByOwnerId(Number(ownerId));

        return res.status(200).json({
            success: true,
            message: "Active venues fetched successfully!",
            data: venues
        });
    } catch (error) {
        console.error("Error fetching active venues by owner id:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching venues.",
            error: error.message
        });
    }
};

// Export the controllers so we can use them in our routes
module.exports = {
    addVenueController,
    getActiveVenuesByOwnerIdController
};

