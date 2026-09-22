package com.court_service.court_service.controller;

import com.court_service.court_service.dto.request.CourtRequestDto;
import com.court_service.court_service.dto.response.CourtImageResponseDto;
import com.court_service.court_service.dto.response.CourtResponseDto;
import com.court_service.court_service.service.CourtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/court")
public class CourtController {

    private final CourtService courtService;

    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }

    // 1. Create court with multipart form-data (Court details + optional image files)
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createCourtWithImages(
            @Valid @ModelAttribute CourtRequestDto request,
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
            CourtResponseDto responseDto = courtService.createCourt(request, files);
            response.put("status", HttpStatus.CREATED.value());
            response.put("message", "Court created successfully");
            response.put("data", responseDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court creation failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 2. Create court with JSON only (without image files)
    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> createCourtJson(
            @Valid @RequestBody CourtRequestDto request,
            BindingResult bindingResult) {
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
            CourtResponseDto responseDto = courtService.createCourt(request, null);
            response.put("status", HttpStatus.CREATED.value());
            response.put("message", "Court created successfully");
            response.put("data", responseDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court creation failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 3. Get court by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCourtById(@PathVariable UUID id) {
        Map<String, Object> response = new HashMap<>();
        try {
            CourtResponseDto responseDto = courtService.getCourtById(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court fetched successfully");
            response.put("data", responseDto);
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
            List<CourtResponseDto> courts = courtService.getCourtsByVenueId(venueId, isActive);
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

    // 5. Get courts by category ID
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getCourtsByCategory(@PathVariable Integer categoryId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CourtResponseDto> courts = courtService.getCourtsByCategoryId(categoryId);
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

    // 6. Get all courts (with optional active filter)
    @GetMapping("/view")
    public ResponseEntity<Map<String, Object>> getAllCourts(
            @RequestParam(required = false) Boolean isActive) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CourtResponseDto> courts = courtService.getAllCourts(isActive);
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

    // 7. Update court with multipart form-data (Court details + optional new images)
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateCourtWithImages(
            @PathVariable UUID id,
            @ModelAttribute CourtRequestDto request,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        Map<String, Object> response = new HashMap<>();
        try {
            CourtResponseDto responseDto = courtService.updateCourt(id, request, files);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court updated successfully");
            response.put("data", responseDto);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court update failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 8. Update court with JSON only
    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateCourtJson(
            @PathVariable UUID id,
            @RequestBody CourtRequestDto request) {
        Map<String, Object> response = new HashMap<>();
        try {
            CourtResponseDto responseDto = courtService.updateCourt(id, request, null);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court updated successfully");
            response.put("data", responseDto);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court update failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 9. Upload additional images to an existing court
    @PostMapping(value = "/{id}/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadImagesToCourt(
            @PathVariable UUID id,
            @RequestParam("files") List<MultipartFile> files) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CourtImageResponseDto> images = courtService.addImagesToCourt(id, files);
            response.put("status", HttpStatus.CREATED.value());
            response.put("message", "Images uploaded successfully");
            response.put("data", images);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Image upload failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 10. Change court status (active/inactive)
    @PutMapping("/status/{id}/{status}")
    public ResponseEntity<Map<String, Object>> changeCourtStatus(
            @PathVariable UUID id,
            @PathVariable boolean status) {
        Map<String, Object> response = new HashMap<>();
        try {
            CourtResponseDto responseDto = courtService.changeStatus(id, status);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court status updated successfully");
            response.put("data", responseDto);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Court status change failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 11. Delete court and all its linked images
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteCourt(@PathVariable UUID id) {
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

    // 12. Delete single court image by image ID
    @DeleteMapping("/image/{imageId}")
    public ResponseEntity<Map<String, Object>> deleteCourtImage(@PathVariable Long imageId) {
        Map<String, Object> response = new HashMap<>();
        try {
            courtService.deleteCourtImage(imageId);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Court image deleted successfully");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Image deletion failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
