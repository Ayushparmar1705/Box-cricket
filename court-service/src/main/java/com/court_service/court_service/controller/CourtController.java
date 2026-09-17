package com.court_service.court_service.controller;

import com.court_service.court_service.audit.Auditable;
import com.court_service.court_service.dto.request.CourtRequestDto;
import com.court_service.court_service.dto.response.CourtResponseDto;
import com.court_service.court_service.model.AuditLogEntity;
import com.court_service.court_service.service.AuditService;
import com.court_service.court_service.service.CourtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/court")
public class CourtController {

    private final CourtService courtService;
    private final AuditService auditService;

    public CourtController(CourtService courtService, AuditService auditService) {
        this.courtService = courtService;
        this.auditService = auditService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createCourt(
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
            CourtResponseDto responseDto = courtService.createCourt(request);
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

}
