package com.location.location_service.Entity;

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

import java.util.Date;

@Entity
@Table(name = "cities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cityentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "City name is required")
    @Size(max = 100, message = "City name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    @JsonIgnoreProperties({"cities", "hibernateLazyInitializer", "handler"})
    private Stateentity state;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Date created_at;

    @JsonProperty("is_active")
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public Cityentity(String name, Stateentity state, boolean active) {
        this.name = name;
        this.state = state;
        this.active = active;
    }

    @JsonProperty("stateId")
    public Long getStateId() {
        return state != null ? state.getId() : null;
    }

    @JsonProperty("stateName")
    public String getStateName() {
        return state != null ? state.getName() : null;
    }

    @JsonProperty("countryId")
    public Long getCountryId() {
        return (state != null && state.getCountry() != null) ? state.getCountry().getId() : null;
    }

    @JsonProperty("countryName")
    public String getCountryName() {
        return (state != null && state.getCountry() != null) ? state.getCountry().getName() : null;
    }
}
