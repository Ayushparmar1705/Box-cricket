package com.example.demo.auth_service.dto.Responsedto;

import com.example.demo.auth_service.Model.Role;

import java.time.LocalDateTime;

public class Roleresponsedto {

    private Integer id;
    private Role name;
    private String description;
    private LocalDateTime createdAt;

    public Roleresponsedto() {}

    public Roleresponsedto(Integer id, Role name, String description, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Role getName() {
        return name;
    }

    public void setName(Role name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
