package com.example.demo.auth_service.dto.Requestdto;

import com.example.demo.auth_service.Model.Role;
import jakarta.validation.constraints.NotNull;

public class Rolerequestdto {

    @NotNull(message = "Role name is required")
    private Role name;

    private String description;

    public Rolerequestdto() {}

    public Rolerequestdto(Role name, String description) {
        this.name = name;
        this.description = description;
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
}
