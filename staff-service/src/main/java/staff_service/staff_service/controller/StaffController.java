package staff_service.staff_service.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import staff_service.staff_service.model.StaffEntity;
import staff_service.staff_service.service.StaffService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping({"", "/create"})
    public ResponseEntity<Map<String, Object>> createStaff(
            @Valid @RequestBody StaffEntity request,
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
            StaffEntity savedStaff = staffService.createStaff(request);
            response.put("status", HttpStatus.CREATED.value());
            response.put("message", "Staff created successfully");
            response.put("data", savedStaff);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Staff creation failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getStaffById(@PathVariable UUID id) {
        Map<String, Object> response = new HashMap<>();
        try {
            StaffEntity staff = staffService.getStaffById(id);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Staff fetched successfully");
            response.put("data", staff);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.NOT_FOUND.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Map<String, Object>> getStaffByOwner(
            @PathVariable Integer ownerId,
            @RequestParam(required = false) Boolean isActive) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<StaffEntity> staffList = staffService.getStaffByOwner(ownerId, isActive);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Staff fetched successfully");
            response.put("data", staffList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<Map<String, Object>> getStaffByVenue(
            @PathVariable Integer venueId,
            @RequestParam(required = false) Boolean isActive) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<StaffEntity> staffList = staffService.getStaffByVenue(venueId, isActive);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Staff fetched successfully");
            response.put("data", staffList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getStaffByUser(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<StaffEntity> staffList = staffService.getStaffByUser(userId);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Staff fetched successfully");
            response.put("data", staffList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping({"", "/view"})
    public ResponseEntity<Map<String, Object>> getAllStaff(
            @RequestParam(required = false) Boolean isActive) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<StaffEntity> staffList = staffService.getAllStaff(isActive);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Staff fetched successfully");
            response.put("data", staffList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/status/{id}/{status}")
    public ResponseEntity<Map<String, Object>> changeStatus(
            @PathVariable UUID id,
            @PathVariable boolean status) {
        Map<String, Object> response = new HashMap<>();
        try {
            StaffEntity updated = staffService.changeStatus(id, status);
            response.put("status", HttpStatus.OK.value());
            response.put("message", "Staff status updated successfully");
            response.put("data", updated);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException err) {
            response.put("status", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Staff status update failed: " + err.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
