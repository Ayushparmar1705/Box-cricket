package com.venue_service.venue_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.venue_service.venue_service.Entity.Venueamenities;
import com.venue_service.venue_service.Service.Amenitiesservice;
import com.venue_service.venue_service.dto.request.AmenitiesRequestdto;

@RestController
@RequestMapping("/api/amenities")
public class Venueamenitiescontroller {

    private final Amenitiesservice service;

    public Venueamenitiescontroller(Amenitiesservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createVenue(@RequestBody AmenitiesRequestdto obj) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            System.out.println("Venue amenities controller object = " + obj.toString());
            Venueamenities created = service.createAmenity(obj);
            mapResult.put("status", HttpStatus.CREATED.value());
            mapResult.put("message", "Amenity created successfully");
            mapResult.put("data", created);

            return ResponseEntity.status(HttpStatus.CREATED).body(mapResult);
        } catch (Exception error) {
            mapResult.put("status", HttpStatus.BAD_REQUEST.value());
            mapResult.put("message", "Failed to create amenity: " + error.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
    }

    @GetMapping("/view")
    public ResponseEntity<Map<String, Object>> viewVenue(@RequestParam(defaultValue = "true") boolean status) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            List<Venueamenities> list = service.getAmenities(status);
            System.out.println("list : " + list);
            if (list.isEmpty()) {
                mapResult.put("status", HttpStatus.NOT_FOUND.value());
                mapResult.put("message", "No Amenities found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapResult);
            } else {
                mapResult.put("status", HttpStatus.OK.value());
                mapResult.put("message", "Amenities fetched successfully");
                mapResult.put("data", list);
                return ResponseEntity.status(HttpStatus.OK).body(mapResult);
            }
        } catch (Exception error) {
            mapResult.put("status", HttpStatus.BAD_REQUEST.value());
            mapResult.put("message", "Failed to fetch amenities: " + error.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
    }

    @PutMapping("/status/{id}/{status}")
    public ResponseEntity<Map<String, Object>> changeStatus(
            @PathVariable int id,
            @PathVariable boolean status) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            Venueamenities updated = service.changeStatus(id, status);
            mapResult.put("status", HttpStatus.OK.value());
            mapResult.put("message", "Amenity " + (status ? "activated" : "deactivated") + " successfully");
            mapResult.put("data", updated);
            return ResponseEntity.status(HttpStatus.OK).body(mapResult);
        } catch (Exception error) {
            mapResult.put("status", HttpStatus.BAD_REQUEST.value());
            mapResult.put("message", "Failed to update amenity status: " + error.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapResult);
        }
    }
}
