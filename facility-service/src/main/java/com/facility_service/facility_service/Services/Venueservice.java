package com.facility_service.facility_service.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facility_service.facility_service.Exception.ResourceAlreadyExistsException;
import com.facility_service.facility_service.Mapper.VenueMapper;
import com.facility_service.facility_service.Model.Venueamenitiesmodel;
import com.facility_service.facility_service.Model.Venuemodel;
import com.facility_service.facility_service.Repositry.Venueamenitiesrepositry;
import com.facility_service.facility_service.Repositry.Venuerepositry;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;

@Service
public class Venueservice {

    // Repositories for database operations
    private final Venuerepositry venueRepository;
    private final Venueamenitiesrepositry amenitiesRepository;
    private final VenueMapper mapper;

    // Constructor Injection (Spring automatically injects these dependencies)
    public Venueservice(Venuerepositry venueRepository, 
                        Venueamenitiesrepositry amenitiesRepository, 
                        VenueMapper mapper) {
        this.venueRepository = venueRepository;
        this.amenitiesRepository = amenitiesRepository;
        this.mapper = mapper;
    }

    /**
     * Create a new venue along with its amenities
     */
    public Venueresponsedto create(Venuerequestdto dto) {
        // Step 1: Check if a venue with the same name already exists in database
        if (venueRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistsException("Venue already exists with name: " + dto.getName());
        }

        // Step 2: Save amenities first (if provided) using Venueamenitiesrepositry
        List<Venueamenitiesmodel> amenities = dto.getVenue_amenities();
        if (amenities != null && !amenities.isEmpty()) {
            amenitiesRepository.saveAll(amenities);
        }

        // Step 3: Convert request DTO to Venue entity model
        Venuemodel venueModel = mapper.toEntity(dto);

        // Step 4: Save the venue model into database using Venuerepositry
        Venuemodel savedVenue = venueRepository.save(venueModel);

        // Step 5: Convert saved entity model to response DTO and return
        return mapper.toResponseDto(savedVenue);
    }
}
