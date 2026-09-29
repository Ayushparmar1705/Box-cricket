package com.court_service.court_service.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.court_service.court_service.model.Pricingruleentity;
import com.court_service.court_service.service.PricingruleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pricing")
public class PricingRuleController {

    private final PricingruleService pricingService;

    public PricingRuleController(PricingruleService pricingService) {
        this.pricingService = pricingService;
    }

    // 1. Create a new pricing rule
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPricing(
            @Valid @RequestBody Pricingruleentity pricing,
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
            Pricingruleentity createdPricing = pricingService.createPricing(pricing);
            response.put("status", HttpStatus.CREATED.value());
            response.put("message", "Pricing rule created successfully");
            response.put("data", createdPricing);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 2. Get pricing rules by court ID
    @GetMapping("/court/{courtId}")
    public ResponseEntity<Map<String, Object>> getPricingByCourtId(@PathVariable int courtId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Pricingruleentity> pricingRules = pricingService.getPricingByCourtId(courtId);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Pricing rules fetched successfully");
            response.put("data", pricingRules);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 3. Get pricing rule by rule ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPricingById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pricingruleentity pricingRule = pricingService.getPricingById(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Pricing rule fetched successfully");
            response.put("data", pricingRule);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // 4. Delete pricing rule by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deletePricing(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            pricingService.deletePricing(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Pricing rule deleted successfully");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
