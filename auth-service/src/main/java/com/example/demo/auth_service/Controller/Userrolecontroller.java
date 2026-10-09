package com.example.demo.auth_service.Controller;

import com.example.demo.auth_service.Model.Role;
import com.example.demo.auth_service.dto.Requestdto.Rolerequestdto;
import com.example.demo.auth_service.dto.Requestdto.Userrolerequestdto;
import com.example.demo.auth_service.dto.Responsedto.Roleresponsedto;
import com.example.demo.auth_service.dto.Responsedto.Userroleresponsedto;
import com.example.demo.auth_service.service.Userrolesservice;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class Userrolecontroller {

    private final Userrolesservice userRoleService;

    @Autowired
    public Userrolecontroller(Userrolesservice userRoleService) {
        this.userRoleService = userRoleService;
    }

    // ─── 1. Create a New Role (Master Data) ──────────────────────────────────
    // POST /api/roles
    @PostMapping("/roles")
    public ResponseEntity<?> createRole(@Valid @RequestBody Rolerequestdto dto) {
        try {
            Roleresponsedto createdRole = userRoleService.createRole(dto);
            return ResponseEntity.ok(createdRole);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "400");
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    // ─── 2. View All Available Master Roles ──────────────────────────────────
    // GET /api/roles
    @GetMapping("/roles")
    public ResponseEntity<List<Roleresponsedto>> getAllRoles() {
        List<Roleresponsedto> roles = userRoleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    // ─── 3. View Roles Assigned to a Specific User ──────────────────────────
    // GET /api/users/{userId}/roles
    @GetMapping("/users/{userId}/roles")
    public ResponseEntity<?> getUserRoles(@PathVariable Integer userId) {
        try {
            Userroleresponsedto response = userRoleService.getUserRoles(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "404");
            err.put("message", e.getMessage());
            return ResponseEntity.status(404).body(err);
        }
    }

    // ─── 4. Assign / Replace Multiple Roles for a User ─────────────────────
    // PUT /api/users/{userId}/roles
    @PutMapping("/users/{userId}/roles")
    public ResponseEntity<?> assignRolesToUser(
            @PathVariable Integer userId,
            @Valid @RequestBody Userrolerequestdto dto) {
        try {
            Userroleresponsedto response = userRoleService.assignRolesToUser(userId, dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "400");
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    // ─── 5. Add a Single Role to User ────────────────────────────────────────
    // POST /api/users/{userId}/roles/add?role=OWNER
    @PostMapping("/users/{userId}/roles/add")
    public ResponseEntity<?> addRoleToUser(
            @PathVariable Integer userId,
            @RequestParam Role role) {
        try {
            Userroleresponsedto response = userRoleService.addRoleToUser(userId, role);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "400");
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    // ─── 6. Remove a Role from User ──────────────────────────────────────────
    // DELETE /api/users/{userId}/roles/{roleName}
    @DeleteMapping("/users/{userId}/roles/{roleName}")
    public ResponseEntity<?> removeRoleFromUser(
            @PathVariable Integer userId,
            @PathVariable String roleName) {
        try {
            Role roleEnum = Role.valueOf(roleName.toUpperCase());
            Userroleresponsedto response = userRoleService.removeRoleFromUser(userId, roleEnum);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "400");
            err.put("message", "Invalid role name: " + roleName);
            return ResponseEntity.badRequest().body(err);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "404");
            err.put("message", e.getMessage());
            return ResponseEntity.status(404).body(err);
        }
    }
}
