package com.state.state_service.Model;

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
@Table(name = "states")
@Getter
@Setter
public class Statemodel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "State name is required")
    @Size(max = 100, message = "State name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotNull(message = "Country ID is required")
    @Column(name = "country_id", nullable = false)
    private Long countryId;

    @CreationTimestamp
    @Column(nullable = false)
    private Date created_at;

    @JsonProperty("is_active")
    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
