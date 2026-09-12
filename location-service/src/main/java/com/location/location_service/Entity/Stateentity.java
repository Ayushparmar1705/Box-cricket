package com.location.location_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "states")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Stateentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "State name is required")
    @Size(max = 100, message = "State name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    @JsonIgnoreProperties({"states", "hibernateLazyInitializer", "handler"})
    private Countryentity country;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Date created_at;

    @JsonProperty("is_active")
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "state", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cityentity> cities = new ArrayList<>();

    public Stateentity(String name, Countryentity country, boolean active) {
        this.name = name;
        this.country = country;
        this.active = active;
    }

    @JsonProperty("countryId")
    public Long getCountryId() {
        return country != null ? country.getId() : null;
    }

    @JsonProperty("countryName")
    public String getCountryName() {
        return country != null ? country.getName() : null;
    }
}
