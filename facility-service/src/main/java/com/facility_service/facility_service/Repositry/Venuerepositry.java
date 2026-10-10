package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.Venuemodel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Venuerepositry extends JpaRepository<Venuemodel, Integer> {
    boolean existsByName(String name);
}
