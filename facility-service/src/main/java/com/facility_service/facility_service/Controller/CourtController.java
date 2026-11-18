package com.facility_service.facility_service.Controller;

import com.facility_service.facility_service.Model.CourtEntity;
import com.facility_service.facility_service.Services.CourtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({ "/api/court", "/api/courts" })
public class CourtController {

    private final CourtService courtService;

    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }

    // 1. Create court with multipart form-data (Court details + optional image
    // files)
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PostMapping(value = { "", "/create" }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createCourtWithImages(
            @Valid @ModelAttribute CourtEntity request,
            BindingResult bindingResult,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Validation failed");
            response.put("errors", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            Integer loggedInOwnerId = getAuthenticatedOwnerId(authentication);
            if (loggedInOwnerId != null && request.getVenueId() != null) {
                boolean ownsVenue = courtService.doesOwnerOwnVenue(request.getVenueId(), loggedInOwnerId);
                if (!ownsVenue) {
                    response.put("status", HttpStatus.FORBIDDEN.value());
                    response.put("message", "Access denied: you do not own venue id " + request.getVenueId());
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
            }

            CourtEntity savedCourt = courtService.createCourt(request, files);
            response.put("status", HttpStatus.CREATED.value());
            response.put("message", "Court created successfully");
            response.put("data", savedCourt);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court creation failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 2. Create court with JSON
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PostMapping(value = { "", "/create" }, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> createCourtJson(
            @Valid @RequestBody CourtEntity request,
            BindingResult bindingResult,
            Authentication authentication) {
        return createCourtWithImages(request, bindingResult, null, authentication);
    }

    // 3. Get court by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCourtById(
            @PathVariable int id,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            CourtEntity court = courtService.getCourtById(id);

            // If an OWNER is authenticated, ensure the court belongs to their venue
            Integer loggedInOwnerId = getAuthenticatedOwnerId(authentication);
            if (loggedInOwnerId != null) {
                if (court.getVenue() != null && court.getVenue().getOwner_id() != loggedInOwnerId) {
                    response.put("status", HttpStatus.FORBIDDEN.value());
                    response.put("message", "Access denied: this court does not belong to your venues");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
            }

            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court fetched successfully");
            response.put("data", court);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // 4. Get courts by venue ID
    @GetMapping("/venue/{venueId}")
    public ResponseEntity<Map<String, Object>> getCourtsByVenue(
            @PathVariable Integer venueId,
            @RequestParam(required = false) Boolean isActive,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer loggedInOwnerId = getAuthenticatedOwnerId(authentication);
            List<CourtEntity> courts = courtService.getCourtsByVenueId(venueId, loggedInOwnerId, isActive);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Courts fetched successfully");
            response.put("data", courts);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Helper: Extract authenticated owner ID from JWT token
    private Integer getAuthenticatedOwnerId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            return null;
        }

        String roles = authentication.getAuthorities() != null ? authentication.getAuthorities().toString() : "";
        if (roles.contains("ROLE_OWNER") && !roles.contains("ROLE_SUPER_ADMIN")) {
            try {
                return Integer.parseInt(authentication.getName());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    // 5. Get all courts with filters: venueId, ownerId, isActive, search, court_name
    @GetMapping({ "", "/view" })
    public ResponseEntity<Map<String, Object>> getAllCourts(
            @RequestParam(name = "venueId", required = false) Integer venueId,
            @RequestParam(name = "venue_id", required = false) Integer venue_id,
            @RequestParam(name = "ownerId", required = false) Integer ownerId,
            @RequestParam(name = "owner_id", required = false) Integer owner_id,
            @RequestParam(name = "isActive", required = false) Boolean isActive,
            @RequestParam(name = "is_active", required = false) Boolean is_active,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "court_name", required = false) String court_name,
            @RequestParam(name = "courtName", required = false) String courtName,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer targetVenueId = venueId != null ? venueId : venue_id;
            Integer targetOwnerId = ownerId != null ? ownerId : owner_id;
            Boolean targetIsActive = isActive != null ? isActive : is_active;
            String targetCourtName = court_name != null ? court_name : courtName;

            // Security Rule: If an OWNER is logged in, lock to their own ID
            Integer loggedInOwnerId = getAuthenticatedOwnerId(authentication);
            if (loggedInOwnerId != null) {
                targetOwnerId = loggedInOwnerId;
            }

            List<CourtEntity> courts = courtService.findByVenueOwnerUserId(
                    targetVenueId,
                    targetOwnerId,
                    targetIsActive,
                    search,
                    targetCourtName);

            response.put("status", HttpStatus.OK.value());
            response.put("message", "Courts fetched successfully");
            response.put("data", courts);
            response.put("totalItems", courts.size());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 5b. Find courts by Venue Owner ID
    @GetMapping({ "/owner/{ownerId}", "/owner_id/{ownerId}", "/venue-owner/{ownerId}" })
    public ResponseEntity<Map<String, Object>> findByVenueOwner_id(
            @PathVariable Integer ownerId,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer targetOwnerId = ownerId;
            Integer loggedInOwnerId = getAuthenticatedOwnerId(authentication);

            // If an OWNER is logged in, strictly lock to their own ID
            if (loggedInOwnerId != null) {
                targetOwnerId = loggedInOwnerId;
            }

            List<CourtEntity> courts = courtService.findByVenueOwner_id(targetOwnerId);

            response.put("status", HttpStatus.OK.value());
            response.put("message", "Courts fetched successfully for owner id: " + targetOwnerId);
            response.put("data", courts);
            response.put("totalItems", courts.size());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 5c. Get logged-in owner's courts directly
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/my-courts")
    public ResponseEntity<Map<String, Object>> getMyCourts(Authentication authentication) {
        int ownerId = Integer.parseInt(authentication.getName());
        return findByVenueOwner_id(ownerId, authentication);
    }

    // 6. Update court with multipart form-data
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PutMapping(value = { "/{id}", "/update/{id}" }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateCourtWithImages(
            @PathVariable int id,
            @ModelAttribute CourtEntity request,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer loggedInOwnerId = getAuthenticatedOwnerId(authentication);
            if (loggedInOwnerId != null) {
                CourtEntity existing = courtService.getCourtById(id);
                if (existing.getVenue() != null && existing.getVenue().getOwner_id() != loggedInOwnerId) {
                    response.put("status", HttpStatus.FORBIDDEN.value());
                    response.put("message", "Access denied: you cannot modify another owner's court");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
            }

            CourtEntity updatedCourt = courtService.updateCourt(id, request, files);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court updated successfully");
            response.put("data", updatedCourt);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court update failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 7. Update court with JSON
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PutMapping(value = { "/{id}", "/update/{id}" }, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateCourtJson(
            @PathVariable int id,
            @RequestBody CourtEntity request,
            Authentication authentication) {
        return updateCourtWithImages(id, request, null, authentication);
    }

    // 8. Change court status (toggle active/inactive)
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PutMapping({ "/status/{id}/{status}", "/{id}/status" })
    public ResponseEntity<Map<String, Object>> changeCourtStatus(
            @PathVariable int id,
            @PathVariable(required = false) Boolean status,
            @RequestParam(required = false) String statusStr,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer loggedInOwnerId = getAuthenticatedOwnerId(authentication);
            if (loggedInOwnerId != null) {
                CourtEntity existing = courtService.getCourtById(id);
                if (existing.getVenue() != null && existing.getVenue().getOwner_id() != loggedInOwnerId) {
                    response.put("status", HttpStatus.FORBIDDEN.value());
                    response.put("message", "Access denied: you cannot change status of another owner's court");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
            }

            boolean newStatus = status != null ? status : "ACTIVE".equalsIgnoreCase(statusStr);
            CourtEntity updatedCourt = courtService.changeStatus(id, newStatus);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court status updated successfully");
            response.put("data", updatedCourt);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court status change failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
