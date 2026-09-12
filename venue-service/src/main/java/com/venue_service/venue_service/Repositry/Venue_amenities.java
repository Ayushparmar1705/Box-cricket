package com.venue_service.venue_service.Repositry;

import java.sql.Timestamp;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venue_amenities {
    private int id;
    private String name;
    private boolean is_active;
    private Timestamp created_at;
    private Timestamp updated_at;

}
