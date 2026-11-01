package com.facility_service.facility_service.Controller;

import com.facility_service.facility_service.Model.Pricingruleentity;
import com.facility_service.facility_service.Services.PricingruleService;
import com.facility_service.facility_service.Exception.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ============================================================================
 * Controller: PricingRuleController
 * Base URL: /api/pricing
 * Description: REST API endpoints for managing court pricing rules.
 *
 * Endpoints:
 * 1. POST /api/pricing/create -> Create new pricing rule (Integer PK)
 * 2. GET /api/pricing -> Get all pricing rules
 * 3. GET /api/pricing/{id} -> Get rule by Integer ID
 * 4. GET /api/pricing/court/{courtId} -> Get all rules for a specific court
 * 5. PUT /api/pricing/{id} -> Update rule by Integer ID
 * 6. DELETE /api/pricing/{id} -> Delete rule by Integer ID
 * ============================================================================
 */
@RestController
@RequestMapping("/api/pricing")
public class PricingRuleController {

    private final PricingruleService pricingService;

    // Constructor Injection
    public PricingRuleController(PricingruleService pricingService) {
        this.pricingService = pricingService;
    }

    /**
     * 1. CREATE Pricing Rule
     * URL: POST http://localhost:3040/api/pricing/create
     * Access: Authenticated OWNER, SUPER_ADMIN, or PLAYER
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN', 'PLAYER')")
    @PostMapping(value = { "", "/create" })
    public ResponseEntity<Map<String, Object>> createPricing(
            @Valid @RequestBody Pricingruleentity pricing,
            BindingResult bindingResult) {

        Map<String, Object> response = new HashMap<>();

        // Handle Bean Validation Errors (e.g. missing @NotNull fields, invalid times)
        if (bindingResult.hasErrors()) {
            Map<String, String> fieldErrors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Validation failed");
            response.put("errors", fieldErrors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            Pricingruleentity created = pricingService.createPricingRule(pricing);
            response.put("status", HttpStatus.CREATED.value());
            response.put("message", "Pricing rule created successfully");
            response.put("data", created);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException | ResourceNotFoundException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception err) {
            response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.put("message", "Failed to create pricing rule: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 2. GET ALL Pricing Rules (with optional isActive filter)
     * URL: GET http://localhost:3040/api/pricing?isActive=true/false
     * Access: Public browse
     */
    @GetMapping({ "", "/all" })
    public ResponseEntity<Map<String, Object>> getAllPricingRules(
            @RequestParam(required = false) Boolean isActive) {
        Map<String, Object> response = new HashMap<>();
        List<Pricingruleentity> rules = pricingService.getAllPricingRules(isActive);
        response.put("status", HttpStatus.OK.value());
        response.put("message", "All pricing rules fetched successfully");
        response.put("data", rules);
        return ResponseEntity.ok(response);
    }

    /**
     * 3. GET Pricing Rule by Integer ID
     * URL: GET http://localhost:3040/api/pricing/{id}
     * Access: Public browse
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPricingById(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pricingruleentity rule = pricingService.getPricingRuleById(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Pricing rule fetched successfully");
            response.put("data", rule);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 4. GET Pricing Rules for a specific Court (with optional isActive filter)
     * URL: GET http://localhost:3040/api/pricing/court/{courtId}?isActive=true/false
     * Access: Public browse
     */
    @GetMapping("/court/{courtId}")
    public ResponseEntity<Map<String, Object>> getPricingByCourtId(
            @PathVariable Integer courtId,
            @RequestParam(required = false) Boolean isActive) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Pricingruleentity> rules = pricingService.getPricingRulesByCourtId(courtId, isActive);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Pricing rules fetched for court id: " + courtId);
            response.put("data", rules);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 5. UPDATE an existing Pricing Rule by Integer ID
     * URL: PUT http://localhost:3040/api/pricing/{id}
     * Access: Authenticated OWNER, SUPER_ADMIN, or PLAYER
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN', 'PLAYER')")
    @PutMapping(value = { "/{id}", "/update/{id}" })
    public ResponseEntity<Map<String, Object>> updatePricing(
            @PathVariable Integer id,
            @RequestBody Pricingruleentity updatedData) {

        Map<String, Object> response = new HashMap<>();
        try {
            Pricingruleentity updated = pricingService.updatePricingRule(id, updatedData);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Pricing rule updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IllegalArgumentException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 6. SOFT DELETE a Pricing Rule by Integer ID (marks is_active = false)
     * URL: DELETE http://localhost:3040/api/pricing/{id}
     * Access: Authenticated OWNER or SUPER_ADMIN
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @DeleteMapping(value = { "/{id}", "/delete/{id}" })
    public ResponseEntity<Map<String, Object>> deletePricing(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pricingruleentity softDeleted = pricingService.deletePricingRule(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Pricing rule soft-deleted successfully");
            response.put("data", softDeleted);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * 7. RESTORE / ACTIVATE / CHANGE STATUS of a Pricing Rule
     * URL: PUT http://localhost:3040/api/pricing/{id}/status?status=true/false
     * Access: Authenticated OWNER or SUPER_ADMIN
     */
    @PreAuthorize("hasAnyRole('OWNER', 'SUPER_ADMIN')")
    @PutMapping(value = { "/{id}/status", "/status/{id}" })
    public ResponseEntity<Map<String, Object>> changeStatus(
            @PathVariable Integer id,
            @RequestParam boolean status) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pricingruleentity updated = pricingService.changeStatus(id, status);
            response.put("status", HttpStatus.OK.value());
            response.put("message", status ? "Pricing rule activated successfully" : "Pricing rule deactivated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
