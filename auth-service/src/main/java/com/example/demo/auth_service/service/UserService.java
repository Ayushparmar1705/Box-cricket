package com.example.demo.auth_service.service;

import com.example.demo.auth_service.Mapper.UserMapper;
import com.example.demo.auth_service.Model.Role;
import com.example.demo.auth_service.Model.Roles;
import com.example.demo.auth_service.Model.User;
import com.example.demo.auth_service.Repositry.Rolerepositry;
import com.example.demo.auth_service.Repositry.UserRepositry;
import com.example.demo.auth_service.dto.Requestdto.Loginrequestdto;
import com.example.demo.auth_service.dto.Requestdto.Userrequestdto;
import com.example.demo.auth_service.dto.Responsedto.Loginresponsedto;
import com.example.demo.auth_service.dto.Responsedto.Userresponsedto;
import com.example.demo.auth_service.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepositry userrepo;

    @Autowired
    private Rolerepositry rolerepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public Userresponsedto createUser(Userrequestdto dto) {
        if (dto.getEmail() != null && userrepo.existsByEmail(dto.getEmail().trim())) {
            throw new DuplicateResourceException("User with email " + dto.getEmail() + " already exists");
        }
        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()
                && userrepo.existsByPhone(dto.getPhone().trim())) {
            throw new DuplicateResourceException("User with phone " + dto.getPhone() + " already exists");
        }

        User user = userMapper.toEntity(dto);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        Set<Roles> assignedRoles = new HashSet<>();
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            for (Role r : dto.getRoles()) {
                Roles roleEntity = rolerepo.findByName(r).orElseGet(() -> rolerepo.save(new Roles(r)));
                assignedRoles.add(roleEntity);
            }
        } else {
            Roles defaultRole = rolerepo.findByName(Role.PLAYER)
                    .orElseGet(() -> rolerepo.save(new Roles(Role.PLAYER)));
            assignedRoles.add(defaultRole);
        }
        user.setRoles(assignedRoles);

        User savedUser = userrepo.save(user);
        return userMapper.toResponseDto(savedUser, "Account created successfully");
    }

    public Loginresponsedto authenticateUser(Loginrequestdto dto) {
        User user = userrepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean passwordMatchers = passwordEncoder.matches(dto.getPassword(), user.getPasswordHash());
        if (!passwordMatchers) {
            throw new RuntimeException("Invalid email or password");
        }

        List<String> roleNames = new ArrayList<>();
        for (Roles role : user.getRoles()) {
            roleNames.add(role.getName().name());
        }
        if (roleNames.isEmpty()) {
            roleNames.add("PLAYER");
        }
        String primarRole = roleNames.get(0);
        Set<String> roleSet = new HashSet<>(roleNames);
        String token = jwtService.generateToken(user.getEmail(), user.getId(), roleSet);

        Loginresponsedto response = new Loginresponsedto();
        response.setStatus("200");
        response.setToken(token);
        response.setRole(primaryRole);
        response.setRoles(roleNames);
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");
        return response;
    }

    public Map<String, String> loginUser(String email, String password) {
        Loginresponsedto response = authenticateUser(new Loginrequestdto(email, password));
        Map<String, String> map = new HashMap<>();
        map.put("status", response.getStatus());
        map.put("token", response.getToken());
        map.put("role", response.getRole());
        map.put("roles", String.join(",", response.getRoles()));
        map.put("userId", String.valueOf(response.getUserId()));
        map.put("fullName", response.getFullName());
        map.put("email", response.getEmail());
        return map;
    }

    public User getUserById(Integer id) {
        return userrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public Userresponsedto getUserResponseById(Integer id) {
        User user = getUserById(id);
        return userMapper.toResponseDto(user, "User profile fetched successfully");
    }

    public Userresponsedto getUserProfileByPrincipal(String principal) {
        if (principal == null || principal.trim().isEmpty()) {
            throw new RuntimeException("Principal cannot be empty");
        }
        User user;
        if (principal.contains("@")) {
            user = userrepo.findByEmail(principal.trim())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + principal));
        } else {
            try {
                int id = Integer.parseInt(principal.trim());
                user = getUserById(id);
            } catch (NumberFormatException e) {
                user = userrepo.findByEmail(principal.trim())
                        .orElseThrow(() -> new RuntimeException("User not found with email: " + principal));
            }
        }
        return userMapper.toResponseDto(user, "User profile fetched successfully");
    }

    @Transactional
    public User changeRole(Integer id, String role) {
        User user = getUserById(id);
        try {
            Role newRole = Role.valueOf(role.toUpperCase());
            Roles roleEntity = rolerepo.findByName(newRole)
                    .orElseGet(() -> rolerepo.save(new Roles(newRole)));

            Set<Roles> roles = user.getRoles();
            if (roles == null) {
                roles = new HashSet<>();
            }
            roles.add(roleEntity);
            user.setRoles(roles);
            return userrepo.save(user);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
    }
}
