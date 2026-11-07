package com.facility_service.facility_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.facility_service.facility_service.dto.Requestdto.Updatevenuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.facility_service.facility_service.Services.Venueservice;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;

import jakarta.validation.Valid;

/**
 * ============================================================================
 * Controller: Venuecontroller
 * Description: REST API controller for Venue management.
 *              Provides a unified endpoint for get, filter, and search,
 *              as well as create, update, and status toggle operations.
 * ============================================================================
 */
@RestController
@RequestMapping("/api/venues")
public class Venuecontroller {

    private final Venueservice service;

    public Venuecontroller(Venueservice service) {
        this.service = service;
    }

    /**
     * 1. CREATE VENUE
     * Supports multipart form-data for venue details and image file upload.
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN', 'PLAYER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> create(
            @Valid @ModelAttribute Venuerequestdto dto,
            Authentication authentication) {

        int id = Integer.parseInt(authentication.getName());
        dto.setOwner_id(id);

        var createdVenue = service.create(dto);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("status", HttpStatus.OK.value());
        resultMap.put("message", "Venue created successfully");
        resultMap.put("data", createdVenue);
        return ResponseEntity.ok(resultMap);
    }

    /**
     * 2. COMMON API FOR GET, FILTER, AND SEARCH VENUES
     *
     * Accessible endpoints:
     * - GET /api/venues
     * - GET /api/venues/search
     * - GET /api/venues/filter
     * - GET /api/venues/view
     *
     * Capabilities:
     * - Get all venues: GET /api/venues
     * - Filter by city: GET /api/venues?city=Mumbai
     * - Filter by status: GET /api/venues?status=true (or is_active=true)
     * - Filter by owner ID: GET /api/venues?owner_id=3 (or ownerId=3)
     * - Search by keyword: GET /api/venues?search=cricket (across name, city, address, description)
     * - Owner Dashboard auto-detect: When logged-in as OWNER with no search/city specified,
     *   automatically defaults to their venues (supports legacy fetchMyVenuesApi calls).
     *   Pass all=true to view all venues platform-wide.
     * - Optional Pagination: GET /api/venues?page=0&size=10
     */
    @GetMapping({ "", "/search", "/filter", "/view" })
    public ResponseEntity<Map<String, Object>> getVenues(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "query", required = false) String query,
            @RequestParam(name = "city", required = false) String city,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "venue_name", required = false) String venue_name,
            @RequestParam(name = "venueName", required = false) String venueName,
            @RequestParam(name = "status", required = false) Boolean status,
            @RequestParam(name = "isActive", required = false) Boolean isActive,
            @RequestParam(name = "is_active", required = false) Boolean is_active,
            @RequestParam(name = "ownerId", required = false) Integer ownerId,
            @RequestParam(name = "owner_id", required = false) Integer owner_id,
            @RequestParam(name = "ownerOnly", required = false) Boolean ownerOnly,
            @RequestParam(name = "myVenues", required = false) Boolean myVenues,
            @RequestParam(name = "all", required = false) Boolean all,
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size,
            Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Resolve alias parameters
            Boolean targetStatus = status != null ? status : (isActive != null ? isActive : is_active);

            String targetSearch = (search != null && !search.trim().isEmpty()) ? search.trim()
                    : ((query != null && !query.trim().isEmpty()) ? query.trim() : null);

            String targetCity = (city != null && !city.trim().isEmpty()) ? city.trim() : null;

            String targetName = (name != null && !name.trim().isEmpty()) ? name.trim()
                    : ((venue_name != null && !venue_name.trim().isEmpty()) ? venue_name.trim()
                    : ((venueName != null && !venueName.trim().isEmpty()) ? venueName.trim() : null));

            Integer targetOwnerId = ownerId != null ? ownerId : owner_id;
            boolean requestMyVenues = Boolean.TRUE.equals(ownerOnly) || Boolean.TRUE.equals(myVenues);

            // Context-aware owner resolution for owner dashboard calls
            if (targetOwnerId == null && authentication != null && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getPrincipal())) {
                boolean isOwner = authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_OWNER"));

                if (requestMyVenues || (isOwner && targetSearch == null && targetCity == null && !Boolean.TRUE.equals(all))) {
                    try {
                        targetOwnerId = Integer.parseInt(authentication.getName());
                    } catch (NumberFormatException ignored) {
                    }
                }
            }

            // Paginated response if page and size are provided
            if (page != null && size != null) {
                Page<Venueresponsedto> venuesPage = service.getAllVenuesPaged(
                        targetOwnerId, targetCity, targetStatus, targetSearch, targetName, page, size);

                response.put("status", HttpStatus.OK.value());
                response.put("message", "Venues fetched successfully");
                response.put("data", venuesPage.getContent());
                response.put("currentPage", venuesPage.getNumber());
                response.put("totalItems", venuesPage.getTotalElements());
                response.put("totalPages", venuesPage.getTotalPages());
                return ResponseEntity.ok(response);
            }

            // Unpaged list response
            List<Venueresponsedto> venues = service.getAllVenues(
                    targetOwnerId, targetCity, targetStatus, targetSearch, targetName);

            response.put("status", HttpStatus.OK.value());
            response.put("message", "Venues fetched successfully");
            response.put("data", venues);
            response.put("totalItems", venues.size());
            return ResponseEntity.ok(response);

        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Failed to fetch venues: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 3. GET VENUE BY ID
     * Accessible via GET /api/venues/{id}
     */
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<Map<String, Object>> getVenueById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Venueresponsedto venue = service.getVenueById(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Venue fetched successfully");
            response.put("data", venue);
            return ResponseEntity.ok(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 4. TOGGLE VENUE ACTIVE/INACTIVE STATUS
     */
    @PreAuthorize("hasRole('OWNER')")
    @PutMapping
    public ResponseEntity<Map<String, String>> toggleStatus(
            @RequestParam("venueid") int venueid,
            @RequestParam("status") boolean status) {
        Map<String, String> responseMap = new HashMap<>();

        service.toggleStatus(venueid, status);
        responseMap.put("status", "success");
        responseMap.put("message", "Venue status updated succesfully");
        return ResponseEntity.ok(responseMap);
    }

    /**
     * 5. UPDATE VENUE DETAILS
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PutMapping(path = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> update(
            @Valid @ModelAttribute Updatevenuerequestdto dto) {

        var updatedVenue = service.update(dto);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("status", HttpStatus.OK.value());
        resultMap.put("message", "Venue updated successfully");
        resultMap.put("data", updatedVenue);
        return ResponseEntity.ok(resultMap);
    }
}
