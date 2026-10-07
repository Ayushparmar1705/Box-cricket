package com.example.demo.auth_service.Controller;

import com.example.demo.auth_service.Model.User;
import com.example.demo.auth_service.dto.Requestdto.Loginrequestdto;
import com.example.demo.auth_service.dto.Requestdto.Userrequestdto;
import com.example.demo.auth_service.dto.Responsedto.Loginresponsedto;
import com.example.demo.auth_service.dto.Responsedto.Userresponsedto;
import com.example.demo.auth_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userservice;

    // ─── 1. Create User / Register ─────────────────────────────────────────────
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@Valid @RequestBody Userrequestdto data) {
        Userresponsedto createdUser = userservice.createUser(data);
        return ResponseEntity.ok(createdUser);
    }

    // ─── 2. Login User ────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Loginrequestdto data) {
        try {
            Loginresponsedto loginResponse = userservice.authenticateUser(data);
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            Map<String, String> map = new HashMap<>();
            map.put("status", "401");
            map.put("message", e.getMessage());
            return ResponseEntity.status(401).body(map);
        }
    }

    // ─── 3. Get User By ID ────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        try {
            Userresponsedto user = userservice.getUserResponseById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "404");
            err.put("message", e.getMessage());
            return ResponseEntity.status(404).body(err);
        }
    }

    // ─── 4. Change Role ────────────────────────────────────────────────────────
    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable int id, @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            User user = userservice.changeRole(id, role);
            Map<String, Object> map = new HashMap<>();
            map.put("status", "200");
            map.put("message", "Role updated successfully");
            map.put("userId", user.getId());
            return ResponseEntity.ok(map);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "401");
            err.put("message", e.getMessage());
            return ResponseEntity.status(401).body(err);
        }
    }
}