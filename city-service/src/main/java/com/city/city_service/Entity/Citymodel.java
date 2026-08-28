package com.city.city_service.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "cities")
@Getter
@Setter
public class Citymodel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "City name is required")
    @Size(max = 100, message = "City name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotNull(message = "State ID is required")
    @Column(name = "state_id", nullable = false)
    private Long stateId;

    @CreationTimestamp
    @Column(nullable = false)
    private Date created_at;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
