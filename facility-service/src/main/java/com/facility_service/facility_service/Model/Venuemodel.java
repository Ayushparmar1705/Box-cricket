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
import java.util.Date;
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
    private int city;
    private String description;
    private double longitude;
    private double latitude;
    private String google_map_link;
    private String phone_number;
    private String email;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Venueamenitiesmodel> venue_amenities;

    private Date opening_time;
    private Date closing_time;
    private String cancellation_policy;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}
