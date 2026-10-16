package com.facility_service.facility_service.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "venue_amenities")
public class Venueamenitiesmodel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    @JsonIgnore
    private Venuemodel venue;

    private String venue_amenity;

    public Venueamenitiesmodel(Venuemodel venue, String venue_amenity) {
        this.venue = venue;
        this.venue_amenity = venue_amenity;
    }

    public Venueamenitiesmodel(String venue_amenity) {
        this.venue_amenity = venue_amenity;
    }
}
