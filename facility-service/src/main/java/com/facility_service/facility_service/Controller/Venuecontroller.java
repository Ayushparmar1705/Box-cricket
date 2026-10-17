package com.facility_service.facility_service.Controller;

import java.util.HashMap;
import java.util.Map;

import com.facility_service.facility_service.dto.Requestdto.Updatevenuerequestdto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.facility_service.facility_service.Services.Venueservice;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/venues")
public class Venuecontroller {

    private final Venueservice service;

    public Venuecontroller(Venueservice service) {
        this.service = service;
    }

    /**
     * Create venue with Multipart Form-Data (supports image file upload)
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN', 'PLAYER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> create(
            @Valid @ModelAttribute Venuerequestdto dto,
            Authentication authentication) {
        System.out.println(authentication);
        int id = Integer.parseInt(authentication.getName());
        // set user id for current owner
        dto.setOwner_id(id);

        // call create function from service
        var createdVenue = service.create(dto);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("status", 200);
        resultMap.put("message", "Venue created successfully");
        resultMap.put("data", createdVenue);
        return ResponseEntity.ok(resultMap);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getVenuesByOwnerId(Authentication authentication,
            @RequestParam("status") boolean status) {
        String userId = authentication.getName();
        System.out.println(authentication);
        var venues = service.getVenuesByOwnerId(Integer.parseInt(userId), status);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("status", 200);
        resultMap.put("message", "Venues fetched successfully");
        resultMap.put("data", venues);
        return ResponseEntity.ok(resultMap);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PutMapping
    public ResponseEntity<Map<String, String>> toggleStatus(@RequestParam("venueid") int venueid,
            @RequestParam("status") boolean status) {
        Map<String, String> responseMap = new HashMap<>();

        service.toggleStatus(venueid, status);
        responseMap.put("status", "success");
        responseMap.put("message", "Venue status updated succesfully");
        return ResponseEntity.ok(responseMap);
    }

    @PreAuthorize("hasAnyRole('OWNER')")
    @PutMapping(path = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> update(
            @Valid @ModelAttribute Updatevenuerequestdto dto) {

        // call create function from service
        var updatedVenue = service.update(dto);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("status", 200);
        resultMap.put("message", "Venue updated successfully");
        resultMap.put("data", updatedVenue);
        return ResponseEntity.ok(resultMap);
    }

    /**
     * Search venues by name
     * Accessible via GET /api/venues/search?search=... or ?query=...
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchVenues(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "query", required = false) String query) {
        String searchTerm = (search != null) ? search : (query != null ? query : "");
        var venues = service.getVenuesByCity(searchTerm);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("status", 200);
        resultMap.put("message", "Venues fetched successfully");
        resultMap.put("data", venues);
        return ResponseEntity.ok(resultMap);
    }
}
