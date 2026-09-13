package com.venue_service.venue_service.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.venue_service.venue_service.Entity.Venueamenities;
import com.venue_service.venue_service.Repositry.Amenities;
import com.venue_service.venue_service.dto.request.AmenitiesRequestdto;

@Service
public class Amenitiesservice {

    private final Amenities rep;

    public Amenitiesservice(Amenities rep) {
        this.rep = rep;
    }

    public Venueamenities createAmenity(AmenitiesRequestdto obj) {
        if (obj.getName() == null || obj.getName().trim().isEmpty()) {
            throw new RuntimeException("Amenity name cannot be empty");
        }

        String name = obj.getName();
        boolean isExists = rep.existsByName(name);
        if (isExists) {
            throw new RuntimeException("The amenity '" + name + "' already exists");
        }

        Venueamenities amenities = new Venueamenities();
        amenities.setName(name);
        amenities.setActive(obj.getIsActive() != null ? obj.getIsActive() : true);

        return rep.save(amenities);
    }

    public List<Venueamenities> getAmenities(boolean status){
        return  rep.findByIsActive(status);
    }

    public Venueamenities changeStatus(int id, boolean status) {
        Venueamenities amenity = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("Amenity not found with id: " + id));
        amenity.setActive(status);
        return rep.save(amenity);
    }
}