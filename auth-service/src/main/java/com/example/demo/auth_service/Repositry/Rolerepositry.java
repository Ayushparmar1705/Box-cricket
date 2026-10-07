package com.example.demo.auth_service.Repositry;

import com.example.demo.auth_service.Model.Role;
import com.example.demo.auth_service.Model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface Rolerepositry extends JpaRepository<Roles, UUID> {
    Optional<Roles> findByName(Role name);
}
