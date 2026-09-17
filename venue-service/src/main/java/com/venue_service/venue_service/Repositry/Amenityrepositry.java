package com.venue_service.venue_service.Repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.venue_service.venue_service.Entity.Amenityentity;

public interface Amenityrepositry extends JpaRepository<Amenityentity, Integer> {
    boolean existsByName(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, int id);

    List<Amenityentity> findByIsActive(boolean isActive);
}
