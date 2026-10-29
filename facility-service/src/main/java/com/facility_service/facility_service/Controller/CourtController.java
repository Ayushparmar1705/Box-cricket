package com.facility_service.facility_service.Controller;

import com.facility_service.facility_service.Model.CourtEntity;
import com.facility_service.facility_service.Services.CourtService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/court", "/api/courts"})
public class CourtController {

    private final CourtService courtService;

    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }

    // 1. Create court with multipart form-data (Court details + optional image files)
    @PostMapping(value = {"", "/create"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createCourtWithImages(
            @Valid @ModelAttribute CourtEntity request,
            BindingResult bindingResult,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
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
    @PostMapping(value = {"", "/create"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> createCourtJson(
            @Valid @RequestBody CourtEntity request,
            BindingResult bindingResult) {
        return createCourtWithImages(request, bindingResult, null);
    }

    // 3. Get court by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCourtById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            CourtEntity court = courtService.getCourtById(id);
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
            @RequestParam(required = false) Boolean isActive) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CourtEntity> courts = courtService.getCourtsByVenueId(venueId, isActive);
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

    // 5. Get all courts (with optional active filter, search, court_name, pagination, or venueId filter)
    @GetMapping({"", "/view"})
    public ResponseEntity<Map<String, Object>> getAllCourts(
            @RequestParam(required = false) Integer venueId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String court_name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (venueId != null) {
                List<CourtEntity> courts = courtService.getCourtsByVenueId(venueId, isActive);
                response.put("status", HttpStatus.OK.value());
                response.put("message", "Courts fetched successfully");
                response.put("data", courts);
                return ResponseEntity.status(HttpStatus.OK).body(response);
            }

            Page<CourtEntity> courts = courtService.getAllCourts(isActive, search, court_name, page, size);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Courts fetched successfully");
            response.put("data", courts.getContent());
            response.put("currentPage", courts.getNumber());
            response.put("totalItems", courts.getTotalElements());
            response.put("totalPages", courts.getTotalPages());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 6. Update court with multipart form-data
    @PutMapping(value = {"/{id}", "/update/{id}"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateCourtWithImages(
            @PathVariable int id,
            @ModelAttribute CourtEntity request,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        Map<String, Object> response = new HashMap<>();
        try {
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
    @PutMapping(value = {"/{id}", "/update/{id}"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateCourtJson(
            @PathVariable int id,
            @RequestBody CourtEntity request) {
        return updateCourtWithImages(id, request, null);
    }

    // 8. Change court status (toggle active/inactive)
    @PutMapping({"/status/{id}/{status}", "/{id}/status"})
    public ResponseEntity<Map<String, Object>> changeCourtStatus(
            @PathVariable int id,
            @PathVariable(required = false) Boolean status,
            @RequestParam(required = false) String statusStr) {
        Map<String, Object> response = new HashMap<>();
        try {
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

    // 9. Delete court
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCourt(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            courtService.deleteCourt(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court deleted successfully");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court deletion failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}

