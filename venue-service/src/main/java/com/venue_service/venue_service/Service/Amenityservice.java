package com.venue_service.venue_service.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.venue_service.venue_service.Entity.Amenityentity;
import com.venue_service.venue_service.Repositry.Amenityrepositry;
import com.venue_service.venue_service.dto.request.AmenitiesRequestdto;

@Service
public class Amenityservice {

    private final Amenityrepositry rep;

    public Amenityservice(Amenityrepositry rep) {
        this.rep = rep;
    }

    public Amenityentity createAmenity(AmenitiesRequestdto obj) {
        if (obj.getName() == null || obj.getName().trim().isEmpty()) {
            throw new RuntimeException("Amenity name cannot be empty");
        }

        String name = obj.getName();
        boolean isExists = rep.existsByName(name);
        if (isExists) {
            throw new RuntimeException("The amenity '" + name + "' already exists");
        }

        Amenityentity amenities = new Amenityentity();
        amenities.setName(name);
        amenities.setActive(obj.getIsActive() != null ? obj.getIsActive() : true);

        return rep.save(amenities);
    }

    public List<Amenityentity> getAmenities(boolean status) {
        return rep.findByIsActive(status);
    }

    public Amenityentity changeStatus(int id, boolean status) {
        Amenityentity amenity = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("Amenity not found with id: " + id));
        amenity.setActive(status);
        return rep.save(amenity);
    }

    public Amenityentity getAmenityById(int id) {
        Optional<Amenityentity> amenity = rep.findById(id);
        if (amenity.isPresent()) {
            return amenity.get();
        } else {
            throw new RuntimeException("Amenity not found with id: " + id);
        }
    }

}