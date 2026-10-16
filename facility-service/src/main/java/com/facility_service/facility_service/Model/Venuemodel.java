package com.facility_service.facility_service.Model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Venues")
public class Venuemodel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int owner_id;
    private String name;
    private String city;
    private String description;
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String address;
    private double longitude;
    private double latitude;
    private String google_map_link;
    private String phone_number;
    private String email;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "venue")
    private List<Venueamenitiesmodel> venue_amenities;

    private String imageUrl;
    private LocalTime opening_time;
    private LocalTime closing_time;
    private String cancellation_policy;
    
    @jakarta.persistence.Column(name = "is_active", nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("is_active")
    private boolean is_active = true;
    
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    @com.fasterxml.jackson.annotation.JsonProperty("is_active")
    public boolean is_active() {
        return is_active;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("is_active")
    public void set_active(boolean is_active) {
        this.is_active = is_active;
    }
}
