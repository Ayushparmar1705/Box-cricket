package com.location.location_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "countries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Countryentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Country name is required")
    @Size(max = 100, message = "Country name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Country code is required")
    @Size(min = 2, max = 10, message = "Country code must be between 2 and 10 characters")
    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Date created_at;

    @JsonProperty("is_active")
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "country", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Stateentity> states = new ArrayList<>();

    public Countryentity(String name, String code, boolean active) {
        this.name = name;
        this.code = code;
        this.active = active;
    }
}
