package com.example.demo.auth_service.dto.Responsedto;

import java.util.List;

public class Loginresponsedto {

    private String status;
    private String token;
    private String role;
    private List<String> roles;
    private Integer userId;
    private String fullName;
    private String email;
    private String message;

    public Loginresponsedto() {}

    public Loginresponsedto(String status, String token, String role, List<String> roles, Integer userId, String fullName, String email, String message) {
        this.status = status;
        this.token = token;
        this.role = role;
        this.roles = roles;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
