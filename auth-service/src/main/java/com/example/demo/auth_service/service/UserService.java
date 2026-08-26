package com.example.demo.auth_service.service;

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

    public String loginUser(String email, String password) {
        User user = userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid email and password"));

        boolean passwordMatchers = passwordEncoder.matches(
                password,
                user.getPasswordHash());

        if (!passwordMatchers) {
            throw new RuntimeException("Password not match");
        } else {
            String token = jwtService.generateToken(String.valueOf(user.getRole()), user.getId());
            return token;
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
