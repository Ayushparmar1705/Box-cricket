package com.venue_service.venue_service.Repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.venue_service.venue_service.Entity.Venueentity;

import java.util.List;

public interface Venuerepositry extends JpaRepository<Venueentity, Integer> {
    boolean existsByVenueName(String venueName);
    boolean existsByVenueNameAndIdNot(String venueName, int id);
    List<Venueentity> findByIsActive(Boolean isActive);
}
