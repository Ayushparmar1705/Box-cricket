package com.category.category_service.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.category.category_service.Entity.Categoryentity;
import com.category.category_service.Service.Categoryservice;

@RestController
@RequestMapping("/api/category")
public class Categorycontroller {
    private final Categoryservice service;

    public Categorycontroller(Categoryservice service) {
        this.service = service;
    }

    // Helper method to create uniform status/message maps without duplication
    private Map<String, String> createResponseMap(String status, String message) {
        Map<String, String> map = new HashMap<>();
        map.put("status", status);
        map.put("message", message);
        return map;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCategory(
            @Validated @RequestBody Categoryentity category,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        try {
            Categoryentity result = service.createCategory(category);
            if (result == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(createResponseMap("409",
                                "Category already exists with name " + category.getCategory_name()));
            } else {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(createResponseMap("201", "Category created successfully"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating category");
        }
    }

    @GetMapping("/view")
    public ResponseEntity<?> viewCategory() {
        List<Categoryentity> result = service.viewCategory();
        if (result != null) {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createResponseMap("404", "No categories found"));
        }
    }

    @PutMapping("/{status}/{id}")
    public ResponseEntity<?> categoryStatus(@PathVariable int id, @PathVariable String status) {
        try {
            service.categoryStatus(id, status);
            return ResponseEntity.status(HttpStatus.OK).body("Category status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating category status");
        }
    }
}
