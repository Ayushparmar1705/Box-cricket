package com.example.demo.auth_service.Controller;

import com.example.demo.auth_service.Model.User;
import com.example.demo.auth_service.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userservice;

    @PostMapping("/create")
    public String createUser(@RequestBody User data) {
        userservice.createUser(data);
        return "Account created successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User data) {
        Map<String, String> map = new HashMap<>();
        try {
            String token = userservice.loginUser(data.getEmail(), data.getPasswordHash());
            map.put("status", "200");
            map.put("token", token);
            return ResponseEntity.ok(map);
        } catch (RuntimeException e) {
            System.out.println("Login failed: " + e.getMessage());
            map.put("status", "401");
            map.put("message", e.getMessage());
            return ResponseEntity.status(401).body(map);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        try {
            User user = userservice.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "404");
            err.put("message", e.getMessage());
            return ResponseEntity.status(404).body(err);
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable int id, @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            User user = userservice.changeRole(id, role);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "401");
            err.put("message", e.getMessage());
            return ResponseEntity.status(401).body(err);
        }
    }
}