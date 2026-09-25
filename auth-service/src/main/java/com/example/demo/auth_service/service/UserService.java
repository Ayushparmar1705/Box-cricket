package com.example.demo.auth_service.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.auth_service.Model.User;
import com.example.demo.auth_service.Repositry.UserRepositry;
import com.example.demo.auth_service.Model.Role;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepositry userrepo;
    @Autowired
    private JwtService jwtService;

    public User createUser(User user) {
        if (userrepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with email alredy exists");
        }
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userrepo.save(user);
    }

    public Map<String, String> loginUser(String email, String password) {
        User user = userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid email and password"));

        boolean passwordMatchers = passwordEncoder.matches(
                password,
                user.getPasswordHash());

        if (!passwordMatchers) {
            throw new RuntimeException("Password not match");
        } else {
            String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole().name());
            Map<String, String> response = new HashMap<>();
            response.put("status", "200");
            response.put("token", token);
            response.put("role", user.getRole().toString());
            return response;
        }
    }

    public User getUserById(Integer id) {
        return userrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User changeRole(Integer id, String role) {
        User user = userrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Invalid id"));
        try {
            Role newRole = Role.valueOf(role.toUpperCase());
            user.setRole(newRole);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
        return userrepo.save(user);
    }
}
