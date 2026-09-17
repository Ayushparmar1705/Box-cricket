package com.venue_service.venue_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.venue_service.venue_service.Entity.Amenityentity;
import com.venue_service.venue_service.Service.Amenityservice;
import com.venue_service.venue_service.dto.request.AmenitiesRequestdto;

@RestController
@RequestMapping("/api/amenities")
public class Amenitycontroller {

    private final Amenityservice service;

    public Amenitycontroller(Amenityservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createVenue(@RequestBody AmenitiesRequestdto obj) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            System.out.println("Venue amenities controller object = " + obj.toString());
            Amenityentity created = service.createAmenity(obj);
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
            List<Amenityentity> list = service.getAmenities(status);
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
            Amenityentity updated = service.changeStatus(id, status);
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

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAmenityById(@PathVariable int id) {
        Map<String, Object> mapResult = new HashMap<>();
        try {
            Amenityentity amenity = service.getAmenityById(id);
            mapResult.put("status", HttpStatus.OK.value());
            mapResult.put("message", "Amenity fetched successfully");
            mapResult.put("data", amenity);
            return ResponseEntity.status(HttpStatus.OK).body(mapResult);
        } catch (Exception error) {
            mapResult.put("status", HttpStatus.NOT_FOUND.value());
            mapResult.put("message", error.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapResult);
        }
    }
}
