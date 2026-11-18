package com.facility_service.facility_service.Services;

import java.util.ArrayList;
import java.util.List;

import com.facility_service.facility_service.Exception.ResourceAlreadyExistsException;
import com.facility_service.facility_service.Exception.ResourceNotFoundException;
import com.facility_service.facility_service.Mapper.CourtMapper;
import com.facility_service.facility_service.Mapper.VenueMapper;
import com.facility_service.facility_service.Model.CourtEntity;
import com.facility_service.facility_service.Model.Venueamenitiesmodel;
import com.facility_service.facility_service.Model.Venuemodel;
import com.facility_service.facility_service.Repositry.CourtRepository;
import com.facility_service.facility_service.Repositry.Venueamenitiesrepositry;
import com.facility_service.facility_service.Repositry.Venuerepositry;
import com.facility_service.facility_service.dto.Requestdto.Updatevenuerequestdto;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.CourtResponseDto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// ============================================================
// SERVICE: Venueservice
//
// What is a Service?
//   Service is where all the BUSINESS LOGIC lives.
//   Controller receives the HTTP request and calls the service.
//   Service does the work (database queries, checks, calculations)
//   and returns the result back to the controller.
//
// This file handles everything related to Venues:
//   - Creating a venue
//   - Getting venue by ID (with courts for booking)
//   - Getting all venues (with optional filters)
//   - Getting all venues with pagination (for admin panel)
//   - Getting venues by category
//   - Updating a venue
//   - Toggling venue active/inactive status
// ============================================================
@Service
public class Venueservice {

    // These are the helpers this service needs:
    private final Venuerepositry venueRepository;         // talks to the venues table in DB
    private final Venueamenitiesrepositry amenitiesRepository; // talks to venue_amenities table
    private final VenueMapper mapper;                     // converts between Entity and DTO
    private final CloudinaryService cloudinaryService;    // uploads images to Cloudinary
    private final CourtRepository courtRepository;        // talks to the courts table in DB
    private final CourtMapper courtMapper;                // converts court entity to DTO

    // Constructor — Spring automatically injects all the above helpers
    public Venueservice(
            Venuerepositry venueRepository,
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

    // ============================================================
    // 1. CREATE VENUE
    //
    // Steps:
    //   Step 1 - Check if venue name already exists (avoid duplicates)
    //   Step 2 - Upload image to Cloudinary (if image was provided)
    //   Step 3 - Convert request DTO to Venue entity
    //   Step 4 - Save venue to database
    //   Step 5 - Return the saved venue as response DTO
    // ============================================================
    public Venueresponsedto create(Venuerequestdto dto) {

        // Step 1: Check duplicate name
        if (venueRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistsException("Venue already exists with name: " + dto.getName());
        }

        // Step 2: Upload image to Cloudinary (if owner provided an image)
        String imageUrl = null;
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            imageUrl = cloudinaryService.uploadVenueImage(dto.getImage());
        }

        // Step 3: Convert DTO → Entity (mapper does the field mapping)
        Venuemodel venueModel = mapper.toEntity(dto);

        // Set image URL if upload was successful
        if (imageUrl != null) {
            venueModel.setImageUrl(imageUrl);
        }

        // Step 4: Save to database
        Venuemodel savedVenue = venueRepository.save(venueModel);

        // Step 5: Convert saved entity → Response DTO and return
        return mapper.toResponseDto(savedVenue);
    }

    // ============================================================
    // 2. GET VENUE BY ID (includes courts for booking)
    //
    // This is called when a player clicks on a venue in the app.
    // Returns full venue details + all active courts with pricing.
    //
    // Steps:
    //   Step 1 - Find venue by ID. If not found, throw 404 error.
    //   Step 2 - Convert venue entity to response DTO
    //   Step 3 - Find all active courts for this venue
    //   Step 4 - Convert court entities to court DTOs
    //   Step 5 - Attach courts to venue response and return
    // ============================================================
    @Transactional(readOnly = true)
    public Venueresponsedto getVenueById(int id) {

        // Step 1: Find venue in DB, throw 404 if not found
        Venuemodel venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

        // Step 2: Convert venue entity to response DTO
        Venueresponsedto responseDto = mapper.toResponseDto(venue);

        // Step 3: Fetch active courts for this venue
        List<CourtEntity> courts = courtRepository.findByVenueIdAndIsActive(id, true);

        // If no active courts found, fallback to all courts
        if (courts.isEmpty()) {
            courts = courtRepository.findByVenueId(id);
        }

        // Step 4: Convert court entities to court response DTOs
        List<CourtResponseDto> courtDtos = courtMapper.toResponseDtoList(courts);

        // Step 5: Set courts into the venue response
        responseDto.setCourts(courtDtos != null ? courtDtos : new ArrayList<>());

        return responseDto;
    }

    // ============================================================
    // 3. GET COURTS BY VENUE ID
    //
    // Used in the owner dashboard — shows courts of a specific venue.
    // ============================================================
    @Transactional(readOnly = true)
    public List<CourtResponseDto> getCourtsByVenueId(int venueId, boolean activeOnly) {

        // Check venue exists first
        if (!venueRepository.existsById(venueId)) {
            throw new ResourceNotFoundException("Venue not found with id: " + venueId);
        }

        List<CourtEntity> courts;

        if (activeOnly) {
            // Get only active courts
            courts = courtRepository.findByVenueIdAndIsActive(venueId, true);
        } else {
            // Get all courts (active + inactive)
            courts = courtRepository.findByVenueId(venueId);
        }

        return courtMapper.toResponseDtoList(courts);
    }

    // ============================================================
    // 4. GET ALL VENUES (with optional filters)
    //
    // Used by: Players browsing venues, Owner seeing their venues
    //
    // Filters (all optional):
    //   - ownerId → show only venues of a specific owner
    //   - city    → show only venues in a specific city
    //   - isActive → show only active (true) or inactive (false)
    //   - search  → search by keyword in venue name
    //   - name    → exact name match
    //
    // Returns: a simple List (no pagination)
    // ============================================================
    @Transactional(readOnly = true)
    public List<Venueresponsedto> getAllVenues(
            Integer ownerId,
            String city,
            Boolean isActive,
            String search,
            String name) {

        // Build filter using Specification (like a WHERE clause builder)
        Specification<Venuemodel> spec = Venuespecification.filter(ownerId, city, isActive, search, name);

        // Fetch all matching venues from DB, sorted by ID
        List<Venuemodel> venues = venueRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "id"));

        // Convert each venue entity to response DTO using a simple for loop
        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venues) {
            resultList.add(mapper.toResponseDto(venue));
        }

        return resultList;
    }

    // ============================================================
    // 5. GET ALL VENUES WITH PAGINATION (FOR ADMIN PANEL ONLY)
    //
    // Admin sees ALL venues from ALL owners.
    // With pagination, we don't load all 500 venues at once.
    // Instead we load 10 at a time (page by page).
    //
    // Example:
    //   page=0, size=10 → returns venue 1 to 10
    //   page=1, size=10 → returns venue 11 to 20
    //   page=2, size=10 → returns venue 21 to 30
    // ============================================================
    @Transactional(readOnly = true)
    public Page<Venueresponsedto> getAllVenuesPaginated(
            Integer ownerId,
            String city,
            Boolean isActive,
            String search,
            String name,
            int page,
            int size) {

        // Step 1: Build filter
        Specification<Venuemodel> spec = Venuespecification.filter(ownerId, city, isActive, search, name);

        // Step 2: Tell DB which page we want and how many items per page
        //         Sort by id so order is consistent
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));

        // Step 3: Fetch only the venues for this page from DB
        Page<Venuemodel> venuePage = venueRepository.findAll(spec, pageable);

        // Step 4: Convert each venue entity to response DTO
        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venuePage.getContent()) {
            resultList.add(mapper.toResponseDto(venue));
        }

        // Step 5: Wrap in Page so caller gets totalItems, totalPages, currentPage
        return new PageImpl<>(resultList, pageable, venuePage.getTotalElements());
    }

    // ============================================================
    // 6. GET VENUES BY CATEGORY
    //
    // Example: category_id = 1 → returns all Cricket venues
    //          category_id = 2 → returns all Badminton venues
    //
    // Uses the venue_category join table (like venue_amenities pattern)
    // ============================================================
    @Transactional(readOnly = true)
    public List<Venueresponsedto> getVenuesByCategory(int categoryId) {

        // Find all active venues that have this category in venue_category table
        List<Venuemodel> venues = venueRepository.findByCategoryId(categoryId);

        // Convert each venue entity to response DTO
        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venues) {
            resultList.add(mapper.toResponseDto(venue));
        }

        return resultList;
    }

    // ============================================================
    // 7. GET VENUES BY OWNER ID
    //
    // Used by owner dashboard to list their own venues.
    // ============================================================
    public List<Venueresponsedto> getVenuesByOwnerId(int ownerId, boolean status) {

        List<Venuemodel> venues = venueRepository.findByOwnerId(ownerId, status);

        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venues) {
            resultList.add(mapper.toResponseDto(venue));
        }

        return resultList;
    }

    // ============================================================
    // 8. TOGGLE VENUE STATUS (Activate / Deactivate)
    //
    // Owner can enable or disable their venue.
    // status = true  → venue is active (visible to players)
    // status = false → venue is inactive (hidden from players)
    // ============================================================
    @Transactional
    public Venuemodel toggleStatus(int venueId, boolean status) {

        // Find venue, throw 404 if not found
        Venuemodel venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + venueId));

        // Update the status and save
        venue.set_active(status);
        venue.setUpdated_at(java.time.LocalDateTime.now());

        return venueRepository.save(venue);
    }

    // ============================================================
    // 9. UPDATE VENUE DETAILS
    //
    // Owner can update venue info like name, city, address, image etc.
    // We only update fields that are provided (not null / not blank).
    // ============================================================
    @Transactional
    public Venuemodel update(Updatevenuerequestdto dto) {

        // Find existing venue by ID
        Venuemodel model = venueRepository.findById(dto.getVenue_id())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + dto.getVenue_id()));

        // Update only the fields that are provided
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

        // Upload new image if provided, or use image URL directly
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String imageUrl = cloudinaryService.uploadVenueImage(dto.getImage());
            model.setImageUrl(imageUrl);
        } else if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            model.setImageUrl(dto.getImageUrl());
        }

        // Update amenities — clear old ones and add new ones
        if (dto.getVenue_amenities() != null && !dto.getVenue_amenities().isBlank()) {

            // Clear old amenities first
            if (model.getVenue_amenities() != null) {
                model.getVenue_amenities().clear();
            } else {
                model.setVenue_amenities(new ArrayList<>());
            }

            // Split comma-separated amenities and add each one
            // Example: "Parking, WiFi, Washroom" → 3 amenity records
            String[] parts = dto.getVenue_amenities().split(",");
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    model.getVenue_amenities().add(new Venueamenitiesmodel(model, trimmed));
                }
            }
        }

        // Set updated timestamp and save
        model.setUpdated_at(java.time.LocalDateTime.now());
        return venueRepository.save(model);
    }

    // ============================================================
    // 10. SEARCH VENUES BY NAME
    //
    // Simple keyword search — used in search bar.
    // ============================================================
    @Transactional(readOnly = true)
    public List<Venueresponsedto> getVenuesByCity(String search) {

        List<Venuemodel> venues = venueRepository.findByNameContainingIgnoreCase(search);

        List<Venueresponsedto> resultList = new ArrayList<>();
        for (Venuemodel venue : venues) {
            resultList.add(mapper.toResponseDto(venue));
        }

        return resultList;
    }
}
