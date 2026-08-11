const addVenueService = require("../Service/Venue");

const addVenueController = async (req, res) => {
    try {
        // Step 1: Get the data sent from the frontend (the form data)
        // Everything the user typed in the form is stored in "req.body"
        const venueData = req.body;

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
        const newVenue = await addVenueService(venueData);

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

// Export the controller so we can use it in our routes
module.exports = {
    addVenueController
};
