package com.example.demo.auth_service.dto.Requestdto;

import com.example.demo.auth_service.Model.Role;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public class Userrolerequestdto {

    @NotEmpty(message = "At least one role must be provided")
    private Set<Role> roles;

    public Userrolerequestdto() {}

    public Userrolerequestdto(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}