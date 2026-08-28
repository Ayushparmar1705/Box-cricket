package com.state.state_service.Controller;

import com.state.state_service.Model.Statemodel;
import com.state.state_service.Service.Stateservice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/state")
public class Statecontroller {
    private final Stateservice service;

    public Statecontroller(Stateservice service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<?> Createstate(
            @Valid @RequestBody(required = false) Statemodel obj,
            BindingResult bindingResult,
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        if (obj == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Request body is missing");
            return ResponseEntity.badRequest().body(response);
        }
        if (obj.getName() == null || obj.getName().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "State name is required");
            return ResponseEntity.badRequest().body(response);
        }
        if (obj.getCountryId() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", "Country ID is required");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            service.Addstate(obj, token);
            Map<String, String> response = new HashMap<>();
            response.put("status", "200");
            response.put("message", "State added successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "400");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<Statemodel>> viewstate() {
        try {
            List<Statemodel> list = service.viewState();
            return ResponseEntity.status(HttpStatus.CREATED).body(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Statemodel result = service.getStateById(id);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("State not found");
        }
    }

    @PutMapping("/state-status/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable Long id) {
        try {
            int result = service.changeStatus(id);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }
}
