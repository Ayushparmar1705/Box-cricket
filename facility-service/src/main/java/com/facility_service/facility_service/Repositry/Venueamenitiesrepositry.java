package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.Venueamenitiesmodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Venueamenitiesrepositry extends JpaRepository<Venueamenitiesmodel, Integer> {
    // Basic CRUD operations are provided automatically by JpaRepository
}
