package com.example.demo.auth_service.dto.Responsedto;

import java.time.LocalDateTime;
import java.util.Set;

public class Userresponsedto {

    private Integer id;
    private String name;
    private String email;
    private String phone;
    private Set<String> roles;
    private String primaryRole;
    private boolean active = true;
    private LocalDateTime createdAt;
    private String message;

    public Userresponsedto() {}

    public Userresponsedto(String message) {
        this.message = message;
    }

    public Userresponsedto(Integer id, String name, String email, String phone, Set<String> roles, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.roles = roles;
        if (roles != null && !roles.isEmpty()) {
            this.primaryRole = roles.iterator().next();
        }
        this.message = message;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public String getPrimaryRole() {
        return primaryRole;
    }

    public void setPrimaryRole(String primaryRole) {
        this.primaryRole = primaryRole;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}