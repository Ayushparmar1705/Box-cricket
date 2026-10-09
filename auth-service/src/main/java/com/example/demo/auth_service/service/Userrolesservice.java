package com.example.demo.auth_service.service;

import com.example.demo.auth_service.Model.Role;
import com.example.demo.auth_service.Model.Roles;
import com.example.demo.auth_service.Model.User;
import com.example.demo.auth_service.Repositry.Rolerepositry;
import com.example.demo.auth_service.Repositry.UserRepositry;
import com.example.demo.auth_service.dto.Requestdto.Rolerequestdto;
import com.example.demo.auth_service.dto.Requestdto.Userrolerequestdto;
import com.example.demo.auth_service.dto.Responsedto.Roleresponsedto;
import com.example.demo.auth_service.dto.Responsedto.Userroleresponsedto;
import com.example.demo.auth_service.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class Userrolesservice {

    private final Rolerepositry roleRepository;
    private final UserRepositry userRepository;

    @Autowired
    public Userrolesservice(Rolerepositry roleRepository, UserRepositry userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    // ─── 1. Create a new master Role ─────────────────────────────────────────
    @Transactional
    public Roleresponsedto createRole(Rolerequestdto dto) {
        if (roleRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Role '" + dto.getName() + "' already exists");
        }

        Roles role = new Roles();
        role.setName(dto.getName());
        role.setDescription(dto.getDescription());

        Roles savedRole = roleRepository.save(role);
        return new Roleresponsedto(savedRole.getId(), savedRole.getName(), savedRole.getDescription(), savedRole.getCreatedAt());
    }

    // ─── 2. View all available Roles ────────────────────────────────────────
    public List<Roleresponsedto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(r -> new Roleresponsedto(r.getId(), r.getName(), r.getDescription(), r.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // ─── 3. Assign / Replace multiple roles for a user ─────────────────────
    @Transactional
    public Userroleresponsedto assignRolesToUser(Integer userId, Userrolerequestdto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Set<Roles> newRoles = new HashSet<>();
        for (Role roleEnum : dto.getRoles()) {
            Roles roleEntity = roleRepository.findByName(roleEnum)
                    .orElseGet(() -> roleRepository.save(new Roles(roleEnum, roleEnum.name() + " role")));
            newRoles.add(roleEntity);
        }

        user.setRoles(newRoles);
        User updatedUser = userRepository.save(user);

        Set<Role> assignedRoleEnums = updatedUser.getRoles().stream()
                .map(Roles::getName)
                .collect(Collectors.toSet());

        return new Userroleresponsedto(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getFullName(),
                assignedRoleEnums,
                "Roles updated successfully"
        );
    }

    // ─── 4. Add a single role to user ───────────────────────────────────────
    @Transactional
    public Userroleresponsedto addRoleToUser(Integer userId, Role roleEnum) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Roles roleEntity = roleRepository.findByName(roleEnum)
                .orElseGet(() -> roleRepository.save(new Roles(roleEnum, roleEnum.name() + " role")));

        user.getRoles().add(roleEntity);
        User updatedUser = userRepository.save(user);

        Set<Role> assignedRoleEnums = updatedUser.getRoles().stream()
                .map(Roles::getName)
                .collect(Collectors.toSet());

        return new Userroleresponsedto(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getFullName(),
                assignedRoleEnums,
                "Role '" + roleEnum + "' added successfully"
        );
    }

    // ─── 5. Remove a role from user ─────────────────────────────────────────
    @Transactional
    public Userroleresponsedto removeRoleFromUser(Integer userId, Role roleEnum) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.getRoles().removeIf(r -> r.getName() == roleEnum);
        User updatedUser = userRepository.save(user);

        Set<Role> assignedRoleEnums = updatedUser.getRoles().stream()
                .map(Roles::getName)
                .collect(Collectors.toSet());

        return new Userroleresponsedto(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getFullName(),
                assignedRoleEnums,
                "Role '" + roleEnum + "' removed successfully"
        );
    }

    // ─── 6. View roles assigned to a user ──────────────────────────────────
    public Userroleresponsedto getUserRoles(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Set<Role> assignedRoleEnums = user.getRoles().stream()
                .map(Roles::getName)
                .collect(Collectors.toSet());

        return new Userroleresponsedto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                assignedRoleEnums,
                "User roles retrieved successfully"
        );
    }
}
