package com.facility_service.facility_service.Services;

import java.util.List;

import com.facility_service.facility_service.Exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.facility_service.facility_service.Exception.ResourceAlreadyExistsException;
import com.facility_service.facility_service.Mapper.VenueMapper;
import com.facility_service.facility_service.Model.Venuemodel;
import com.facility_service.facility_service.Repositry.Venueamenitiesrepositry;
import com.facility_service.facility_service.Repositry.Venuerepositry;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;

@Service
public class Venueservice {

    // Dependencies
    private final Venuerepositry venueRepository;
    private final Venueamenitiesrepositry amenitiesRepository;
    private final VenueMapper mapper;
    private final CloudinaryService cloudinaryService;

    // Constructor Injection
    public Venueservice(Venuerepositry venueRepository,
                        Venueamenitiesrepositry amenitiesRepository,
            VenueMapper mapper,
            CloudinaryService cloudinaryService) {
        this.venueRepository = venueRepository;
        this.amenitiesRepository = amenitiesRepository;
        this.mapper = mapper;
        this.cloudinaryService = cloudinaryService;
    }

    /**
     * Create a new venue along with its amenities and image
     */
    public Venueresponsedto create(Venuerequestdto dto) {
        if (venueRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistsException("Venue already exists with name: " + dto.getName());
        }


        String imageUrl = null;
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            imageUrl = cloudinaryService.uploadVenueImage(dto.getImage());
        }

        // Step 3: Convert request DTO to Venue entity model
        Venuemodel venueModel = mapper.toEntity(dto);

        // Step 4: Set uploaded Cloudinary image URL if uploaded
        if (imageUrl != null) {
            venueModel.setImageUrl(imageUrl);
        }

        // Step 5: Save the venue model into database (cascades to amenities
        // automatically)
        Venuemodel savedVenue = venueRepository.save(venueModel);

        // Step 7: Convert saved entity model to response DTO and return
        return mapper.toResponseDto(savedVenue);
    }

    /**
     * Get all venues for a specific owner ID
     */
    public List<Venueresponsedto> getVenuesByOwnerId(int ownerId, boolean status) {
        List<Venuemodel> venues = venueRepository.findByOwnerId(ownerId, status);

        return venues.stream()
                .map(mapper::toResponseDto)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Update venue status (activate or deactivate / soft-delete)
     */
    @Transactional
    public Venuemodel toggleStatus(int venueId, boolean status) {
        Venuemodel venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + venueId));
        venue.set_active(status);
        venue.setUpdated_at(java.time.LocalDateTime.now());
        return venueRepository.save(venue);
    }
}