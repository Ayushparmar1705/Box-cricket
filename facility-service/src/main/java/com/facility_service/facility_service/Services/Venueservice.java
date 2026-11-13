package com.facility_service.facility_service.Services;

import java.util.ArrayList;
import java.util.List;

import com.facility_service.facility_service.Mapper.CourtMapper;
import com.facility_service.facility_service.Model.CourtEntity;
import com.facility_service.facility_service.Model.Venueamenitiesmodel;
import com.facility_service.facility_service.Exception.ResourceNotFoundException;
import com.facility_service.facility_service.Repositry.CourtRepository;
import com.facility_service.facility_service.dto.Requestdto.Updatevenuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.CourtResponseDto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.facility_service.facility_service.Exception.ResourceAlreadyExistsException;
import com.facility_service.facility_service.Mapper.VenueMapper;
import com.facility_service.facility_service.Model.Venuemodel;
import com.facility_service.facility_service.Repositry.Venueamenitiesrepositry;
import com.facility_service.facility_service.Repositry.Venuerepositry;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;

/**
 * ============================================================================
 * Service: Venueservice
 * Description: Business logic for managing venues and their courts.
 *              Written in simple, clear, and beginner-friendly Java.
 * ============================================================================
 */
@Service
public class Venueservice {

    private final Venuerepositry venueRepository;
    private final Venueamenitiesrepositry amenitiesRepository;
    private final VenueMapper mapper;
    private final CloudinaryService cloudinaryService;
    private final CourtRepository courtRepository;
    private final CourtMapper courtMapper;

    public Venueservice(Venuerepositry venueRepository,
                        Venueamenitiesrepositry amenitiesRepository,
                        VenueMapper mapper,
                        CloudinaryService cloudinaryService,
                        CourtRepository courtRepository,
                        CourtMapper courtMapper) {
        this.venueRepository = venueRepository;
        this.amenitiesRepository = amenitiesRepository;
        this.mapper = mapper;
        this.cloudinaryService = cloudinaryService;
        this.courtRepository = courtRepository;
        this.courtMapper = courtMapper;
    }

    /**
     * Create a new venue along with its amenities and image
     */
    public Venueresponsedto create(Venuerequestdto dto) {
        if (venueRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistsException("Venue already exists with name: " + dto.getName());
        }

        // Upload image to Cloudinary if provided
        String imageUrl = null;
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            imageUrl = cloudinaryService.uploadVenueImage(dto.getImage());
        }

        // Convert DTO to Entity
        Venuemodel venueModel = mapper.toEntity(dto);
        if (imageUrl != null) {
            venueModel.setImageUrl(imageUrl);
        }

        // Save venue to database
        Venuemodel savedVenue = venueRepository.save(venueModel);

        return mapper.toResponseDto(savedVenue);
    }

    /**
     * Get single venue by ID along with its courts for booking.
     *
     * Simple Step-by-Step Flow:
     * 1. Find the venue in database. If not found, throw 404 exception.
     * 2. Convert venue entity to response DTO.
     * 3. Find active courts for this venue.
     * 4. Convert court entities to court DTOs (includes images and pricing rules).
     * 5. Set the courts list into the venue DTO and return.
     */
    @Transactional(readOnly = true)
    public Venueresponsedto getVenueById(int id) {
        // Step 1: Find venue
        Venuemodel venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

        // Step 2: Convert to DTO
        Venueresponsedto responseDto = mapper.toResponseDto(venue);

        // Step 3: Fetch active courts for this venue
        List<CourtEntity> courts = courtRepository.findByVenueIdAndIsActive(id, true);

        // If no active courts found, fallback to all courts
        if (courts.isEmpty()) {
            courts = courtRepository.findByVenueId(id);
        }

        // Step 4: Convert courts to response DTOs
        List<CourtResponseDto> courtDtos = courtMapper.toResponseDtoList(courts);

        // Step 5: Attach courts to the venue response
        responseDto.setCourts(courtDtos != null ? courtDtos : new ArrayList<>());

        return responseDto;
    }

    /**
     * Get courts for a specific venue
     */
    @Transactional(readOnly = true)
    public List<CourtResponseDto> getCourtsByVenueId(int venueId, boolean activeOnly) {
        if (!venueRepository.existsById(venueId)) {
            throw new ResourceNotFoundException("Venue not found with id: " + venueId);
        }

        List<CourtEntity> courts;
        if (activeOnly) {
            courts = courtRepository.findByVenueIdAndIsActive(venueId, true);
        } else {
            courts = courtRepository.findByVenueId(venueId);
        }

        return courtMapper.toResponseDtoList(courts);
    }

    /**
     * Get all venues matching optional filters (city, status, search keyword)
     */
    @Transactional(readOnly = true)
    public List<Venueresponsedto> getAllVenues(
            Integer ownerId,
            String city,
            Boolean isActive,
            String search,
            String name) {

        Specification<Venuemodel> spec = Venuespecification.filter(ownerId, city, isActive, search, name);
        List<Venuemodel> venues = venueRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "id"));

        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venues) {
            resultList.add(mapper.toResponseDto(venue));
        }

        return resultList;
    }

    /**
     * Get all venues for a specific owner ID
     */
    public List<Venueresponsedto> getVenuesByOwnerId(int ownerId, boolean status) {
        List<Venuemodel> venues = venueRepository.findByOwnerId(ownerId, status);

        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venues) {
            resultList.add(mapper.toResponseDto(venue));
        }
        return resultList;
    }

    /**
     * Toggle venue status (activate / deactivate)
     */
    @Transactional
    public Venuemodel toggleStatus(int venueId, boolean status) {
        Venuemodel venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + venueId));

        venue.set_active(status);
        venue.setUpdated_at(java.time.LocalDateTime.now());
        return venueRepository.save(venue);
    }

    /**
     * Update venue details
     */
    @Transactional
    @CacheEvict(value = "venueSearch", allEntries = true)
    public Venuemodel update(Updatevenuerequestdto dto) {
        Venuemodel model = venueRepository.findById(dto.getVenue_id())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + dto.getVenue_id()));

        // Update basic fields if provided
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

    /**
     * Search venues by city
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "venueSearch", key = "'venue_search' + #search")
    public List<Venueresponsedto> getVenuesByCity(String search) {
        List<Venuemodel> venues = venueRepository.findByNameContainingIgnoreCase(search);
        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venues) {
            resultList.add(mapper.toResponseDto(venue));
        }
        return resultList;
    }
}
