package com.example.demo.auth_service.Repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.auth_service.Model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepositry extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findById(int id);
    Optional<User> findByEmailAndPasswordHash(String email, String passwordHash);
}
