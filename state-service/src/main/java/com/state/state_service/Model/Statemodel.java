package com.state.state_service.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Getter
@Setter
public class Statemodel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "country_id", nullable = false)
    private Long countryId;

    @CreationTimestamp
    @Column(nullable = false)
    private Date created_at;

    @JsonProperty("is_active")
    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
