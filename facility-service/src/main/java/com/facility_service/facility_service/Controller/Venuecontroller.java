package com.facility_service.facility_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facility_service.facility_service.Services.Venueservice;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/venues")
public class Venuecontroller {
    private Venueservice service;

    public Venuecontroller(Venueservice service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody Venuerequestdto dto) {
        var createdVenue = service.create(dto);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("status", 200);
        resultMap.put("message", "Venue created successfully");
        resultMap.put("data", createdVenue);
        return ResponseEntity.ok(resultMap);
    }
}
