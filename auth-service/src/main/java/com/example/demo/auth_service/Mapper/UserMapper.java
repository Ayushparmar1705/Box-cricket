package com.example.demo.auth_service.Mapper;

import com.example.demo.auth_service.Model.User;
import com.example.demo.auth_service.dto.Requestdto.Userrequestdto;
import com.example.demo.auth_service.dto.Responsedto.Userresponsedto;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public User toEntity(Userrequestdto dto) {
        if (dto == null) {
            return null;
        }

        String displayName = dto.getDisplayName();
        String phone = dto.getPhone();
        String email = dto.getEmail();
        User user = new User();
        user.setFullName(displayName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setActive(true);
        return user;
    }

    public Userresponsedto toResponseDto(User user, String message) {
        if (user == null) {
            return null;
        }

        Set<String> roleNames;
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            roleNames = user.getRoles().stream()
                    .filter(r -> r != null && r.getName() != null)
                    .map(r -> r.getName().name())
                    .collect(Collectors.toSet());
        } else {
            roleNames = new HashSet<>();
        }

        Userresponsedto response = new Userresponsedto();
        response.setId(user.getId());
        response.setName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRoles(roleNames);
        if (!roleNames.isEmpty()) {
            response.setPrimaryRole(roleNames.iterator().next());
        }
        response.setActive(user.isActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setMessage(message != null ? message : "Success");
        return response;
    }

    public Userresponsedto toResponseDto(User user) {
        return toResponseDto(user, "Success");
    }
}
