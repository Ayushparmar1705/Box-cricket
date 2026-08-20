const Venue = require("../Model/Venue");
const VenueImage = require("../Model/VenueImage");
const sequelize = require("../config/config");

const addVenue = async (data) => {
    // Start a transaction. 
    // This ensures that if the image fails to save, the venue won't be saved either.
    const transaction = await sequelize.transaction();

    try {
        // Auto-generate Google Map Link if not already provided
        if (!data.googleMapLink && data.latitude && data.longitude) {
            data.googleMapLink = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
        }

        // Step 1: Save the basic venue details in the database
        // We pass { transaction } so Sequelize knows this is part of our safe transaction
        const newVenue = await Venue.create(data, { transaction: transaction });

        // Step 2: Check if an image URL is provided from the form field
        // We are assuming the form sends the image as "data.imageUrl"
        if (data.imageUrl) {
            
            // Save the single image in the VenueImage table
            await VenueImage.create({
                venueId: newVenue.id,      // Link this image to the venue we just created
                imageUrl: data.imageUrl,   // The single image URL from the form
                isCover: true              // Since it's the only image, we make it the cover
            }, { transaction: transaction });
            
        }

        // Step 3: If everything above was successful, commit (save) the changes to the database
        await transaction.commit();

        // Finally, return the created venue back to the controller
        return newVenue;

    } catch (error) {
        // If any error happens during Step 1 or Step 2, rollback (undo) everything
        await transaction.rollback();
        
        // Pass the error to the controller so it can send a proper response to the frontend
        throw error;
    }
};

const getActiveVenuesByOwnerId = async (ownerId) => {
    try {
        const venues = await Venue.findAll({
            where: {
                ownerId: ownerId,
                status: "ACTIVE",
                isActive: true
            },
            include: [
                {
                    model: VenueImage,
                    as: "images"
                }
            ],
            order: [["createdAt", "DESC"]]
        });
        return venues;
    } catch (error) {
        throw error;
    }
};

// Exporting using CommonJS (since your models use module.exports)
module.exports = {
    addVenue,
    getActiveVenuesByOwnerId
};
