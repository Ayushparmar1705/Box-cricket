package com.city.city_service.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Getter
@Setter
public class Citymodel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "state_id", nullable = false)
    private Long stateId;

    @CreationTimestamp
    @Column(nullable = false)
    private Date created_at;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
