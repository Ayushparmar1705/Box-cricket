package com.example.demo.auth_service.dto.Responsedto;

import com.example.demo.auth_service.Model.Role;

import java.util.Set;

public class Userroleresponsedto {

    private Integer userId;
    private String email;
    private String fullName;
    private Set<Role> roles;
    private String message;

    public Userroleresponsedto() {}

    public Userroleresponsedto(Integer userId, String email, String fullName, Set<Role> roles, String message) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
        this.message = message;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
