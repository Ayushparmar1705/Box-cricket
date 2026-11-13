package com.facility_service.facility_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.facility_service.facility_service.dto.Requestdto.Updatevenuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.CourtResponseDto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.facility_service.facility_service.Model.Venuemodel;
import com.facility_service.facility_service.Services.Venueservice;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;

import jakarta.validation.Valid;*/

@RestController
@RequestMapping("/api/venues")
public class Venuecontroller {

    private final Venueservice service;

    public Venuecontroller(Venueservice service) {
        this.service = service;
    }

    /**
     * 1. CREATE VENUE
     * URL: POST /api/venues
     * Allows owner or admin to create a new venue with an image upload.
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN', 'PLAYER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> create(
            @Valid @ModelAttribute Venuerequestdto dto,
            Authentication authentication) {

        // Get logged in user ID from token
        int userId = Integer.parseInt(authentication.getName());
        dto.setOwner_id(userId);

        // Call service to save venue
        Venueresponsedto createdVenue = service.create(dto);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Venue created successfully");
        response.put("data", createdVenue);
        return ResponseEntity.ok(response);
    }

    /**
     * 2. GET ALL VENUES / SEARCH VENUES / FILTER VENUES
     * URL: GET /api/venues
     * URL: GET /api/venues/search?search=demo
     *
     * Supports:
     * - ?search=... (search by venue name)
     * - ?city=... (filter by city)
     * - ?status=... (true for active, false for inactive)
     */
    @GetMapping({ "", "/search" })
    public ResponseEntity<Map<String, Object>> getVenues(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Boolean status,
            @RequestParam(name = "is_active", required = false) Boolean isActive,
            @RequestParam(name = "owner_id", required = false) Integer ownerId,
            @RequestParam(name = "ownerId", required = false) Integer ownerIdAlt,
            Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Read active status from either ?status=... or ?is_active=...
            Boolean activeStatus = status;
            if (activeStatus == null) {
                activeStatus = isActive;
            }

            // Read owner ID from either ?owner_id=... or ?ownerId=...
            Integer targetOwnerId = ownerId;
            if (targetOwnerId == null) {
                targetOwnerId = ownerIdAlt;
            }

            // If an Owner is logged in and didn't specify search/city, show their venues
            if (targetOwnerId == null && authentication != null) {
                String roles = authentication.getAuthorities().toString();
                if (roles.contains("ROLE_OWNER") && search == null && city == null) {
                    try {
                        targetOwnerId = Integer.parseInt(authentication.getName());
                    } catch (NumberFormatException ignored) {
                    }
                }
            }

            // Fetch venues list
            List<Venueresponsedto> venues = service.getAllVenues(targetOwnerId, city, activeStatus, search, null);

            response.put("status", 200);
            response.put("message", "Venues fetched successfully");
            response.put("data", venues);
            response.put("totalItems", venues.size());
            return ResponseEntity.ok(response);

        } catch (RuntimeException err) {
            response.put("status", 400);
            response.put("message", "Failed to fetch venues: " + err.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 3. GET SINGLE VENUE BY ID (WITH COURTS FOR BOOKING)
     * URL: GET /api/venues/{id}
     *
     * When a user clicks a particular venue, this API is called.
     * It returns the full venue details along with all active courts,
     * court photos, and hourly pricing rules for booking.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVenueById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Service fetches venue details AND attaches its courts with prices
            Venueresponsedto venue = service.getVenueById(id);

            response.put("status", 200);
            response.put("message", "Venue details fetched successfully");
            response.put("data", venue);
            return ResponseEntity.ok(response);

        } catch (RuntimeException err) {
            response.put("status", 404);
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 4. GET COURTS OF A SPECIFIC VENUE
     * URL: GET /api/venues/{id}/courts
     */
    @GetMapping("/{id}/courts")
    public ResponseEntity<Map<String, Object>> getCourtsByVenueId(
            @PathVariable int id,
            @RequestParam(defaultValue = "true") boolean activeOnly) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<CourtResponseDto> courts = service.getCourtsByVenueId(id, activeOnly);

            response.put("status", 200);
            response.put("message", "Courts fetched successfully");
            response.put("data", courts);
            response.put("totalItems", courts.size());
            return ResponseEntity.ok(response);

        } catch (RuntimeException err) {
            response.put("status", 404);
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 5. TOGGLE VENUE ACTIVE/INACTIVE STATUS
     * URL: PUT /api/venues?venueid=2&status=true
     */
    @PreAuthorize("hasRole('OWNER')")
    @PutMapping
    public ResponseEntity<Map<String, String>> toggleStatus(
            @RequestParam("venueid") int venueid,
            @RequestParam("status") boolean status) {

        service.toggleStatus(venueid, status);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Venue status updated succesfully");
        return ResponseEntity.ok(response);
    }

    /**
     * 6. UPDATE VENUE DETAILS
     * URL: PUT /api/venues/update
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PutMapping(path = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> update(
            @Valid @ModelAttribute Updatevenuerequestdto dto) {

        Venuemodel updatedVenue = service.update(dto);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "Venue updated successfully");
        response.put("data", updatedVenue);
        return ResponseEntity.ok(response);
    }
}
