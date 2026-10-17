package com.facility_service.facility_service.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.facility_service.facility_service.Model.Venueamenitiesmodel;
import com.facility_service.facility_service.Exception.ResourceNotFoundException;
import com.facility_service.facility_service.dto.Requestdto.Updatevenuerequestdto;
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
    private Venuerepositry venueRepository;
    private Venueamenitiesrepositry amenitiesRepository;
    private VenueMapper mapper;
    private CloudinaryService cloudinaryService;

    // Default Constructor
    public Venueservice() {
    }

    // Constructor Injection
    @org.springframework.beans.factory.annotation.Autowired
    public Venueservice(Venuerepositry venueRepository,
            Venueamenitiesrepositry amenitiesRepository,
            VenueMapper mapper,
            CloudinaryService cloudinaryService) {
        this.venueRepository = venueRepository;
        this.amenitiesRepository = amenitiesRepository;
        this.mapper = mapper;
        this.cloudinaryService = cloudinaryService;
    }

    // ==========================================
    // Getter and Setter Methods
    // ==========================================

    public Venuerepositry getVenueRepository() {
        return venueRepository;
    }

    public void setVenueRepository(Venuerepositry venueRepository) {
        this.venueRepository = venueRepository;
    }

    public Venueamenitiesrepositry getAmenitiesRepository() {
        return amenitiesRepository;
    }

    public void setAmenitiesRepository(Venueamenitiesrepositry amenitiesRepository) {
        this.amenitiesRepository = amenitiesRepository;
    }

    public VenueMapper getMapper() {
        return mapper;
    }

    public void setMapper(VenueMapper mapper) {
        this.mapper = mapper;
    }

    public CloudinaryService getCloudinaryService() {
        return cloudinaryService;
    }

    public void setCloudinaryService(CloudinaryService cloudinaryService) {
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

    @Transactional
    public Venuemodel update(Updatevenuerequestdto dto) {
        Venuemodel model = venueRepository.findById(dto.getVenue_id())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + dto.getVenue_id()));

        // Set venue details from DTO getters to model setters
        if (dto.getName() != null && !dto.getName().isBlank()) {
            model.setName(dto.getName());
        }
        if (dto.getCity() != null && !dto.getCity().isBlank()) {
            model.setCity(dto.getCity());
        }
        if (dto.getDescription() != null) {
            model.setDescription(dto.getDescription());
        }
        if (dto.getAddress() != null) {
            model.setAddress(dto.getAddress());
        }
        if (dto.getLongitude() != 0.0) {
            model.setLongitude(dto.getLongitude());
        }
        if (dto.getLatitude() != 0.0) {
            model.setLatitude(dto.getLatitude());
        }
        if (dto.getGoogle_map_link() != null) {
            model.setGoogle_map_link(dto.getGoogle_map_link());
        }
        if (dto.getPhone_number() != null) {
            model.setPhone_number(dto.getPhone_number());
        }
        if (dto.getEmail() != null) {
            model.setEmail(dto.getEmail());
        }
        if (dto.getOpening_time() != null) {
            model.setOpening_time(dto.getOpening_time());
        }
        if (dto.getClosing_time() != null) {
            model.setClosing_time(dto.getClosing_time());
        }
        if (dto.getCancellation_policy() != null) {
            model.setCancellation_policy(dto.getCancellation_policy());
        }

        // Upload and set new image if provided
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String imageUrl = cloudinaryService.uploadVenueImage(dto.getImage());
            model.setImageUrl(imageUrl);
        } else if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            model.setImageUrl(dto.getImageUrl());
        }

        // Update amenities
        if (dto.getVenue_amenities() != null && !dto.getVenue_amenities().isBlank()) {
            if (model.getVenue_amenities() != null) {
                model.getVenue_amenities().clear();
            } else {
                model.setVenue_amenities(new ArrayList<>());
            }
            String[] parts = dto.getVenue_amenities().split(",");
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    model.getVenue_amenities().add(new Venueamenitiesmodel(model, trimmed));
                }
            }
        }

        model.setUpdated_at(java.time.LocalDateTime.now());

        return venueRepository.save(model);
    }
}